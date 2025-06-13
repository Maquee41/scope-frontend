import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuthInit } from '@/hooks/useAuthInit'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'

const queryClient = new QueryClient()

function RootWrapper() {
  useAuthInit()
  useTokenRefresh()

  return (
    <>
      <Outlet />
      <ModeToggle />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RootWrapper />
      </ThemeProvider>
    </QueryClientProvider>
  ),
})
