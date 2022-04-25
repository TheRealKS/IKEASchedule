var httpa = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname   // or whatever base directory you want

var port = 9615

httpa.createServer(function (request, response) {
    try {
        var requestUrl = url.parse(request.url)
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': 'https://nl.infothek-sptk.com/isps/plugins/logon?dummy=1650019521385',
          'headers': {
            'Content-Type': 'text/plain'
          },
          body: 'usrsys=0&bws=0&target=/infothek/loginResult.js&fail target=loginfailinf1.html&lid=1043&pwd=210501ko!!&name=05719033'
        
        };
        request(options, function (error, res) {
          if (error) throw new Error(error);
          response.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
          });
          response.write(res.body);
          response.end();
        });
        
   } catch(e) {
        response.writeHead(500)
        response.end()     // end the response so browsers don't hang
        console.log(e.stack)
   }
}).listen(port)

console.log("listening on port "+port)