
//request NPM request
var request = require('request'),

//To get the response headers
    response_header = require('request-debug')(request),

//This npm requires to pass cookies in the next subseqent requests
    tough = require('tough-cookie'),

//The below code enables cookies
    request = request.defaults({ jar: true });

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
});

app.use(express.static(path.join(__dirname, 'public')));// jshint ignore:line


app.post('/rest/explorer', function(req, res){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var j = request.jar();

    var loginOptions = {
        url: req.body.baseUrl+'Login/Login',
        formData: {
            UserName: req.body.username,
            Password: req.body.password,
        }
    };

    var apiOptions = {
        url: req.body.baseUrl+req.body.restPath,
        form: JSON.parse(req.body.data),
        headers: {
            'Connection': 'keep-alive',
            'Referer': req.body.baseUrl+'Login/Login'
        }
    };

    function apiCallback (error, response, body) {
        console.log('apiCallback Fired!');
        console.log('error: '+error);
        console.log('response: '+response);
        console.log('body: '+body);

        var data = JSON.parse(body);

        console.log('error - '+error);
        console.log('response.statusCode - '+response.statusCode);
        console.log('data - '+data);

        var restResponse = {
            error: error,
            statusCode: response.statusCode,
            json: data
        };

        res.send(restResponse);

        res.end();

    }

    function loginCallback (error, response, body) {
        console.log('loginCallback Fired!');
        console.log('error: '+error);
        console.log('response: '+response);
        console.log('body: '+body);

        console.log('error - '+error);
        console.log('response.statusCode - '+response.statusCode);

        request.post(apiOptions, apiCallback);
    }

    request.get({
        url: req.body.baseUrl+'Login/Login',
        jar: j
    }, function(error, response, body){
        console.log('get Fired!');
        console.log('error: '+error);
        console.log('response: '+response);
        console.log('body: '+body);

        console.log('error - '+error);
        console.log('response.statusCode - '+response.statusCode);

        //By default,sub-sequent Request passes cookies got from above calls of login
        request.post(loginOptions, loginCallback);

    });


});


var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});