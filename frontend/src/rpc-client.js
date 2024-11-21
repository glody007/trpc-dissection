
const fetchRPC = async (url, definition, input) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            procedure: definition.name,
            type: definition.type,
            body: input
        })
    }).then(res => res.json())
}

class RPCClient {
    api = {}

    constructor(url) {
        this.url = url

        
        this.api.getShinobi = async (input) => {
            return fetchRPC(this.url, {"name":"getShinobi","type":"query","input":null}, input)
        }
        

        this.api.getSorcerer = async (input) => {
            return fetchRPC(this.url, {"name":"getSorcerer","type":"query","input":null}, input)
        }
        

        this.api.addShinobi = async (input) => {
            return fetchRPC(this.url, {"name":"addShinobi","type":"mutation","input":{"name":{"_def":{"checks":[],"typeName":"ZodString","coerce":false}}}}, input)
        }
        
    }
}

export const createClient = (url) => {
    return new RPCClient(url)
}
    