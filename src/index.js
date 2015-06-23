'use strict';

const _ = require('lodash');

function filterRoutes(route){
  // explicit false check
  return (route.settings.plugins.tableflipper === false);
}

function findAllRoutes(result, host){
  const { id } = host.info;

  const filteredRoutes = _.reject(host.table, filterRoutes);

  const routes = _.map(filteredRoutes, (route) => {
    const { path, method } = route;

    return {
      id: id,
      path: path,
      method: method
    };
  });

  return result.concat(routes);
}

function handler(request, reply){
  const hosts = request.server.table();
  const allRoutes = _.reduce(hosts, findAllRoutes, []);
  reply(allRoutes);
}

function tableflipper(server, opts = {}, done){

  const endpoint = opts.endpoint || '/table';

  server.route({
    method: 'GET',
    path: endpoint,
    handler: handler,
    config: {
      plugins: {
        tableflipper: false
      }
    }
  });

  done();
}

tableflipper.attributes = {
  pkg: require('./package.json')
};

module.exports = {
  register: tableflipper
};
