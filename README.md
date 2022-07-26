# Divorce Respondent Frontend [![License: MIT](https://img.shields.io/github/license/hmcts/div-respondent-frontend)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/github/checks-status/hmcts/div-respondent-frontend/master)](https://github.com/hmcts/div-respondent-frontend).

This repo is the Frontend App for the 'Acknowledgement of Service' stage of the Divorce process and allows the Respondent to respond to the initial Divorce application.

## Setup

**Config**

For development only config, rename the `config/dev_template.yaml` file to `config/development.yaml`. Running the app with the node environment set to `dev` will ensure this file is used.
This file is not version controlled so any config here will not be pushed to git.

Note that the application will not work if an invalid LanuchDarkly SDK Key in provided. So either get a valid key from azure divorce key store,
or disable it altogether by setting `featureToggles` `enabled` to `false` in `config/default.yml` (be careful not to commit this).

**Install dependencies:**

```sh
yarn install
```

**Start application:**


Run the following to start the redis server:

```sh
docker-compose up
```

Then run the following in separate terminals

```sh
yarn mocks
```

```sh
yarn dev
```

The application will now be running on ```https://localhost:3000```.

**NOTE**: might not work in Chrome.

## Testing

**Unit**

```sh
yarn test:unit
```

**Validation**

```sh
yarn test:validation
```

**Mocks**

Run the following, each in a separate terminal window
```sh
yarn dev
yarn mocks
yarn test:mocks
```

**Running tests locally against a PR/AAT**

* Connect to the VPN

* Make a copy of `config/example-local-aat.yml` as `config/local-aat.yml` (which is ignored by git)

* Substitute any secret values in ***local-aat.yml*** from SCM - Do not add/commit secrets to the example file!

* If you want to point to a PR, modify `tests.e2e.url` accordingly.

* Run ```NODE_ENV=aat yarn test:functional```. This would enable your tests to pick up the new `local-aat.yml`.

### Running additional tests in the Jenkins PR Pipeline

1. Add one or more appropriate labels to your PR in GitHub. Valid labels are:

- ```enable_full_functional_test```
- ```enable_fortify_scan```
- ```enable_all_tests_and_scans```

2. Trigger a build of your PR in Jenkins. Once the regular pipeline completes, the nightly pipeline will trigger to execute your chosen test(s).

## Local Development
RFE has facility to enable you develop and test out features locally without the limitations of either login via IDAM,
VPN connection or having to progress the case via other apps like DN or PFE.

### Mocking 🤡
You can, while developing locally, mock out the case data and have the app render the expected screens
and go through the required steps.

To use this mocking facility, have a look at the `/mocks` folder in the root location.

* Have your mock session data prepared ready, this is the case data your screens and session data expects to have for the
  behaviour you are developing
* Add an entry in the `IdamLogin.template.html` file
* Define the content in the `IdamLogin.content.json` file
* Add an entry in the `IdamLogin.step.js` file
* Define your mock response in the any one of the following folders, most popular is the COS one, (you can add others as suite your needs)
  * `/case-maintenance`
  * `/case-orchestration`
  * `/evidence-management`
  * `/fees-and-payments`<br>Basically you are simulating requests to an external service<br/>

You can also test out flow of your mocked screens by writing mock tests, these tests
can be placed in the `/test/mocks` folder.

Note that these are **strictly local mock tests** and **do not run on the CI build**.
You'd have to run them locally by running the script

```cmd
yarn test:mocks
```
Make sure to run the command if you make a change in any of these files to get feedback


### Uses
* When you want to locally test the feature(s) you are developing
* Helps with IDAM limitations or VPN, you can test and hash out features locally and have quick feedback it all holds together
* Some features require the case to have done through many stages, PFE, DN, CCD then back to RFE, which these mocking, you can prepare your session data in expected state and carry on development
* Can serve as a template, source code or examples of flows tha should work when writing proper functional tests which runs in the CI environment

All tests of this nature are tag as `@mock`

⚠️ Locally mock tests are just one other tool in your tool box. You must make sure unit tests are written for all
functions, modules and pages you add as you develop. These also run on the CI environment, you can also run unit test as described in the `Testing` section above

### Functional Test 🧗🏽‍♀️
To write your functional or e2e test, place your `Features` and `Scenarios` in the `e2e` folder in `/test/e2e`
All tests of these nature are tagged with `@functional` for clarity and they are part of the CI build pipeline.
They **will run** when you check in.

Please read above in the `Running tests locally against a PR/AAT` section on how to set this up
if you want to run from your local machine but point to AAT or your PR. You will need VPN access for this to work.

## Licensing
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
