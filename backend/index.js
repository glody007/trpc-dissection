var http = require('http');
const { type } = require('os');

const router = {
    getShinobi: {
        type: 'query',
        handler: ({ input }) => {
            return {
                "id": 1,
                "result": "Shinobi!"
            }
        }
    },
    getSorcerer: {
        type: 'query',
        handler: ({ input }) => {
            return {
                "id": 1,
                "result": "Sorcerer!"
            }
        }
    },
    addShinobi: {
        type: 'mutation',
        handler: ({ input }) => {
            console.log("===>", input);
            return {
                "data": input.name
            }
        }
    },
}


const requestHandler = (req, res) => {
  let body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
    res.writeHead(200, {'Content-Type': 'application/json'});

    if(req.method !== 'POST') {
      res.end("Method not allowed");
      return
    }

    if(req.url !== '/rpc') {
        res.end("Not found");
        return
    }


    try {
        const data = JSON.parse(body);
        const route = router[data.procedure];
        if(!route || route.type !== data.type) {
            res.end(JSON.stringify({
            "error": {
                "code": -100,
                "message": "Procedure not found"
            }
            }));
            return
        }


        res.end(JSON.stringify(route.handler({ input: data.body })));
        return
    } catch(e) {
        res.end({
            "error": {
                "code": -200,
                "message": "Parse error"
            }
        })
    return
    }
  });
};

const port = 8000;

http.createServer(requestHandler).listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);