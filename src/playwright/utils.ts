import { z } from "zod"

export const buildLocalUrl = (port: string, path: string = "") =>
  `http://localhost:${port}${path}`

export const playwrightEnv = z
  .object({
    FLAG_SECRET: z.string(),
  })
  .parse(process.env)
