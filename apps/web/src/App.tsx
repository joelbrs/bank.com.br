import { Suspense } from "react"
import { RouterProvider } from 'react-router-dom'
import { RelayEnvironmentProvider } from "react-relay";
import { router } from './router'
import { ThemeProvider } from "./components"
import { environment } from "./relay";
import { Toaster } from "@repo/ui/components";

function App() {
  return (
      <RelayEnvironmentProvider environment={environment}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Suspense fallback="Loading...">
              <RouterProvider router={router} />
              <Toaster closeButton richColors/>
            </Suspense>    
        </ThemeProvider>
      </RelayEnvironmentProvider>
  )
}

export default App
