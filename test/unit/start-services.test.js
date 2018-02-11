const fixtures = require('../fixtures');
const startServices = require('../../lib/start-services');

const {
  runSync, checkServicesStarted, SERVICES
} = fixtures;

describe('start-services start', () => {
  it('should start all the services', function(done) {
    this.timeout(27000);
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
      if (services[0] === 'rabbitmq-server') {
        this.timeout(6000);
      }

      runSync('sudo', ['service', services[0], 'stop']);
      services.splice(0, 1);
    });

    it('starts rabbitmq-server if its stopped', function(done) {
      this.timeout(16570);
      startServices()
        .then(() => {
          const res = checkServicesStarted('rabbitmq-server');
          done(res);
        })
        .catch((err) => {
          done(err);
        });
    });

    it('starts redis-server if its stopped', function(done) {
      this.timeout(14000);
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
      this.timeout(10000);
      startServices()
        .then(() => {
          const res = checkServicesStarted('postgresql');
          done(res);
        })
        .catch((err) => {
          done(err);
        });
    });

    it('starts memcached if its stopped', function(done) {
      // this is meant to be only ran on CI.
      // reason being it memcached service restarting breaks
      // memcached on clou9.
      this.timeout(1500);
      if (!process.env.C9_HOSTNAME) {
        runSync('sudo', ['service', 'memcached', 'stop']);
        startServices()
          .then(() => {
            const res = checkServicesStarted('memcached');
            done(res);
          })
          .catch((err) => {
            done(err);
          });
      } else {
        done();
      }
    });
  });
});
