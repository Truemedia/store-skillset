const {Currency, Product, Service, Transaction} = require('payment-provider');
const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater, parties) {
  let {ExchangeName} = req.inputData;
  let amount = req.inputData.Amount;
  let preferredCurrency = req.inputData.Currency;
  preferredCurrency = pluralize.singular(preferredCurrency);

  let currency = Currency.fromString('token');
  let transaction = new Transaction(parties);

  return dataService.get('exchange', {
    filter: {name: ExchangeName}
  }).then(res => { // Load product
    let [exchange] = res.data
    let product = Product.fromJson(exchange);
    return product;
  }).then(product => { // Process transaction
    transaction = transaction.addProduct(product);
    return transaction.purchase(currency);
  }).then(transaction => { // Payment success
    return templater.tpl('accept').compile();
  }).then(content => content.body)
    .catch(err => { // Issues/Errors
      switch (err.code)
      {
        case 'PAYMENT_LACK_OF_FUNDS':
          let responder = 'skill'; // skill/framework options (either can respond)
          if (responder == 'skill') { // TODO: Make config option
            let remainingAmount = transaction.fundsNeeded(currency);
            return templater.tpl('negotiate', {
              remainingAmount, currency: pluralize.plural(preferredCurrency)
            }).compile()
              .then(content => content.body);
          } else {
            throw err;
          }
        break;
        default:
          console.error(err);
        break;
      }
    });
};
