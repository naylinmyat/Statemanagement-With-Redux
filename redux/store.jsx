"use client";
import { configureStore } from "@reduxjs/toolkit"
import userReducer from"./slices/authSlice"
import playersListReducer from "./slices/playerSlice"
import teamsListReducer from "./slices/teamSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        playersList: playersListReducer,
        teamsList: teamsListReducer,
    }
})