import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiInstance from '../../axios/axiosInstance'


export const logOut = () => {
    return {
        type: 'User/logOut'
    }
}


export const checkTokenExpire = createAsyncThunk(
    'User/checkTokenExpire',
    async (_, { getState, dispatch }) => {
        const { user } = getState();
        const expireTime = parseInt(user.expireTime || localStorage.getItem('expireTime'))
        const currentTime = Date.now();


        if (currentTime > expireTime) {
            return dispatch(logOut());
        } else {
            const timeToExpire = expireTime - currentTime;
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(dispatch(logOut()));
                }, timeToExpire);
            });
        }
    })


export const loginUser = createAsyncThunk('User/login', async (data, thunkAPI) => {
    try {
        const response = await apiInstance.post('/api/user/Login', data)
        return response.data
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
    }
})

export const signUpUser = createAsyncThunk('User/SignUp', async (data, thunkAPI) => {
    try {
        const response = await apiInstance.post('/api/user/SignUp', data)
        return response.data
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
    }
})

export const LogOutUser = createAsyncThunk('User/LogOut', async (thunkAPI) => {
    try {
        const response = await apiInstance.post('/api/user/LogOut')
        return response.data
    }
    catch (err) {
        console.log(err)
        return thunkAPI.rejectWithValue(err.response.data)
    }
})


const initialState = {
    isAuthenticated: false,
    userData: {},
    loading: false,
    error: null,
    expireTime: null
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setIsAuthenticated: (state, { payload }) => {
            state.isAuthenticated = true,
                state.userData = JSON.parse(payload)
            state.expireTime = localStorage.getItem('expireTime')
        },
        logOut: (state) => {
            localStorage.clear()
            state.isAuthenticated = false
            state.userData = {}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                localStorage.setItem('token', payload.token)
                localStorage.setItem('user', JSON.stringify(payload.user))
                localStorage.setItem('expireTime', JSON.stringify(payload.expireTime))
                state.isAuthenticated = true
                state.loading = false
                state.userData = payload.user
                state.expireTime = payload.expireTime
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(signUpUser.pending, (state) => {
                state.loading = true
            })
            .addCase(signUpUser.fulfilled, (state, { payload }) => {
                localStorage.setItem('token', payload.token)
                localStorage.setItem('user', JSON.stringify(payload.user))
                localStorage.setItem('expireTime', JSON.stringify(payload.expireTime))
                state.isAuthenticated = true
                state.loading = false
                state.userData = payload.user
                state.expireTime = payload.expireTime
            })
            .addCase(signUpUser.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload.error
            })
            .addCase(LogOutUser.fulfilled, (state) => {
                localStorage.clear()
                state.isAuthenticated = false
                state.userData = {}
            })
    }
})

export const LogOutOnTokenExpire = createAsyncThunk()

export const { setIsAuthenticated } = userSlice.actions
export const userReducer = userSlice.reducer
