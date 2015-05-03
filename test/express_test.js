var LOG_FILE = 'test/express_leg.log',
	fs = require('fs'),
	express = require('express'),
	leg = require('leg')(LOG_FILE, { level: 'info' }),
	logger = require('../index.js'),
	request = require('request'),
	should = require('should');

describe('connect-leg for Express', function() {
	'use strict';

	before(function(done) {
		var app = express();

		app.use(logger(leg));

		app.get('/', function(req, res) {
		  res.send('Hello World!');
		});

		var server = app.listen(3000, function () {
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

	it('Should be able to log a request', function(done) {
		request('http://localhost:3000', function (err, response, body) {
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