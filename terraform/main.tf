module "service" {
  source = "git@github.com:trade-tariff/trade-tariff-platform-terraform-modules.git//aws/ecs-service?ref=aws/ecs-service-v1.12.0"

  region = var.region

  service_name  = local.service
  service_count = var.service_count

  cluster_name              = "trade-tariff-cluster-${var.environment}"
  subnet_ids                = data.aws_subnets.private.ids
  security_groups           = [data.aws_security_group.this.id]
  target_group_arn          = data.aws_lb_target_group.this.arn
  cloudwatch_log_group_name = "platform-logs-${var.environment}"

  min_capacity = var.min_capacity
  max_capacity = var.max_capacity

  docker_image = data.aws_ssm_parameter.ecr_url.value
  docker_tag   = var.docker_tag
  skip_destroy = true

  container_port = 8080

  cpu    = var.cpu
  memory = var.memory

  task_role_policy_arns = [
    aws_iam_policy.task.arn
  ]

  execution_role_policy_arns = [
    aws_iam_policy.exec.arn
  ]

  enable_ecs_exec = true

  service_environment_config = [
    {
      name  = "API_BASE_URL"
      value = "http://hub-backend.tariff.internal:8080"
    },
    {
      name  = "PORT"
      value = "8080"
    },
    {
      name  = "COGNITO_AUTH_URL"
      value = "https://auth.${var.base_domain}/oauth2/token"
    },
    {
      name  = "SCP_OPEN_ID_BASE_URL"
      value = "https://hub.${var.base_domain}"
    },
    {
      name  = "SCP_OPEN_ID_CALLBACK_PATH"
      value = "/auth/redirect"
    },
    {
      name  = "SCP_OPEN_ID_ISSUER_BASE_URL"
      value = var.scp_open_id_issuer_base_url
    },
    {
      name  = "GOVUK_APP_DOMAIN"
      value = "hub.${var.base_domain}"
    },
    {
      name  = "SENTRY_ENVIRONMENT"
      value = var.environment
    },
    {
      name  = "DELETION_ENABLED"
      value = var.deletion_enabled
    },
    {
      name  = "FEEDBACK_URL"
      value = var.feedback_url
    },
    {
      name  = "LOG_LEVEL"
      value = var.log_level
    }
  ]

  service_secrets_config = [
    {
      name      = "COGNITO_CLIENT_ID"
      valueFrom = data.aws_secretsmanager_secret.cognito_client_id.arn
    },
    {
      name      = "COGNITO_CLIENT_SECRET"
      valueFrom = data.aws_secretsmanager_secret.cognito_client_secret.arn
    },
    {
      name      = "SCP_OPEN_ID_CLIENT_ID"
      valueFrom = data.aws_secretsmanager_secret.scp_open_id_client_id.arn
    },
    {
      name      = "SCP_OPEN_ID_SECRET"
      valueFrom = data.aws_secretsmanager_secret.scp_open_id_secret.arn
    },
    {
      name      = "SCP_OPEN_ID_CLIENT_SECRET"
      valueFrom = data.aws_secretsmanager_secret.scp_open_id_client_secret.arn
    }
  ]
}
