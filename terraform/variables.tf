variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "region" {
  description = "AWS region to use."
  type        = string
}

variable "docker_tag" {
  description = "Image tag to use."
  type        = string
}

variable "service_count" {
  description = "Number of services to use."
  type        = number
}

variable "min_capacity" {
  description = "Smallest number of tasks the service can scale-in to."
  type        = number
}

variable "max_capacity" {
  description = "Largest number of tasks the service can scale-out to."
  type        = number
}

variable "base_domain" {
  description = "URL of the service."
  type        = string
}

variable "cpu" {
  description = "CPU units to use."
  type        = number
}

variable "memory" {
  description = "Memory to allocate in MB. Powers of 2 only."
  type        = number
}

variable "scp_open_id_issuer_base_url" {
  description = "SCP Open ID Issuer Base URL."
  type        = string
}

variable "deletion_enabled" {
  description = "Sets DELETION_ENABLED and determines whether to enable deletion of keys in the hub UI."
  type        = bool
}

variable "feedback_url" {
  description = "Feedback URL."
  type        = string
}

variable "log_level" {
  description = "Log level. Defaults to info. One of debug, info, warn, error."
  type        = string
}

variable "eori_lookup_url" {
  description = "EORI number validation api."
  type        = string
}
