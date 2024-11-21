import fs from 'fs'

const readDefinitions = (path) => {
    const data = fs.readFileSync(path, { encoding: 'utf-8' })
    return JSON.parse(data)
}


const generateJsClient = (sourcePath, destPath) => {
    const definitions = readDefinitions(sourcePath)
    const clientString = `
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

        ${definitions.map((definition) => `
        this.api.${definition.name} = async (input) => {
            return fetchRPC(this.url, ${JSON.stringify(definition)}, input)
        }
        `).join('\n')}
    }
}

export const createClient = (url) => {
    return new RPCClient(url)
}
    `
    fs.writeFileSync(destPath, clientString)
}

generateJsClient('../idf.json', 'src/rpc-client.js')

