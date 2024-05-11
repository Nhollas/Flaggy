import { z } from "zod"

const envSchema = z.object({
  LAUNCHDARKLY_SDK_KEY: z.string(),
  FLAG_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
