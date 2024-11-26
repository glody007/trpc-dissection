import { RouterType, Procedure } from "../../backend/rpc"

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

const queryHandler = {
    get: function(target: RPCClient, prop: string) {
        return function(...args: any[]) {
            return fetchRPC(target.url, {
                "name": prop,
                "type": "query",
                "input": args[0]
            })
        }
    }
}

const mutationHandler = {
    get: function(target: RPCClient, prop: string) {
        return function(...args: any[]) {
            return fetchRPC(target.url, {
                "name": prop,
                "type": "mutation",
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

type RemoveNever<T> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K]
};

type FilterProceduresByType<T, QueryType extends "query" | "mutation"> = RemoveNever<{
    [K in keyof T]: T[K] extends Procedure<any, infer Type, any> 
      ? Type extends QueryType
        ? T[K] 
        : never 
      : never
}>

const createClient = <Rtype extends RouterType>(url: string) => {
    return {
        api: {
            query: new Proxy(new RPCClient(url), queryHandler),
            mutate: new Proxy(new RPCClient(url), mutationHandler)
        }
    } as unknown as {
        api: {
            query: {
                [T in keyof FilterProceduresByType<Rtype, 'query'>]:
                (input: Rtype[T] extends Procedure<any, any, infer InputType> ? InputType : undefined ) => 
                    Promise<Rtype[T] extends Procedure<infer HandlerType, any, any> ? HandlerType : never>
            }, 
            mutate: {
                [T in keyof FilterProceduresByType<Rtype, 'mutation'>]:
                (input: Rtype[T] extends Procedure<any, any, infer InputType> ? InputType : undefined ) => 
                    Promise<Rtype[T] extends Procedure<infer HandlerType, any, any> ? HandlerType : never>
            }, 
        }
    }
}

export default {
    createClient
}