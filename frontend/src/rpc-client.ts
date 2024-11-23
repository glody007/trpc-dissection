
type InputType = any

type DefinitionType = {
    name: string,
    type: string,
    input: any
}

const fetchRPC = async (url: string, definition: DefinitionType) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            procedure: definition.name,
            type: definition.type,
            body: definition.input
        })
    }).then(res => res.json())
}

const proxyHandler = {
    get: function(target: RPCClient, prop: string) {
        return function(...args: InputType[]) {
            return fetchRPC(target.url, {
                "name": prop,
                "type": "query",
                "input": args[0]
            })
        }
    }
}

class RPCClient {
    url = ''
    constructor(url: string) {
        this.url = url
    }
}

const createClient = (url: string) => {
    return {
        api: new Proxy(new RPCClient(url), proxyHandler)
    }
}

export default {
    createClient
}