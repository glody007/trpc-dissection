var http = require('http');
var { z } = require('zod');

const { createRPC, generateInterfaceDefinitionFile } = require('./rpc');

const rpc = createRPC()

const router = rpc.router({
    getShinobi: rpc.procedure().query(() => {
        return {
            "id": 1,
            "result": "Shinobi!"
        }
    }),
    getSorcerer: rpc.procedure().query(() => {
        return {
            "id": 1,
            "result": "Sorcerer!"
        }
    }),
    addShinobi: rpc
        .procedure()
        .input(z.object({ name: z.string() }))
        .mutation(({ input }) => {
            return {
                "data": input.name
            }
        })
})


const requestHandler = (req, res) => {
  let body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

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

        if(route.validator) {
            const result = route.validator.safeParse(data.body);
            if(!result.success) {
                res.end(JSON.stringify({
                    "error": {
                        "code": -101,
                        "message": "Invalid input",
                        "errors": result.error.issues
                    }
                }));
                return
            }
            res.end(JSON.stringify(route.handler({ input: result.data })));
            return
        }


        res.end(JSON.stringify(route.handler()));
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

const server = http.createServer(requestHandler)

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
    generateInterfaceDefinitionFile(router, '../idf.json')
});