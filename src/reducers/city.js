import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    city: [],
    unit: "Celsius"
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
    },
});

export const { addCity, removeCity, setUnitTemp } = citySlice.actions;
export default citySlice.reducer;