const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  let {ServiceName} = req.inputData;
  let defaultCurrency = 'token';
  let currency = defaultCurrency;

  return dataService.get('exchange', {
    filter: {name: ServiceName, tags: 'Service'}
  }).then(res => {
    let [service] = res.data;
    let rate = service.prices.find(price => (price.currency == currency)).amount;
    let {name} = service;

    return templater.tpl('service_quote', {
      currency: pluralize(currency), name, rate
    }).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
