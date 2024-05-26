import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { FlagContextContainer, getFlagContext } from "@/app/features/flags"
import Providers from "@/app/providers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flaggy",
  description: "This is a cool description",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const flagContext = await getFlagContext()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers flagContext={flagContext}>
          <FlagContextContainer />
          <main className="mx-auto min-h-screen max-w-2xl space-y-8 p-8 lg:p-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
