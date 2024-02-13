import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./Slices/userSlice";
import { ChatsReducer } from './Slices/chatSlice'
import { messageReducer } from './Slices/messageSlice'

const reducers = combineReducers({
    user: userReducer,
    chat: ChatsReducer,
    message: messageReducer,
})


export default reducers;