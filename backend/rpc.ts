import { type ZodTypeAny, z } from "zod";
import fs from 'fs';


type HandlerType =  (input?: any) => Promise<unknown>

type ValidatorType = z.AnyZodObject | undefined

type RouterType = Record<string, {
    type: string,
    handler: HandlerType,
    validator: ValidatorType,
}>

class Procedure {
    type: string = ''
    handler: HandlerType = async () => {}
    validator: ValidatorType

    input(validator: z.AnyZodObject) {
        this.validator = validator
        return this
    }

    query(handler: HandlerType) {
        this.type = 'query'
        this.handler = handler
        return this
    }

    mutation(handler: HandlerType) {
        this.type = 'mutation'
        this.handler = handler
        return this
    }
}

const createRouter = (procedureMap: Record<string, Procedure>) => {
    const router: RouterType = {}
    Object.entries(procedureMap).forEach(([key, value]) => {
        router[key] = {
            type: value.type,
            validator: value.validator,
            handler: value.handler
        }
    })
    return router
}

export const createRPC = () => {
    return {
        procedure: () => new Procedure(),
        router: (procedureMap: Record<string, Procedure>) => createRouter(procedureMap)
    }
}

const generateDefinitions = (router: RouterType) => {
    const definitions = Object.entries(router).map(([key, value]) => ({
        name: key,
        type: value.type,
        input: value.validator ? value.validator.shape : null,
    }))
    return definitions
}

export const generateInterfaceDefinitionFile = (router: RouterType, path: string) => {
    fs.writeFileSync(path, JSON.stringify(generateDefinitions(router)))
}
