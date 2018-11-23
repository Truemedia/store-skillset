const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(request, service, templater) {
  let reqService = 'Library'; // TODO: Use request
  let defaultCurrency = 'token';
  let currency = defaultCurrency;

  return service.get('exchange', {
    filter: {name: reqService, tags: 'Service'}
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
