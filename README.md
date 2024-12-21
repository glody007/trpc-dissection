# Minimal tRPC Implementation

Implementation of minimal version of tRPC from scratch. 

Using builder pattern to create the API, Javascript Proxy to create client, and TypeScript to have an end-to-end type-safe API.

## 📚 Blog Post

- 📖 [Read the full tutorial on implementing a minimal version of tRPC part 1 (RPC)](https://www.softwaredissection.com/posts/trpc-dissection-part1)

- 📖 [Read the full tutorial on implementing a minimal version of tRPC part 2 (Type safety)](https://www.softwaredissection.com/posts/trpc-dissection-part2)

## ✨ Features

- Type-safe API endpoints
- Minimal setup with Node.js and TypeScript 
- Zero-configuration type inference

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── rpc-client.ts    # tRPC client core
│   │   └── App.tsx          # React App entry point
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── rpc.ts           # tRPC server core
│   ├── router.ts        # API route definitions
│   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
```

## 🔑 Key Files

### Server-side

`backend/rpc.ts`:
```typescript
export class Procedure {
    // Procedure definition here
}

export createRouter = (procedureMap) => {
    // Router creation code here
}

export const createRPC = () => {
    // RPC creation code here
}

export type RouterType = ReturnType<typeof createRouter>
```

`backend/router.ts`:
```typescript
import { z } from 'zod';
import  { createRPC } from './rpc';

const rpc = createRPC()

export const router = rpc.router({
    // Your RPC endpoints here
})

export type AppRouter = typeof router
```

`backend/index.ts`:
```typescript
import { router } from './router';

const requestHandler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Your request handler code here (using the router)
}

const server = http.createServer(requestHandler)

const port = 8000;
server.listen(port);
```

### Client-side

`client/src/rpc-client.ts`:
```typescript
import { RouterType, Procedure } from "../../backend/rpc"

class RPCClient {
    // Client implementation here
}

const createClient = (url: string) => {
    // client proxy creation code here
}

export default {
    createClient
}
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/glody007/trpc-dissection
```

2. Install dependencies:
```bash
# From the root directory
cd backend
pnpm install

# From the root directory
cd frontend
pnpm install
```

3. Start the server:
```bash
# From the backend directory
npm start
```

4. Start the client:
```bash
# From the frontend directory
npm run dev
````
