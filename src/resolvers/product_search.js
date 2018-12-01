/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  return dataService.get('exchange', {
    filter: {tags: 'Product'}
  }).then(res => {
    let products = res.data;
    return templater.tpl('products', {products}).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
