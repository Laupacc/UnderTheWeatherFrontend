import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: null },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload;
        },
        logout: (state) => {
            state.value.username = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;