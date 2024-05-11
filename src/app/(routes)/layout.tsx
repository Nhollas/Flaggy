import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { FlagContextContainer } from "@/app/features/flags"
import Providers from "@/app/providers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flaggy",
  description: "This is a cool description",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <FlagContextContainer />
          <main className="mx-auto min-h-screen max-w-6xl space-y-8 p-8 lg:p-16">
            {children}
          </main>
        </body>
      </html>
    </Providers>
  )
}
