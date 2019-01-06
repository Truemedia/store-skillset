const pluralize = require('pluralize');

/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  let {ServiceName} = req.inputData;
  let defaultCurrency = 'token';
  let currency = defaultCurrency;

  let query = `{
    service: allJsonApiexchange(limit: 1, filter: {name: {eq: "${ServiceName}"}, tags: {in: "Service"}}) {
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

  return dataService.request(query).then(data => {
    let [service] = data.service.edges;
    let rate = service.node.prices.find(price => (price.currency == currency)).amount;
    let {name} = service.node;

    return templater.tpl('service_quote', {
      currency: pluralize(currency), name, rate
    }).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
