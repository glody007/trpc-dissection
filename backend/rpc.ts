import { z } from "zod";


class Procedure<HandlerType , InputType = undefined> {
    type?: 'query' | 'mutation'
    handler: unknown = async () => {}
    validator?: z.Schema<any>

    constructor() {
        this.validator = undefined
    }

    input<VType extends z.Schema<any>>(validator?: VType) {
        this.validator = validator
        
        return this as Procedure<HandlerType extends (...args: any[]) => Promise<any> ? ReturnType<HandlerType> : HandlerType, z.infer<VType>>
    }

    query<HType extends HandlerType>(handler: ({ input }:{ input: InputType }) => Promise<HType>) {
        this.type = 'query'
        this.handler = handler
        return this as Procedure<HType, InputType>
    }

    mutation<HType extends HandlerType>(handler: ({ input }:{ input:InputType }) => Promise<HType>) {
        this.type = 'mutation'
        this.handler = handler
        return this as Procedure<HType, InputType>
    }
}


const createRouter = <RType extends Record<keyof RType, Procedure<unknown, unknown>>>(
    procedureMap: RType
) => {
    return procedureMap
}

export const createRPC = <Rtype extends Record<keyof Rtype, Procedure<unknown, unknown>>>(
    
) => {
    return {
        procedure: () => new Procedure<unknown, unknown>(),
        test: <Rtype>(rt: Rtype) => {
            return rt
        },
        router: <Router extends Rtype>(procedureMap: Router) => createRouter<Router>(procedureMap)
    }
}