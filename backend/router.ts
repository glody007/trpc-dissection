import { z } from 'zod';
import  { createRPC, Procedure } from './rpc';

const rpc = createRPC()

export const router = rpc.router({
    getShinobi: rpc.procedure().query(async () => {
        return {
            "id": 1,
            "result": "Shinobi!"
        }
    }),
    getSorcerer: rpc.procedure().query(async () => {
        return {
            "id": 1,
            "result": "Sorcerer!"
        }
    }),
    addShinobi: rpc
        .procedure()
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input }) => {
            return {
                "data": input.name
            }
        })
})

export type AppRouter = typeof router