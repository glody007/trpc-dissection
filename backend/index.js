var http = require('http');


const requestHandler = (req, res) => {
  let body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    res.writeHead(200, {'Content-Type': 'application/json'});

    if(req.url === '/rpc') {
      try {
        const data = JSON.parse(body);
        if(data.procedure === 'get-user') {
          res.end(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "result": "Yoda!"
          }));
          return
        }
      } catch(e) {
        res.end({
            "error": {
                "code": -32700,
                "message": "Parse error"
            }
        })
        return
      }
      
    }
  
    res.end('Bad request\n');
  });
};

const port = 8000;

http.createServer(requestHandler).listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);