/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  let query = `{
    products: allJsonApiexchange(filter: {tags: {in: "Product"}}) {
      edges {
        node {
          name
        }
      }
    }
  }`;
  return dataService.request(query).then(data => {
    let {products} = data;
    return templater.tpl('products', {products}).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
