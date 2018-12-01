/**
  * @return {Promise}
  */
module.exports = function(req, dataService, templater) {
  return dataService.get('exchange', {
    filter: {tags: 'Service'}
  }).then(res => {
    let services = res.data;
    return templater.tpl('services', {services}).compile();
  }).then(content => content.body)
    .catch(err => console.error(err));
};
