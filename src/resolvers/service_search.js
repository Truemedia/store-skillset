/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  let query = `{
    services: allJsonApiexchange(filter: {tags: {in: "Service"}}) {
      edges {
        node {
          name
        }
      }
    }
  }`;
  return dataService.request(query).then(data => {
    let {services} = data;
    return templater.tpl('services', {services}).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
