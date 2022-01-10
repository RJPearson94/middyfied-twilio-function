variable "phone_number_sid" {
  description = "The SID of a phone number to associate with the messaging service"
  type        = string

  validation {
    condition     = can(regex("^PN[0-9a-fA-F]{32}$", var.phone_number_sid))
    error_message = "The Phone Number SID must be in the format `^PN[0-9a-fA-F]{32}$`."
  }
}

variable "supported_carrier_types" {
  description = "A list of supported carrier types or ALL to not apply a restriction on carriers"
  type        = list(string)
  default     = ["mobile"]

  validation {
    condition     = length(var.supported_carrier_types) > 0
    error_message = "At least 1 supported carrier type or the ALL keyword must be specified."
  }
}

variable "supported_country_codes" {
  description = "A list of supported country codes to send messages to or ALL to not apply a restriction on country codes"
  type        = list(string)
  default     = ["GB"]

  validation {
    condition     = length(var.supported_country_codes) > 0
    error_message = "At least 1 supported country code or the ALL keyword must be specified."
  }
}

variable "unique_name" {
  description = "The unique name for the services"
  type        = string
  default     = "middyfied-twilio-function"
}

variable "friendly_name" {
  description = "The friendly name for the services"
  type        = string
  default     = "middyfied-twilio-function"
}

variable "path" {
  description = "The request URI path"
  type        = string
  default     = "/example"
}

variable "visibility" {
  description = "The visibility of the function"
  type        = string
  default     = "public"
}

variable "domain_suffix" {
  description = "An optional suffix to append to the functions domain"
  type        = string
  default     = null
}

variable "resource_suffix" {
  description = "An optional suffix to append to the resource names"
  type        = string
  default     = null
}

variable "polling" {
  description = "Override the default serverles build polling configuration"
  type = object({
    max_attempts = number
    delay_in_ms  = number
  })
  default = null
}
