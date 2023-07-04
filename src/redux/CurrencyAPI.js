// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const CurrencyAPI = createApi({
    reducerPath: 'currency_api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3/' }),
    endpoints: (builder) => ({
        getCurrencyBySymbol: builder.query({
            query: (name) => `avgPrice?symbol=${name}`,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCurrencyBySymbolQuery } = CurrencyAPI