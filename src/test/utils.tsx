import { render } from "@testing-library/react"

import QueryClientProvider from "@/app/providers/QueryClientProvider"

export * from "@testing-library/react"

export function renderWithProviders(children: React.ReactNode) {
  return render(<QueryClientProvider>{children}</QueryClientProvider>)
}

export async function resolveComponent(Component: any, props: any) {
  const ComponentResolved = await Component(props)

  return () => ComponentResolved
}
