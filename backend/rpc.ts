import { z } from "zod";


export class Procedure<HandlerType, Type, InputType = undefined> {
    type?: unknown
    handler: unknown = async () => {}
    validator?: z.Schema<any>

    constructor() {
        this.validator = undefined
    }

    input<VType extends z.Schema<any>>(validator: VType) {
        this.validator = validator
        return this as Procedure<HandlerType, Type, z.infer<VType>>
    }

    query<HType extends HandlerType>(handler: (params: { input: InputType }) => Promise<HType>) {
        this.type = 'query'
        this.handler = handler
        return this as Procedure<HType, 'query', InputType extends object ? InputType : void>
    }

    mutation<HType extends HandlerType>(handler: ({ input }:{ input:InputType }) => Promise<HType>) {
        this.type = 'mutation'
        this.handler = handler
        return this as Procedure<HType, 'mutation', InputType extends object ? InputType : void>
    }
}


const createRouter = <RType extends Record<keyof RType, Procedure<unknown, unknown, unknown>>>(
    procedureMap: RType
) => {
    return procedureMap
}

export const createRPC = <Rtype extends Record<keyof Rtype, Procedure<unknown, unknown, unknown>>>(
    
) => {
    return {
        procedure: () => new Procedure<unknown, unknown, unknown>(),
        router: <Router extends Rtype>(procedureMap: Router) => createRouter<Router>(procedureMap)
    }
}

export type RouterType = ReturnType<typeof createRouter>