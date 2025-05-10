import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import App from './App'

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
})

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: Infinity,
        dehydrateOptions: {
          shouldDehydrateQuery: (query: any) => {
            return query.options.staleTime === Infinity
          },
        },
      }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
)
