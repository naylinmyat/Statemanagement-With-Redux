"use client";
import messageAlert from "@/components/messageAlert";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usersList: [],
    isSignIn: false,
}

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signIn: (state, { payload }) => {
            if (payload.username === "") {
                messageAlert("error", "Please fill username!")
            } else {
                const signInUser = JSON.parse(localStorage.getItem('UserList')).find(user => user.username === payload.username);
                if (signInUser) {
                    state.isSignIn = true;
                    localStorage.setItem('Token', JSON.stringify(true));
                    localStorage.setItem('SignInUser', JSON.stringify(signInUser));
                } else {
                    const addUser = { username: payload.username };
                    state.usersList = JSON.parse(localStorage.getItem('UserList'));
                    state.usersList.push(addUser);
                    localStorage.setItem('UserList', JSON.stringify(state.usersList));
                    state.isSignIn = true;
                    localStorage.setItem('Token', JSON.stringify(true));
                    localStorage.setItem('SignInUser', JSON.stringify(addUser));
                }
                messageAlert("success", "Login Successfully!");
            }
        },
        signOut: (state) => {
            state.isSignIn = false;
            localStorage.setItem('Token', JSON.stringify(false));
            localStorage.setItem('SignInUser', JSON.stringify(null));
        },
        setIsSignIn: (state) => {
            state.isSignIn = true;
        }
    }
})

export const { signIn, signOut, setIsSignIn } = authSlice.actions;
export default authSlice.reducer;