import * as http from 'http';
import { z } from 'zod';
import  { createRPC } from './rpc';

const rpc = createRPC()

const router = rpc.router({
    getShinobi: rpc.procedure().query(async () => {
        return {
            "id": 1,
            "result": "Shinobi!"
        }
    }),
    getSorcerer: rpc.procedure().query(async () => {
        return {
            "id": 1,
            "result": "Sorcerer!"
        }
    }),
    addShinobi: rpc
        .procedure()
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input }) => {
            return {
                "data": input.name
            }
        })
})

const bodyValidator = z.object({
    procedure: z.string(),
    type: z.string(),
    body: z.any()
})


const requestHandler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    let body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    req.on('end', async function() {
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
            const data =  bodyValidator.parse(JSON.parse(body));
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
                const handlerResult =  await route.handler({ input: result.data });
                res.end(JSON.stringify(handlerResult));
                return
            }
    
            const handlerResult =  await route.handler();
            res.end(JSON.stringify(handlerResult));
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
});