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

	it('Should be able to log a request', function(done) {
		request('http://localhost:3001', function (err, response, body) {
			(err === null).should.be.ok;
			response.should.exist;

			try {
				fs.statSync(LOG_FILE).isFile().should.be.ok;

				var logFileContent = fs.readFileSync(LOG_FILE).toString();

				logFileContent.indexOf('"host":"localhost"').should.be.greaterThan(-1);
				logFileContent.indexOf('"INFO","request"').should.be.greaterThan(-1);
				logFileContent.indexOf('"method":"GET"').should.be.greaterThan(-1);
				logFileContent.indexOf('"path":"/"').should.be.greaterThan(-1);
				logFileContent.indexOf('"INFO","response"').should.be.greaterThan(-1);
				logFileContent.indexOf('"response":{"status":200}}').should.be.greaterThan(-1);

				done();
			}
			catch(e) {
				(e === null).should.be.ok;
				done();
			}
		});
	});
});