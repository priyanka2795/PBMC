// import { createSlice } from '@reduxjs/toolkit'
// const initialState = {
//     walletBalance_val: "NA",
//     tokenBalance: "NA"
// };
// export const walletBalances = createSlice({
//     name: "walletBalance",
//     initialState,
//     reducers: {
//         getWalletBalance(state, action) {
//             state.walletBalance_val = action.payload
//         },
//         getTokenBalance(state, action) {
//             state.tokenBalance = action.payload
//         }

//     },
// })
// export const { getWalletBalance, getTokenBalance } = walletBalances.actions;

// export default walletBalances.reducer;

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    walletAddress: "NA",
    tokenBalance: "0"
};
export const walletBalances = createSlice({
    name: 'walletBalance',
    initialState,
    reducers: {
        getWalletAddress: (state, action) => {
            state.walletAddress = action.payload
        },
        getTokenBalance(state, action) {
            state.tokenBalance = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { getWalletAddress, getTokenBalance } = walletBalances.actions;

export default walletBalances.reducer