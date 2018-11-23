/**
  * @return {Promise}
  */
module.exports = function(request, service, templater) {
  return service.get('exchange', {
    filter: {tags: 'Product'}
  }).then(res => {
    let products = res.data;
    return templater.tpl('products', {products}).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
