# Middyfied Twilio Function

This is an example Twilio function that is invoked by an API call which sends an SMS using Twilio Messaging Service. Feel free to modify the application code and infrastructure as code (Terraform) to meet your specific requirements.

The [Twilio function](https://www.twilio.com/docs/runtime/functions) is written in [TypeScript](https://www.typescriptlang.org/) with tests written using the [Jest testing framework](https://jestjs.io/), the function is triggered by an API call before sending an SMS to a phone number using [Twilio Messaging Service](https://www.twilio.com/docs/messaging/services).

## Getting Started

To install the dependencies, please run the following command:

```sh
yarn install
```

To run the tests, please run the following command:

```sh
yarn test
```

[esbuild](https://github.com/evanw/esbuild) is used to build the function artifact that is deployed to Twilio functions. To build the artifact, please run the following command

```sh
yarn build
```

[Prettier](https://prettier.io/) is used to format the code and [eslint](https://eslint.org/) is used to lint the JavaScript and TypeScript code. [Husky](https://github.com/typicode/husky) is used to provide git hooks to lint and format the code before any changes are committed, this uses [lint-staged](https://github.com/okonet/lint-staged). Husky is also used to ensure any commit message complies with the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

## Deploying the application

To be able to deploy the middyfied Twilio function onto Twilio, you need the following:

- [Twilio Account](https://www.twilio.com/) (with a phone number)
- [Terraform](https://www.terraform.io/) (v1.0 or above)
- Function artifact generated - see the instructions above on how to build the artifact

The Infrastructure as Code (IaC) for the middyfied Twilio function can be seen in the [infrastructure](./infrastructure) folder. The [README](./infrastructure/README.md) documents what resources will be provisioned/ configured. The README also includes all the inputs that can be supplied to configure the middyfied Twilio function and the default value where appropriate.

These inputs can either be inputted when prompted, passed as a variable (`-var`) command-line argument i.e. `-var phone_number_sid=PNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` or specified in a Terraform variables file `*.tfvars` which can be passed to a Terraform command using the `-var-file` command-line argument i.e. `-var-file=<<path to variable file>>`.

To download the community Twilio provider, please run the following command

```sh
terraform -chdir=infrastructure init
```

To see what changes will be made, please run the following command

```sh
terraform -chdir=infrastructure plan
```

If you want to provision these resources on Twilio, please run the following command (Please note cost/ charges may be incurred):

```sh
terraform -chdir=infrastructure apply
```

Then the resources should be provisioned

Once you are finished with the resources you can remove all the provisioned resources by running the following command

```sh
terraform -chdir=infrastructure destroy
```

Then the resources should be destroyed/ removed from Twilio
