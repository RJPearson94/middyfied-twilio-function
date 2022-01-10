locals {
  resource_suffix = var.resource_suffix == null ? "" : "-${var.resource_suffix}"
  artifact_source = "${path.module}/dist/main.js"
}

// Messaging Service

resource "twilio_messaging_service" "service" {
  friendly_name = "${var.friendly_name}${local.resource_suffix}"
}

resource "twilio_messaging_phone_number" "phone_number" {
  service_sid = twilio_messaging_service.service.sid
  sid         = var.phone_number_sid
}

// Twilio Functions

resource "twilio_serverless_service" "service" {
  unique_name         = "${var.unique_name}${local.resource_suffix}"
  friendly_name       = "${var.friendly_name}${local.resource_suffix}"
  include_credentials = true
  ui_editable         = false
}

resource "twilio_serverless_function" "function" {
  service_sid   = twilio_serverless_service.service.sid
  friendly_name = "${var.friendly_name}${local.resource_suffix}"
  source        = local.artifact_source
  source_hash   = filebase64sha256(local.artifact_source)
  content_type  = "application/javascript"
  path          = var.path
  visibility    = var.visibility
}

resource "twilio_serverless_build" "build" {
  service_sid = twilio_serverless_service.service.sid

  function_version {
    sid = twilio_serverless_function.function.latest_version_sid
  }

  runtime = "node12"

  dependencies = {
    "@twilio/runtime-handler" = "1.2.0",
    "fs"                      = "0.0.1-security",
    "lodash"                  = "4.17.21",
    "twilio"                  = "3.69.0",
    "util"                    = "0.12.4",
    "xmldom"                  = "0.6.0"
  }

  polling {
    enabled      = true
    max_attempts = var.polling == null ? null : var.polling.max_attempts
    delay_in_ms  = var.polling == null ? null : var.polling.delay_in_ms
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "twilio_serverless_environment" "environment" {
  service_sid   = twilio_serverless_service.service.sid
  unique_name   = "${var.unique_name}${local.resource_suffix}"
  domain_suffix = var.domain_suffix
}

resource "twilio_serverless_variable" "messaging_service_sid" {
  service_sid     = twilio_serverless_service.service.sid
  environment_sid = twilio_serverless_environment.environment.sid
  key             = "TWILIO_MESSAGING_SERVICE_SID"
  value           = twilio_messaging_service.service.sid
}

resource "twilio_serverless_variable" "supported_carrier_types" {
  service_sid     = twilio_serverless_service.service.sid
  environment_sid = twilio_serverless_environment.environment.sid
  key             = "SUPPORTED_CARRIER_TYPES"
  value           = join(",", var.supported_carrier_types)
}

resource "twilio_serverless_variable" "supported_country_codes" {
  service_sid     = twilio_serverless_service.service.sid
  environment_sid = twilio_serverless_environment.environment.sid
  key             = "SUPPORTED_COUNTRY_CODES"
  value           = join(",", var.supported_country_codes)
}

resource "twilio_serverless_deployment" "deployment" {
  service_sid     = twilio_serverless_service.service.sid
  environment_sid = twilio_serverless_environment.environment.sid
  build_sid       = twilio_serverless_build.build.sid

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    twilio_serverless_variable.messaging_service_sid,
    twilio_serverless_variable.supported_carrier_types,
    twilio_serverless_variable.supported_country_codes,
  ]
}
