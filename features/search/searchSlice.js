import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm: "",
    searchAddress: "",
    searchFacility: "",
};

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchFields: (state, { payload }) => {
            state.searchTerm = payload.searchTerm;
            state.searchAddress = payload.searchAddress;
            state.searchFacility = payload.searchFacility;
        },
    },
});

export const { setSearchFields } = searchSlice.actions;
export default searchSlice.reducer;
