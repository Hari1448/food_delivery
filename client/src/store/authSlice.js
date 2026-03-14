import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get('/auth/me');
            return data.user;
        } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue(err.response?.data?.message || 'Session expired');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
