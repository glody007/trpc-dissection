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

const proxyHandler = {
    get: function(target, prop) {
        return function(...args) {
            return fetchRPC(target.url, {
                "name": prop,
                "type": "query",
                "input": args[0]
            })
        }
    }
}

class RPCClient {
    constructor(url) {
        this.url = url
    }
}

const createClient = (url) => {
    return {
        api: new Proxy(new RPCClient(url), proxyHandler)
    }
}

export default {
    createClient
}