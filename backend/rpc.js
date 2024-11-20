var fs = require('fs');

class Procedure {
    type = ''
    handler = () => {}
    validator = null

    input(validator) { 
        this.validator = validator
        return this
    }

    query(handler) {
        this.type = 'query'
        this.handler = handler
        return this
    }

    mutation(handler) {
        this.type = 'mutation'
        this.handler = handler
        return this
    }
}

const createRouter = (procedureMap) => {
    const router = {}
    Object.entries(procedureMap).forEach(([key, value]) => {
        router[key] = {
            type: value.type,
            validator: value.validator,
            validatorDef: value.validatorDef,
            handler: value.handler
        }
    })
    return router
}

const createRPC = () => {
    return {
        procedure: () => new Procedure(),
        router: (procedureMap) => createRouter(procedureMap)
    }
}

const generateInterfaceDefinitionFile = (router, path) => {
    const definitions = Object.entries(router).map(([key, value]) => ({
        name: key,
        type: value.type,
        input: value.validator ? value.validator.shape : null,
    }))
    fs.writeFileSync(path, JSON.stringify(definitions))
}

module.exports = {
    createRPC,
    generateInterfaceDefinitionFile
}

