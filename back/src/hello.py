import datetime
import calendar
import json
import boto3
import fitbit
import jwt

dynamodb = boto3.resource("dynamodb")


def fetch_historical(start_date):
    table = dynamodb.Table("weight")
    response = table.get_item(Key={"id": start_date})
    if "Item" not in response:
        client = login_to_fitbit()
        w = fetch_weight(client, start_date, start_date)[0]
        table.put_item(Item={"id": start_date, "weight": json.dumps(w)})

    response = json.loads(table.get_item(Key={"id": start_date})["Item"]["weight"])
    response["total"] = round(response["total"], 0)
    response["fat"] = round(response["fat"], 0)
    response["lean"] = round(response["lean"], 0)
    response["date"] = datetime.datetime.strptime(
        response["dateTime"], "%Y-%m-%d"
    ).isoformat()
    return response


def lambda_handler(event, context):
    if "historical" in event.get("queryStringParameters"):
        dates = event["queryStringParameters"]["historical"].split(",")
        response = list(map(fetch_historical, dates))
    else:
        from_date = event.get("queryStringParameters").get("from_date")
        client = login_to_fitbit()
        response = fetch(client, datetime.datetime.strptime(from_date, "%Y-%m-%d"))

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "content-type": "application/json",
        },
        "body": json.dumps(response),
    }


def store_fitbit_token(token):
    table = dynamodb.Table("weight")
    table.put_item(Item={"id": "joe", "creds": json.dumps(token)})


def login_to_fitbit():
    table = dynamodb.Table("weight")
    response = table.get_item(Key={"id": "joe"})
    creds = json.loads(response["Item"]["creds"])
    client = fitbit.Fitbit(
        client_id="22BJQW",
        client_secret="516c12387e20ea5f5d2516d06a44bdd8",
        refresh_token=creds["refresh_token"],
        access_token=creds["access_token"],
        refresh_cb=store_fitbit_token,
    )
    try:
        jwt.decode(
            creds["access_token"],
            algorithms=["HS256"],
            options={"verify_signature": False},
        )
    except jwt.ExpiredSignatureError:
        client.client.refresh_token()
    return client


def lbs_to_kgs(lbs):
    return lbs * 0.453592


def fw_to_w(item):
    date = item["date"]
    weight = lbs_to_kgs(item["weight"])
    fat = item.get("fat")
    lean = 0
    if fat != None:
        fat = fat * weight * 0.01
        lean = weight - fat
    else:
        fat = 0
    return {
        "dateTime": date,
        "total": float(weight),
        "lean": float(lean),
        "fat": float(fat),
    }


def fetch_weight(client, d_from, d_to):
    weights = client.get_bodyweight(base_date=d_from, end_date=d_to)["weight"]

    a = []
    for item in weights:
        a.append(fw_to_w(item))

    return a


def fetch_calories(client, d_from, d_to):
    calories = client.time_series(
        resource="foods/log/caloriesIn", base_date=d_from, end_date=d_to
    )

    count = []
    for item in calories["foods-log-caloriesIn"]:
        count.append(item)

    return count


def fetch(client, d_from):
    _, end_day = calendar.monthrange(d_from.year, d_from.month)
    d_to = datetime.datetime(d_from.year, d_from.month, end_day)
    if d_to > datetime.datetime.now():
        d_to = datetime.datetime.now()

    w = fetch_weight(client, d_from, d_to)
    c = fetch_calories(client, d_from, d_to)

    merged = {}
    for weight in w:
        dt = weight["dateTime"]
        current = merged.get(dt, {})
        current["w"] = weight
        merged[dt] = current
    for calories in c:
        dt = calories["dateTime"]
        current = merged.get(dt, {})
        current["c"] = calories
        merged[dt] = current

    result = []
    for dateTime in merged:
        day = merged[dateTime]
        if "w" in day:
            total_weight = round(day["w"]["total"], 1)
            lean = round(day["w"]["lean"], 1)
            fat = round(day["w"]["fat"], 1)
            result.append(
                {
                    "date": dateTime,
                    "totalWeight": total_weight,
                    "lean": lean,
                    "fat": fat,
                    "ate": day["c"]["value"],
                }
            )

    return sorted(result, key=lambda r: r["date"])
