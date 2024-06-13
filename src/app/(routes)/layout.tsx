import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { FlagContextDetails, getFlagContext } from "@/app/features/flags"

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
        <main className="mx-auto mb-16 max-w-screen-sm p-4 sm:mb-[72px] sm:p-6">
          {children}
        </main>
        {flagContext.contexts.length > 0 && (
          <FlagContextDetails flagContext={flagContext} />
        )}
      </body>
    </html>
  )
}
