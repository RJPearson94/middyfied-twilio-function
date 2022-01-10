terraform {
  required_version = ">= 1.0"

  required_providers {
    twilio = {
      source  = "RJPearson94/twilio"
      version = ">= 0.16.0"
    }
  }
}
