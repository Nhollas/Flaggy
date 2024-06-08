import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { FlagContextDetails, getFlagContext } from "@/app/features/flags"
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
          <main className="mx-auto min-h-screen max-w-screen-sm p-4 sm:p-6">
            {children}
          </main>
          {flagContext.contexts.length > 0 && (
            <FlagContextDetails flagContext={flagContext} />
          )}
        </Providers>
      </body>
    </html>
  )
}
