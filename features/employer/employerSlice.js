import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    category: [
        {
            id: 1,
            name: "Residential",
            value: "residential",
        },
        {
            id: 2,
            name: "Commercial",
            value: "commercial",
        },
        {
            id: 3,
            name: "Industrial",
            value: "industrial",
        },
        {
            id: 4,
            name: "Apartments",
            value: "apartments",
        },
    ],
    companySize: [],
    facility: "",
};

export const employerSlice = createSlice({
    name: "employer",
    initialState,
    reducers: {
        setFacility: (state, payload) => {
            state.facility = payload;
        },
    },
});

export const { setFacility } = employerSlice.actions;
export default employerSlice.reducer;
