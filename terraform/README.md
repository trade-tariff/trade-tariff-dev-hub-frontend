# trade-tariff-duty-calculator terraform

Terraform to deploy the service into AWS.
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | 1.8.2 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 4 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 4.67.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_service"></a> [service](#module\_service) | git@github.com:trade-tariff/trade-tariff-platform-terraform-modules.git//aws/ecs-service | aws/ecs-service-v1.12.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.exec](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.task](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy_document.exec](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.task](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_kms_key.secretsmanager_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/kms_key) | data source |
| [aws_lb_target_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/lb_target_group) | data source |
| [aws_secretsmanager_secret.application_support_email](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.cognito_client_id](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.cognito_client_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.cookie_signing_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.csrf_signing_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.govuk_notify_api_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.scp_open_id_client_id](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.scp_open_id_client_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_secretsmanager_secret.scp_open_id_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret) | data source |
| [aws_security_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/security_group) | data source |
| [aws_ssm_parameter.ecr_url](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ssm_parameter) | data source |
| [aws_subnets.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnets) | data source |
| [aws_vpc.vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_base_domain"></a> [base\_domain](#input\_base\_domain) | URL of the service. | `string` | n/a | yes |
| <a name="input_cpu"></a> [cpu](#input\_cpu) | CPU units to use. | `number` | n/a | yes |
| <a name="input_deletion_enabled"></a> [deletion\_enabled](#input\_deletion\_enabled) | Sets DELETION\_ENABLED and determines whether to enable deletion of keys in the hub UI. | `bool` | n/a | yes |
| <a name="input_docker_tag"></a> [docker\_tag](#input\_docker\_tag) | Image tag to use. | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Deployment environment. | `string` | n/a | yes |
| <a name="input_eori_lookup_url"></a> [eori\_lookup\_url](#input\_eori\_lookup\_url) | EORI number validation api. | `string` | n/a | yes |
| <a name="input_feedback_url"></a> [feedback\_url](#input\_feedback\_url) | Feedback URL. | `string` | n/a | yes |
| <a name="input_log_level"></a> [log\_level](#input\_log\_level) | Log level. Defaults to info. One of debug, info, warn, error. | `string` | n/a | yes |
| <a name="input_max_capacity"></a> [max\_capacity](#input\_max\_capacity) | Largest number of tasks the service can scale-out to. | `number` | n/a | yes |
| <a name="input_memory"></a> [memory](#input\_memory) | Memory to allocate in MB. Powers of 2 only. | `number` | n/a | yes |
| <a name="input_min_capacity"></a> [min\_capacity](#input\_min\_capacity) | Smallest number of tasks the service can scale-in to. | `number` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | AWS region to use. | `string` | n/a | yes |
| <a name="input_registration_template_id"></a> [registration\_template\_id](#input\_registration\_template\_id) | Registration email template id. | `string` | n/a | yes |
| <a name="input_scp_open_id_issuer_base_url"></a> [scp\_open\_id\_issuer\_base\_url](#input\_scp\_open\_id\_issuer\_base\_url) | SCP Open ID Issuer Base URL. | `string` | n/a | yes |
| <a name="input_service_count"></a> [service\_count](#input\_service\_count) | Number of services to use. | `number` | n/a | yes |
| <a name="input_support_template_id"></a> [support\_template\_id](#input\_support\_template\_id) | Support email template id. | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
