terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

# LAMBDA

module "python_lambda_archive" {
  source = "rojopolis/lambda-python-archive/aws"

  src_dir     = "${path.module}/src"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "weight_app" {
  function_name = "WeightApp"

  runtime = "python3.11"
  handler = "health.lambda_handler"

  role = aws_iam_role.lambda_exec.arn

  filename         = module.python_lambda_archive.archive_path
  source_code_hash = module.python_lambda_archive.source_code_hash
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [{
      "Effect" : "Allow",
      "Action" : [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource" : "arn:aws:dynamodb:eu-west-2:140551133576:table/weight"
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "weight_app" {
  name = "/aws/lambda/${aws_lambda_function.weight_app.function_name}"

  retention_in_days = 30
}

# DYNAMODB

resource "aws_dynamodb_table" "weight" {
  name         = "weight"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"
  attribute {
    name = "id"
    type = "S"
  }
}

# API GATEWAY

resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "serverless_lambda_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "weight_app" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.weight_app.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "weight_app" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /weight"
  target    = "integrations/${aws_apigatewayv2_integration.weight_app.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.weight_app.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}
