import json
import boto3
import fitbit
import datetime

dynamodb = boto3.resource('dynamodb')

def hello(token):
    table = dynamodb.Table('weight')
    table.put_item(
       Item={
            'id': 'joe',
            'creds': json.dumps(token)
        }
    )

def lambda_handler(event, context):
    table = dynamodb.Table('weight')
    response = table.get_item(Key={'id': 'joe'})
    creds = json.loads(response['Item']['creds'])

    client = fitbit.Fitbit(client_id="22BJQW",
                                      client_secret="516c12387e20ea5f5d2516d06a44bdd8",
                                      refresh_token=creds['refresh_token'],
                                      access_token=creds['access_token'],
                                      refresh_cb=hello)
    client.client.refresh_token()

    response = fetch(client)

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

def weight(client, d_from, d_to):
    weights = client.get_bodyweight(base_date=d_from, end_date=d_to)["weight"]

    a = []
    for item in weights:
      a.append(fw_to_w(item))

    return a


def calories(client, d_from, d_to):
    calories = client.time_series( resource="foods/log/caloriesIn", base_date=d_from, end_date=d_to)
    
    count = []
    for item in calories["foods-log-caloriesIn"]:
        count.append(item)

    return count


def exercise(client, d_from, d_to):
    exercises = client.time_series(
        resource="activities/log/tracker/activityCalories",
        base_date=d_from,
        end_date=d_to,
    )

    count = []
    for item in exercises["activities-log-tracker-activityCalories"]:
        count.append(item)
    return count

def fetch(client):
    d = '2022-01-03'
    d_from = datetime.datetime.strptime(d, "%Y-%m-%d")
    d_to = d_from + datetime.timedelta(days=4 * 7 - 1)
    if d_to > datetime.datetime.now():
        d_to = datetime.datetime.now()

    w = weight(client, d_from, d_to)
    c = calories(client, d_from, d_to)
    e = exercise(client, d_from, d_to)

    result = []
    for i in range(len(w)):
        total_weight = round(w[i]['total'], 1)
        lean = round(w[i]['lean'], 1)
        fat = round(w[i]['fat'], 1)
        diff = int(float(c[i]['value']) - float(e[i]['value']))
        result.append({
            "date": w[i]['dateTime'],
            "totalWeight": total_weight,
            "lean": lean,
            "fat": fat,
            "exercise": e[i]['value'],
            "ate": c[i]['value'],
            "diff": diff
        })

    return result
