import { configureStore } from "@reduxjs/toolkit";
import useradmin from "./redux/reducer";
// import walletAmountSlices from "./redux/walletAmountSlice";

import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { CurrencyAPI } from "./redux/CurrencyAPI";

import walletBalances from "./redux/walletAmountSlice";

const store = configureStore({
    reducer: {
        user: useradmin,
        walletBalance: walletBalances,
        // walletBalance:walletAmountSlices,
        [CurrencyAPI.reducerPath]: CurrencyAPI.reducer
    },

    middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(CurrencyAPI.middleware),
});

setupListeners(store.dispatch)

export default store;

