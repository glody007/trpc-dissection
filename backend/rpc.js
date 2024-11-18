class Procedure {
    type = ''
    handler = () => {}

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

module.exports = {
    createRPC
}

