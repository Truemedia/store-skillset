const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(request, service, templater) {
  // let {Amount} = request.inputData;
  let Amount = 9;
  let reqExchange = 'Library';
  let defaultCurrency = 'token';
  let currency = defaultCurrency;

  let filter = {name: reqExchange} // Derive from input

  return service.get('exchange', {filter}).then(res => {
    let [exchange] = res.data
    let acceptAmount = exchange.prices.find(price => (price.currency == currency)).amount;
    if (Amount >= acceptAmount) {
      return templater.tpl('accept').compile();
    } else {
      let remainingAmount = (acceptAmount - Amount);
      return templater.tpl('negotiate', {
        remainingAmount, currency: pluralize(currency)
      }).compile();
    }
  }).then(content => content.body)
    .catch(err => console.error(err));
};
