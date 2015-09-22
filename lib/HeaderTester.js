(function() {
	'use strict';

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
        , path          = require('path')
        , WebService    = require('ee-webservice')
        , Webfiles      = require('em-webfiles')
        , FSLoader      = require('em-webfiles-loader-filesystem');



	module.exports = new Class({

		init: function(options) {
            this.service = new WebService({
                  port:         13023
                , interface:    WebService.IF_ANY
            });


            this.wwwFiles = new Webfiles({
                maxAge: 1800
            });

            this.wwwFiles.addDirectoryIndex('index.html');

            this.fsLoader = new FSLoader({path: path.join(__dirname.slice(0, __dirname.lastIndexOf('/')), 'www')});

            this.wwwFiles.use(this.fsLoader);

            this.service.use(this.wwwFiles);

            this.service.use(this.request.bind(this));

            this.service.listen();


		}


        , headers: ['accept-language', 'api-version', 'select', 'filter', 'order', 'authorization', 'range', 'x-range']



        , request: function(request, response) {
            var headers = Object.keys(request.getHeaders());

            if (request.pathname === '/favicon.ico') return response.send(404);

            var missingHeaders = this.headers.filter(function(header) {return headers.indexOf(header) === -1});


            log.info('Got %s request on %s from %s, missing this headers: %s', request.method.green, request.pathname.yellow, request.ip.grey, (missingHeaders.length === 0 ? 'none!'.green : missingHeaders.join(', ').red));
            log(request.getHeaders());
           // log(request, request.getHeaders());

            response.setHeader('Accept-ranges', 'Entities');
            response.setHeader('Content-Range', 'Entities 0-1');

            response.send('ok', 206);
        }
	});
})();
