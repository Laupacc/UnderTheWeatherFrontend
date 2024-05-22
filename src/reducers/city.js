import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    city: [],
    unit: "Celsius",
    sortCriteria: "alphabetical",
    sortOrder: "asc",
};

const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {
        addCity: (state, action) => {
            state.city = [...state.city, action.payload]
        },
        removeCity: (state, action) => {
            state.city = state.city.filter((city) => city !== action.payload);
        },
        setUnitTemp: (state, action) => {
            state.unit = action.payload;
        },
        setSortCriteria: (state, action) => {
            state.sortCriteria = action.payload;
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
    },
});

export const { addCity, removeCity, setUnitTemp, setSortCriteria, setSortOrder } = citySlice.actions;
export default citySlice.reducer;