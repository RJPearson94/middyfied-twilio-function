# Infrastructure

This folder contains the Infrastructure as Code (Terraform) for provisioning the middyfied Twilio function.

Before the infrastructure can be provisioned, the lambda artifact zip must be generated in the `dist` folder. To generate the function artifact, see the project [README](../README.md) for instructions.

Documentation generated using [terraform-docs](https://github.com/terraform-docs/terraform-docs)

## Requirements

| Name                                                                     | Version   |
| ------------------------------------------------------------------------ | --------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.0    |
| <a name="requirement_twilio"></a> [twilio](#requirement_twilio)          | >= 0.16.0 |

## Providers

| Name                                                      | Version |
| --------------------------------------------------------- | ------- |
| <a name="provider_twilio"></a> [twilio](#provider_twilio) | 0.16.0  |

## Modules

No modules.

## Resources

| Name                                                                                                                                                       | Type     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [twilio_messaging_phone_number.phone_number](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/messaging_phone_number)      | resource |
| [twilio_messaging_service.service](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/messaging_service)                     | resource |
| [twilio_serverless_build.build](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_build)                         | resource |
| [twilio_serverless_deployment.deployment](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_deployment)          | resource |
| [twilio_serverless_environment.environment](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_environment)       | resource |
| [twilio_serverless_function.function](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_function)                | resource |
| [twilio_serverless_service.service](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_service)                   | resource |
| [twilio_serverless_variable.messaging_service_sid](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_variable)   | resource |
| [twilio_serverless_variable.supported_carrier_types](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_variable) | resource |
| [twilio_serverless_variable.supported_country_codes](https://registry.terraform.io/providers/RJPearson94/twilio/latest/docs/resources/serverless_variable) | resource |

## Inputs

| Name                                                                                                   | Description                                                                                              | Type                                                                          | Default                        | Required |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------ | :------: |
| <a name="input_domain_suffix"></a> [domain_suffix](#input_domain_suffix)                               | An optional suffix to append to the functions domain                                                     | `string`                                                                      | `null`                         |    no    |
| <a name="input_friendly_name"></a> [friendly_name](#input_friendly_name)                               | The friendly name for the services                                                                       | `string`                                                                      | `"middyfied-twilio-function"`  |    no    |
| <a name="input_path"></a> [path](#input_path)                                                          | The request URI path                                                                                     | `string`                                                                      | `"/example"`                   |    no    |
| <a name="input_phone_number_sid"></a> [phone_number_sid](#input_phone_number_sid)                      | The SID of a phone number to associate with the messaging service                                        | `string`                                                                      | n/a                            |   yes    |
| <a name="input_polling"></a> [polling](#input_polling)                                                 | Override the default serverles build polling configuration                                               | <pre>object({<br> max_attempts = number<br> delay_in_ms = number<br> })</pre> | `null`                         |    no    |
| <a name="input_resource_suffix"></a> [resource_suffix](#input_resource_suffix)                         | An optional suffix to append to the resource names                                                       | `string`                                                                      | `null`                         |    no    |
| <a name="input_supported_carrier_types"></a> [supported_carrier_types](#input_supported_carrier_types) | A list of supported carrier types or ALL to not apply a restriction on carriers                          | `list(string)`                                                                | <pre>[<br> "mobile"<br>]</pre> |    no    |
| <a name="input_supported_country_codes"></a> [supported_country_codes](#input_supported_country_codes) | A list of supported country codes to send messages to or ALL to not apply a restriction on country codes | `list(string)`                                                                | <pre>[<br> "GB"<br>]</pre>     |    no    |
| <a name="input_unique_name"></a> [unique_name](#input_unique_name)                                     | The unique name for the services                                                                         | `string`                                                                      | `"middyfied-twilio-function"`  |    no    |
| <a name="input_visibility"></a> [visibility](#input_visibility)                                        | The visibility of the function                                                                           | `string`                                                                      | `"public"`                     |    no    |

## Outputs

| Name                                                                    | Description                      |
| ----------------------------------------------------------------------- | -------------------------------- |
| <a name="output_function_url"></a> [function_url](#output_function_url) | The url of the deployed function |
