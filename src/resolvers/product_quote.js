const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  let {ProductName} = req.inputData;
  let defaultCurrency = 'token';
  let currency = defaultCurrency;

  let query = `query productQuote($ProductName: String) {
    product: allJsonApiexchange(limit: 1, filter: {name: {eq: $ProductName}, tags: {in: "Product"}}) {
      edges {
        node {
          name
          prices {
            currency,
            amount
          }
        }
      }
    }
  }`;

  return dataService.request(query, {ProductName}).then(data => {
    let [product] = data.product.edges;
    let rate = product.node.prices.find(price => (price.currency == currency)).amount;
    let {name} = product.node;

    return templater.tpl('product_quote', {
      currency: pluralize(currency), name, rate
    }).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
