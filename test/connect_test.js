var LOG_FILE = 'test/connect_leg.log',
	fs = require('fs'),
	connect = require('connect'),
	leg = require('leg')(LOG_FILE, { level: 'info' }),
	logger = require('../index.js'),
	request = require('request'),
	should = require('should');

describe('connect-leg for Connect', function() {
	'use strict';

	before(function(done) {
		var app = connect();

		app.use(logger(leg));

		app.use(function(req, res, next) {
			res.end('Hello World!');
		});

		app.listen(3001, function () {
			done();
		});
	});

	after(function(done) {
		try {
			fs.unlink(LOG_FILE, function(err) {
				done();
			});
		}
		catch(e) {
			done();
		}
	});

	it('Should be log a request', function(done) {
		request('http://localhost:3001', function (err, response, body) {
			(err === null).should.be.ok;
			response.should.exist;

			try {
				fs.statSync(LOG_FILE).isFile().should.be.ok;
				fs.readFileSync(LOG_FILE).toString().indexOf('localhost').should.be.greaterThan(-1);
				done();
			}
			catch(e) {
				(e === null).should.be.ok;
				done();
			}
		});
	});
});