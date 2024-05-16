import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    city: [],
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
    },
});

export const { addCity, removeCity } = citySlice.actions;
export default citySlice.reducer;