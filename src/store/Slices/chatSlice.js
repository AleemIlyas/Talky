import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../axios/axiosInstance";

export const getChats = createAsyncThunk('Chat/getChats', async (thunkAPI) => {
    try {
        const response = await apiInstance.get('/api/user/chat/chats')
        return response.data
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
    }
})

const initialState = {
    loading: false,
    chats: null,
    error: null
}

const chatSlice = createSlice({
    name: 'Chat',
    initialState,
    reducers: {
        addUserToChat: (state, { payload }) => {
            state.chats.push(payload)
        },
        chatHasNewMessage: (state, { payload }) => {
            //chatId refers to chatId that receive the message and id refer to chat that is open
            const { chatId, id } = payload
            const updatedChats = state.chats.map((chat) =>
                (chat._id === chatId && chat._id !== id) ? { ...chat, hasNewMessage: true } : chat
            )
            state.chats = updatedChats
        },
        removeBadge: (state, { payload }) => {
            const id = payload
            const updatedChats = state.chats.map((chat) =>
                chat._id === id ? { ...chat, hasNewMessage: false } : chat
            )
            state.chats = updatedChats
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChats.pending, (state) => {
                state.loading = true
            })
            .addCase(getChats.fulfilled, (state, { payload }) => {
                state.loading = false,
                    state.chats = payload
            })
            .addCase(getChats.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
    }
})


export const { addUserToChat, chatHasNewMessage, removeBadge } = chatSlice.actions
export const ChatsReducer = chatSlice.reducer