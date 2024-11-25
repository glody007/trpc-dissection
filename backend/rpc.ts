import { type ZodTypeAny, object, z } from "zod";
import fs from 'fs';


class Procedure<HandlerType , ValidatorType = unknown, InputType = unknown> {
    type?: 'query' | 'mutation'
    handler: unknown = async () => {}
    validator?: unknown

    input<VType extends ValidatorType & z.SomeZodObject>(validator?: VType) {
        this.validator = validator
        
        return this as unknown as Procedure<HandlerType, VType, z.infer<VType>>
    }

    query<HType extends HandlerType>(handler: ({ input }:{ input: InputType }) => Promise<HType>) {
        this.type = 'query'
        this.handler = handler
        return this as unknown as Procedure<HType, ValidatorType>
    }

    mutation<HType extends HandlerType>(handler: ({ input }:{ input:InputType }) => Promise<HType>) {
        this.type = 'mutation'
        this.handler = handler
        return this as unknown as Procedure<HType, ValidatorType>
    }
}

const p = new Procedure()

const a = p.input(z.object({ name: z.string() })).query(async ({ input }) => {
    return {
        "id": 1,
        "result": "Shinobi!"
    }
})

console.log(a)


const createRouter = <RType extends Record<keyof RType, Procedure<unknown, unknown>>>(
    procedureMap: RType
) => {

    // return Object.fromEntries(
    //     Object.entries<{ [key in keyof RType]: RType}>(procedureMap).map(([key, value]) => ([key,{ 
    //             type: value.type,
    //             validator: value.validator,
    //             handler: value.handler
    //         }]))
    // ) 

    return procedureMap
}

const r = createRouter({
    getShinobi: new Procedure().query(async () => {
        return {
            "id": 1,
            "result": "Shinobi!"
        }
    }),
    getSorcerer: new Procedure().query(async () => {
        return {
            "id": 1,
            "result": "Sorcerer!"
        }
    }),
    addShinobi: new Procedure()
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input }) => {
            return {
                "data": input.name
            }
        })
})

console.log(r)

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

const rtc = createRPC()

const t = rtc.router({
    getShinobi: rtc.procedure().query(async () => {
        return {
            "id": 1,
            "result": "Shinobi!"
        }
    }),
    getSorcerer: rtc.procedure().query(async () => {
        return {
            "id": 1,
            "result": "Sorcerer!"
        }
    }),
    addShinobi: rtc.procedure().input(z.object({ name: z.string() }))
        .mutation(async ({ input }) => {
            return {
                "data": input.name
            }
        }),
})

console.log(t)

// const generateDefinitions = <RType extends Record<keyof RType, Procedure<unknown, unknown>>>(router: RType) => {
//     const definitions = Object.entries(router).map(([key, value]) => ({
//         name: key,
//         type: value.type,
//         input: value.validator ? value.validator.shape : null,
//     }))
//     return definitions
// }

// export const generateInterfaceDefinitionFile = (router: RouterType, path: string) => {
//     fs.writeFileSync(path, JSON.stringify(generateDefinitions(router)))
// }