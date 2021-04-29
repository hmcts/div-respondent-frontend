# Divorce Respondent Frontend [![License: MIT](https://img.shields.io/github/license/hmcts/div-respondent-frontend)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/github/checks-status/hmcts/div-respondent-frontend/master)](https://github.com/hmcts/div-respondent-frontend)

This repo is the Frontend App for the 'Acknowledgement of Service' stage of the Divorce process and allows the Respondent to respond to the initial Divorce application.

## Setup

**Config**

For development only config, rename the `config/dev_template.yaml` file to `config/development.yaml`. Running the app with the node environment set to `dev` will ensure this file is used.
This file is not version controlled so any config here will not be pushed to git.

As an example, if you want to use LaunchDarkly locally, place the SDK Key in this file. You can keep the key there as this file is not version controlled.

**Install dependencies:**

```
yarn install
```

**Start application:**


Run the following to start the redis server:

```
docker-compose up
```

Then run the following in separate terminals

```
yarn mocks
```

```
yarn dev
```

The application will now be running on ```https://localhost:3000```.

## Testing

**Unit**

```
yarn test:unit
```

**Validation**

```
yarn test:validation
```

**Mocks**

Run the following, each in a separate terminal window
```
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

##Local Development
RFE has facility to enable you development and test out features locally without the limitations of either login via IDAM,
VPN connection or having to progress the case via other apps like DN or PFE.

###Mocking
You can, while developing locally mock, out the case data and have the app render the expected screens
and go through the required steps.

To use this mocking facility, have a look at the `/mocks` folder in the root location.

* Have your mock session data prepared ready, this is the case data your screen expects to have for the
  behaviour you are developing
* Add an entry in the `IdamLogin.template.html` file
* Define the content in the `IdamLogin.content.json` file
* Add an entry in the `IdamLogin.step.js` file
* Define your mock response in the any one of the following folders, most popular is the COS one, (you can add others as suite your needs)
  * `/case-maintenance`
  * `/case-orchestration`
  * `/evidence-management`
  * `/fees-and-payments`

You can also test out your mocked screens by writing mock tests, these tests
can be placed in the `/test/mocks` folder.

These are strictly local mock tests and are not run on the CI build.
You'd have to run them locally by running the script

```cmd
yarn test:mocks
```
Make sure to run the command if you make a change in any of these files to get feedback


###Uses
* When you want to locally test the feature you are developing
* Helps with IDAM limitations or VPN, you can test hash out features locally and have quick feedback it all holds together
* Some features require the case to have done through many stages, PFE, DN, CCD then back to RFE, which these mocks you can prepare your session data in expected state and carry on development*
* Can serve as a template, source of flaws when write proper functional tests which runs in the CI environment


## Licensing
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
