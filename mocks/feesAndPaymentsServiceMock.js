const get = feeRequest => {
  let mockFeeResponse = {};

  switch (feeRequest) {
  case 'issue':
    mockFeeResponse = {
      feeCode: 'FEE0002',
      version: 4,
      amount: 550.00,
      description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.'
    };
    break;

  case 'issue1':
    mockFeeResponse = {
      feeCode: 'FEE0002',
      version: 4,
      amount: 111.00,
      description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.'
    };
    break;
    // no default
  }

  return new Promise(resolve => {
    resolve(mockFeeResponse);
  });
};


module.exports = { get };
