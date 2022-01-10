output "function_url" {
  description = "The url of the deployed function"
  value       = "https://${twilio_serverless_environment.environment.domain_name}${twilio_serverless_function.function.path}"
}
