const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(request, service, templater) {
  let reqProduct = 'book'; // TODO: Use request
  let defaultCurrency = 'token';
  let currency = defaultCurrency;

  return service.get('exchange', {
    filter: {name: reqProduct, tags: 'Product'}
  }).then(res => {
    let [product] = res.data;
    let rate = product.prices.find(price => (price.currency == currency)).amount;
    let {name} = product;

    return templater.tpl('product_quote', {
      currency: pluralize(currency), name, rate
    }).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
