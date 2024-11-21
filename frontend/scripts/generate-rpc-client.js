import fs from 'fs'

const readDefinitions = (path) => {
    const data = fs.readFileSync(path, { encoding: 'utf-8' })
    return JSON.parse(data)
}


const generateJsClient = (sourcePath) => {
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

const createClient = (url) => {
    return new RPCClient(url)
}

module.exports = {
    createClient
}
    `

const packagejsonString = `
{
  "name": "rpc",
  "version": "1.0.0",
  "main": "index.js"
}
    `

    fs.mkdir("node_modules/rpc", { recursive: true }, (err) => {
        if(err) throw err
    })
    fs.writeFileSync('node_modules/rpc/index.js', clientString)
    fs.writeFileSync('node_modules/rpc/package.json', packagejsonString)

    if (fs.existsSync('node_modules/.vite')) {
        fs.rmSync('node_modules/.vite', { recursive: true });
    }
}


generateJsClient('../idf.json')

