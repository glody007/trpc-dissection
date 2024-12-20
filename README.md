# Minimal tRPC Implementation

A lightweight implementation of tRPC demonstrating type-safe API communication between client and server.

## 📚 Related Resources

- 📖 [Read the full tutorial on implementing a minimal version of tRPC](https://www.softwaredissection.com/posts/trpc-dissection-part1)

## ✨ Features

- Type-safe API endpoints
- Minimal setup with Node.js and TypeScript 
- Simple client-server communication
- Zero-configuration type inference

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── rpc-client.ts    # tRPC client 
│   │   └── App.tsx          # React App entry point
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── rpc.ts          # tRPC server configuration
│   ├── router.ts        # API route definitions
│   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
```

## 🔑 Key Files

### Server-side

`server/src/trpc.ts`:
```typescript
import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;
```

`server/src/router.ts`:
```typescript
import { z } from 'zod';
import { router, publicProcedure } from './trpc';

export const appRouter = router({
  // Your RPC endpoints here
});

export type AppRouter = typeof appRouter;
```

### Client-side

`client/src/trpc.ts`:
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/src/router';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the server:
```bash
cd server
npm run dev
```

4. Start the client:
```bash
cd client
npm run dev
```

## 📦 Dependencies

### Server
- `typescript`
- `zod`

### Client
- `typescript`
