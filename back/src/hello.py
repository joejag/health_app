import pprint
import json
import boto3
import fitbit
import datetime
import os

dynamodb = boto3.resource('dynamodb')

START_DATE = '2022-04-25'


def hello(token):
    table = dynamodb.Table('weight')
    table.put_item(
        Item={
            'id': 'joe',
            'creds': json.dumps(token)
        }
    )


def lambda_handler(event, context):
    client = login_to_fitbit()
    d_from = datetime.datetime.strptime(START_DATE, "%Y-%m-%d")
    response = fetch(client, d_from)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'content-type': 'application/json'
        },
        'body': json.dumps(response)
    }


def login_to_fitbit():
    table = dynamodb.Table('weight')
    response = table.get_item(Key={'id': 'joe'})
    creds = json.loads(response['Item']['creds'])
    client = fitbit.Fitbit(client_id="22BJQW",
                           client_secret="516c12387e20ea5f5d2516d06a44bdd8",
                           refresh_token=creds['refresh_token'],
                           access_token=creds['access_token'],
                           refresh_cb=hello)
    client.client.refresh_token()
    return client


def lbs_to_kgs(lbs):
    return lbs * 0.453592


def fw_to_w(item):
    date = item['date']
    weight = lbs_to_kgs(item["weight"])
    fat = item.get("fat")
    lean = 0
    if fat != None:
        fat = fat * weight * 0.01
        lean = weight - fat
    else:
        fat = 0
    return {"dateTime": date, "total": float(weight), "lean": float(lean), "fat": float(fat)}


def fetch_weight(client, d_from, d_to):
    weights = client.get_bodyweight(base_date=d_from, end_date=d_to)["weight"]

    a = []
    for item in weights:
        a.append(fw_to_w(item))

    return a


def fetch_calories(client, d_from, d_to):
    calories = client.time_series(
        resource="foods/log/caloriesIn", base_date=d_from, end_date=d_to)

    count = []
    for item in calories["foods-log-caloriesIn"]:
        count.append(item)

    return count


def fetch_exercise(client, d_from, d_to):
    exercises = client.time_series(
        resource="activities/log/tracker/activityCalories",
        base_date=d_from,
        end_date=d_to,
    )

    count = []
    for item in exercises["activities-log-tracker-activityCalories"]:
        count.append(item)
    return count


def fetch(client, d_from):
    d_to = d_from + datetime.timedelta(days=4 * 7 - 1)
    if d_to > datetime.datetime.now():
        d_to = datetime.datetime.now()

    w = fetch_weight(client, d_from, d_to)
    c = fetch_calories(client, d_from, d_to)
    e = fetch_exercise(client, d_from, d_to)
    # w = cachable('weight.json', lambda: fetch_weight(client, d_from, d_to))
    # c = cachable('cals.json', lambda: fetch_calories(client, d_from, d_to))
    # e = cachable('exercise.json', lambda: fetch_exercise(client, d_from, d_to))

    merged = {}
    for exercise in e:
        dt = exercise['dateTime']
        current = merged.get(dt, {})
        current['e'] = exercise
        merged[dt] = current
    for weight in w:
        dt = weight['dateTime']
        current = merged.get(dt, {})
        current['w'] = weight
        merged[dt] = current
    for calories in c:
        dt = calories['dateTime']
        current = merged.get(dt, {})
        current['c'] = calories
        merged[dt] = current

    result = []
    for dateTime in merged:
        day = merged[dateTime]
        if 'w' in day:
            total_weight = round(day['w']['total'], 1)
            lean = round(day['w']['lean'], 1)
            fat = round(day['w']['fat'], 1)
        diff = int(float(day['c']['value']) - float(day['e']['value']))
        result.append({
            "date": dateTime,
            "totalWeight": total_weight,
            "lean": lean,
            "fat": fat,
            "exercise": day['e']['value'],
            "ate": day['c']['value'],
            "diff": diff
        })

    return result


def cachable(name, fn):
    if os.path.isfile(name):
        with open(name) as json_file:
            return json.load(json_file)
    else:
        result = fn()
        with open(name, 'w') as outfile:
            outfile.write(json.dumps(result))
        return result


# pp = pprint.PrettyPrinter(indent=4)
# pp.pprint(lambda_handler({}, {}))
