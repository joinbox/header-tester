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



        , request: function(request, response) {
            log(request, request.getHeaders());

            response.setHeader('Accept-ranges', 'Entities');
            response.setHeader('Content-Range', 'Entities 0-1');

            response.send('ok');
        }
	});
})();
