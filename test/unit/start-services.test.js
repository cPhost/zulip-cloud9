const fixtures = require('../fixtures');
const startServices = require('../../lib/start-services');

const {
  runSync, checkServicesStarted, SERVICES
} = fixtures;

describe('start-services start', () => {
  it('should start all the services', function(done) {
    startServices()
      .then(() => {
        const res = checkServicesStarted();
        done(res);
      })
      .catch((err) => {
        done(err);
      });
  });

  describe('test starts all services if stopped', () => {
    const services = SERVICES;
    // remove memcached from test list since if you stop it manually
    // it will crash
    services.splice(services.indexOf('memcached'), 1);

    beforeEach(function() {
      if (!services.length === 3) { services.splice(0, 1); }
      runSync('sudo', ['service', services[0], 'stop']);
      console.log('stopping service: ', services[0]);
    });

    it('starts rabbitmq-server if its stopped', function(done) {
      startServices()
        .then(() => {
          const res = checkServicesStarted('memcached');
          done(res);
        })
        .catch((err) => {
          done(err);
        });
    });

    it('starts redis-server if its stopped', function(done) {
      startServices()
        .then(() => {
          const res = checkServicesStarted('redis-server');
          done(res);
        })
        .catch((err) => {
          done(err);
        });
    });

    it('starts postgresql if its stopped', function(done) {
      startServices()
        .then(() => {
          const res = checkServicesStarted('postgresql');
          done(res);
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
