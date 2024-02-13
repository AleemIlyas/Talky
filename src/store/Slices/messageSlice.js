import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../axios/axiosInstance";


export const fetchMessages = createAsyncThunk('message/fetchMessages', async (chatId) => {
    try {
        const response = await apiInstance.get('/api/user/Messages/getMessages/' + chatId)
        return response.data.Messages
    }
    catch (err) {
        return err
    }
})


export const sendMessage = createAsyncThunk('message/sendMessage', async (data) => {
    try {
        const response = await apiInstance.post('/api/user/Messages/addMessage', data)
        return response.data
    }
    catch (err) {
        return err
    }
})

const initialState = {
    loading: false,
    messages: [],
}

const message = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, { payload }) => {
            console.log(payload)
            if (state.messages !== undefined) {
                state.messages.push(payload)
            }
            else {
                state.messages = [payload]
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.fulfilled, (state, { payload }) => {
                state.messages = payload
            })
            .addCase(sendMessage.fulfilled, (state, { payload }) => {
                state.messages.push(payload)
            })

    }
})

export const { addMessage } = message.actions
export const messageReducer = message.reducer