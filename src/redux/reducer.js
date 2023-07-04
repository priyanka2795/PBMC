import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    userFeature: "buyer",
    updateState: false,
    userProfile: null,
    businessTab: "profile",
    showBusinessDetail: true,
    adminKycTab: "user_kyc",
    fundDetails: null,
    fundType: "",
    updatePBMCAmount: false,
    updateStakerList: false,
    showInvoiceSubmission:true,
};
export const useradmin = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserFeature(state, action) {
            state.userFeature = action.payload
        },
        setUpdateState(state, action) {
            state.updateState = action.payload
        },
        setUserProfile(state, action) {
            state.userProfile = action.payload
        },
        setBusinessTab(state, action) {
            state.businessTab = action.payload
        },
        setShowBusinessDetail(state, action) {
            state.showBusinessDetail = action.payload
        },
        setAdminKycTab(state, action) {
            state.adminKycTab = action.payload
        },
        setFundDetails(state, action) {
            state.fundDetails = action.payload
        },
        setFundtype(state, action) {
            state.fundType = action.payload
        },
        updatePBMCValue(state, action) {
            state.updatePBMCAmount = action.payload
        },
        updateALLStakerList(state, action) {
            state.updateStakerList = action.payload
        },
        setShowInvoiceSubmission(state, action) {
            state.showInvoiceSubmission = action.payload
        },

    },
})
export const { updateALLStakerList, updatePBMCValue, setUserFeature,
     setUpdateState, setUserProfile, setBusinessTab, setShowBusinessDetail, 
     setAdminKycTab, setFundDetails, setFundtype, setShowInvoiceSubmission } = useradmin.actions;

export default useradmin.reducer;