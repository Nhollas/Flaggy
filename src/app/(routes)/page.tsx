import { FlagContextBuilder } from "@/app/features/flags/components/FlagContextBuilder/FlagContextBuilder"

export default async function Home() {
  return (
    <section className="w-full space-y-8">
      <FlagContextBuilder />
    </section>
  )
}
