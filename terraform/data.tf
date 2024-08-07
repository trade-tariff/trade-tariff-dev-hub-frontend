data "aws_vpc" "vpc" {
  tags = { Name = "trade-tariff-${var.environment}-vpc" }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc.id]
  }

  tags = {
    Name = "*private*"
  }
}

data "aws_lb_target_group" "this" {
  name = "hub-frontend"
}

data "aws_security_group" "this" {
  name = "trade-tariff-ecs-security-group-${var.environment}"
}

data "aws_kms_key" "secretsmanager_key" {
  key_id = "alias/secretsmanager-key"
}

data "aws_ssm_parameter" "ecr_url" {
  name = "/${var.environment}/FPO_DEVELOPER_HUB_FRONTEND_ECR_URL"
}

data "aws_secretsmanager_secret" "cognito_client_id" {
  name = "cognito-fpo-client-id"
}

data "aws_secretsmanager_secret" "cognito_client_secret" {
  name = "cognito-fpo-client-secret"
}

data "aws_secretsmanager_secret" "scp_open_id_client_id" {
  name = "dev-hub-frontend-scp-open-id-client-id"
}

data "aws_secretsmanager_secret" "scp_open_id_client_secret" {
  name = "dev-hub-frontend-scp-open-id-client-secret"
}

data "aws_secretsmanager_secret" "scp_open_id_secret" {
  name = "dev-hub-frontend-scp-open-id-secret"
}

data "aws_secretsmanager_secret" "govuk_notify_api_key" {
  name = "dev-hub-frontend-govuk-notify-api-key"
}

data "aws_secretsmanager_secret" "application_support_email" {
  name = "dev-hub-frontend-application-support-email"
}

data "aws_secretsmanager_secret" "cookie_signing_secret" {
  name = "dev-hub-frontend-cookie-signing-secret"
}
data "aws_secretsmanager_secret" "csrf_signing_secret" {
  name = "dev-hub-frontend-csrf-signing-secret"
}
