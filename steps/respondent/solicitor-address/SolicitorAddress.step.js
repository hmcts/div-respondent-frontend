const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, list } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const { get } = require('lodash');
const { getAddressFromPostcode } = require('middleware/postcodeLookupMiddleware');
const compactPostValuesMiddleware = require('middleware/compactPostValuesMiddleware');
const checkWelshToggle = require('middleware/checkWelshToggle');

const paths = {
  postcode: '/postcode',
  selectAddress: '/select-address',
  editAddress: '/edit-address',
  confirmAddress: '/confirm-address',
  enterManualAddress: '/manual-address'
};

const constants = {
  yes: 'yes',
  no: 'no'
};

class SolicitorAddress extends Question {
  static get path() {
    return config.paths.respondent.solicitorAddress;
  }

  get session() {
    return this.req.session;
  }

  get postUrlPostcodeSearch() {
    return `${this.path}${paths.postcode}`;
  }

  get postUrlSelectAddress() {
    return `${this.path}${paths.selectAddress}`;
  }

  get postUrlEditAddress() {
    return `${this.path}${paths.editAddress}`;
  }

  get postManualAddress() {
    return `${this.path}${paths.enterManualAddress}`;
  }

  get postUrlConfirmAddress() {
    return `${this.path}${paths.confirmAddress}`;
  }

  get noPostCodePath() {
    return `${this.path}${paths.enterManualAddress}`;
  }

  get isPostRequest() {
    return this.req.method === 'POST';
  }

  get watches() {
    return {
      [`[${this.name}].postcode`]: (previousValue, currentValue, remove) => {
        if (currentValue) {
          remove(`[${this.name}].selectedAddress`);
          remove(`[${this.name}].address`);
          remove(`[${this.name}].confirmAddress`);
          remove(`[${this.name}].manualAddress`);
        }
      },
      [`[${this.name}].selectedAddress`]: (previousValue, currentValue, remove) => {
        if (currentValue) {
          remove(`[${this.name}].confirmAddress`);
        }
      },
      [`[${this.name}].address`]: (previousValue, currentValue, remove) => {
        if (currentValue) {
          remove(`[${this.name}].confirmAddress`);
        }
      },
      [`[${this.name}].confirmAddress`]: (previousValue, currentValue, remove) => {
        if (currentValue === 'no') {
          remove(`[${this.name}].confirmAddress`);
        }
      },
      [`[${this.name}].manualAddress`]: (previousValue, currentValue, remove) => {
        if (currentValue && currentValue.length) {
          remove(`[${this.name}].postcode`);
          remove(`[${this.name}].selectedAddress`);
          remove(`[${this.name}].confirmAddress`);
          remove(`[${this.name}].postcodeList`);
        }
      }
    };
  }

  // a function to retrieve any errors from last post
  hasError(fieldName) {
    const errors = get(this.req.session, 'temp.errors') || [];

    if (!errors.length) {
      return false;
    }

    // only show error for first errors found
    return errors[0] === fieldName;
  }

  // get value of field from post, temp session, session in that order
  fieldValue(fieldName, defaultValue, options = { includeSavedSessionValues: false }) {
    const bodyValue = get(this.req, `body.${fieldName}`);
    const tempSessionValue = get(this.req.session, `temp[${this.name}].${fieldName}`);
    const sessionValue = options.includeSavedSessionValues ? get(this.req.session, `[${this.name}].${fieldName}`) : defaultValue;
    return bodyValue || tempSessionValue || sessionValue || defaultValue;
  }

  get postcodeSearchForm() {
    let postcode = text;
    let postcodeValid = Joi.string();

    // only required if is postcode search form or errors with postcode search
    if (this.isPostcodeSearch || this.hasError('postcode')) {
      postcodeValid = postcodeValid.required();
      postcode = postcode.check(this.content.errors.postcode, () => {
        const postcodeList = this.fieldValue('postcodeList', []);
        return postcodeList.length;
      });
    }

    postcode = postcode.joi(this.content.errors.postcode, postcodeValid);

    return { postcode };
  }

  get selectAddressForm() {
    const postcodeList = this.fieldValue('postcodeList', [], { includeSavedSessionValues: true });
    let selectedAddressValid = Joi.string();

    const isNotManualOrConfirmAddressPage = !this.isManualAddress && !this.isConfirmAddress;
    if (isNotManualOrConfirmAddressPage) {
      selectedAddressValid = selectedAddressValid.valid(postcodeList);
    }

    // only required if is select address form or no errors for select address
    if (this.isSelectAddress || this.hasError('selectedAddress')) {
      selectedAddressValid = selectedAddressValid
        .required();
    }

    const selectedAddress = text.joi(this.content.errors.selectedAddress, selectedAddressValid);

    return { selectedAddress };
  }

  get editAddressForm() {
    const address = list(text);
    return { address };
  }

  get confirmAddressForm() {
    const confirmAddressAnswers = [constants.yes, constants.no];
    let confirmAddressValidAnswers = Joi.string();

    const isPostOrHasErrors = this.isPostRequest || this.hasError('confirmAddress');

    // only required if is confirm address form and is post or errors with confirm address
    if (this.isConfirmAddress && isPostOrHasErrors) {
      confirmAddressValidAnswers = confirmAddressValidAnswers
        .valid(confirmAddressAnswers)
        .required();
    }

    const confirmAddress = text
      .joi(this.content.errors.confirmAddress, confirmAddressValidAnswers);

    return { confirmAddress };
  }

  get manualAddressForm() {
    let manualAddressValidation = Joi.string();

    const isPostOrHasErrors = this.isPostRequest || this.hasError('manualAddress');

    // only required if is manual address form and is post or errors with manual address
    if (this.isManualAddress && isPostOrHasErrors) {
      manualAddressValidation = manualAddressValidation
        .required();
    }

    const manualAddress = text
      .joi(this.content.errors.manualAddress, manualAddressValidation);

    return { manualAddress };
  }

  get postcodeListForm() {
    return { postcodeList: list(text) };
  }

  get form() {
    return form(
      Object.assign({},
        this.postcodeListForm,
        this.postcodeSearchForm,
        this.selectAddressForm,
        this.editAddressForm,
        this.confirmAddressForm,
        this.manualAddressForm
      )
    );
  }

  storeErrors() {
    super.storeErrors();
    // add temp errors so we can show errors on get request
    this.req.session.temp.errors = this.fields.errors.map(error => {
      return error.field.name;
    });
  }

  parseNewFieldData(object) {
    // add new fields to request and parse them to populate this.fields
    this.req.body = Object.assign(this.req.body, object);
    this.parse();
  }

  parseSelectedAddress() {
    // split selected address into array to populate address field
    const address = this.fields.selectedAddress.value.split('\r\n');
    this.parseNewFieldData({ address });
  }

  parseManualAddress() {
    // split manual address into array to populate address field
    const address = this.req.body.manualAddress.split(/\r?\n/)
      .map(line => {
        return line.trim();
      })
      .filter(x => {
        return Boolean(x);
      });
    this.parseNewFieldData({ address });
  }

  persistPreviousAnswers() {
    this.retrieve();
    this.req.body = Object.assign(this.values({ super: true }), this.req.body);
  }

  removeTempErrors() {
    if (get(this.req.session, 'temp.errors')) {
      delete this.req.session.temp.errors;
    }
  }

  handler(req, res, next) {
    if (req.method === 'POST') {
      this.removeTempErrors();

      if (!this.isPostcodeSearch) {
        this.persistPreviousAnswers();
      }

      this.parse();
      this.validate();

      if (this.valid) {
        if (this.isSelectAddress) {
          this.parseSelectedAddress();
        }

        if (this.isManualAddress) {
          this.parseManualAddress();
        }

        this.store();
        this.next().redirect(req, res, next);
      } else {
        this.storeErrors();
        this.doInvalidRedirect(res);
      }
    } else {
      super.handler(req, res, next);
      this.removeTempErrors();
    }
  }

  doInvalidRedirect(res) {
    if (this.isConfirmAddress) {
      return res.redirect(`${this.path}${paths.confirmAddress}`);
    }

    if (this.isManualAddress) {
      return res.redirect(`${this.path}${paths.enterManualAddress}`);
    }

    return res.redirect(this.path);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      compactPostValuesMiddleware,
      getAddressFromPostcode,
      checkWelshToggle
    ];
  }

  next() {
    const doesNotConfirm = this.fields.confirmAddress.value === 'no';
    const isManualAddress = this.fields.manualAddress.value && this.fields.manualAddress.value.length;

    return branch(
      redirectTo({ path: this.path }).if(this.isPostcodeSearch || this.isSelectAddress),
      redirectTo({ path: `${this.path}${paths.confirmAddress}` }).if(this.isEditAddress || this.isManualAddress),
      redirectTo({ path: `${this.path}${paths.enterManualAddress}` }).if(doesNotConfirm && isManualAddress),
      redirectTo({ path: this.path }).if(doesNotConfirm),
      redirectTo(this.journey.steps.CheckYourAnswers)
    );
  }

  answers() {
    const question = this.content.title;
    return answer(this, {
      question,
      answer: this.fields.address.value
    });
  }

  values(options = { super: false }) {
    /* an option to call the super method.
     * Because CYA uses the `values` method for each step to map values to CCD key value pairs
     * we need a way to call the `values` super method which returns the field values as required
     * by the step
     */
    if (options.super) {
      return super.values();
    }
    return { respondentSolicitorAddress: { address: this.fields.address.value } };
  }

  get mode() {
    return get(this.req, 'params[0]');
  }

  get isPostcodeSearch() {
    return this.mode === paths.postcode;
  }

  get isSelectAddress() {
    return this.mode === paths.selectAddress;
  }

  get isEditAddress() {
    return this.mode === paths.editAddress;
  }

  get isConfirmAddress() {
    return this.mode === paths.confirmAddress;
  }

  get isManualAddress() {
    return this.mode === paths.enterManualAddress;
  }

  static get pathToBind() {
    return `${super.path}(${paths.postcode}|${paths.selectAddress}|${paths.editAddress}|${paths.confirmAddress}|${paths.enterManualAddress})?`;
  }
}

module.exports = SolicitorAddress;
