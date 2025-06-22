"use client";
import messageAlert from "@/components/messageAlert";
import { createSlice } from "@reduxjs/toolkit";
import { addPlayerToTeam, removePlayerFromTeam } from "./teamSlice";

const getSignInUsername = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("SignInUser"));
        return user?.username || null;
    }
    return null;
};

let signInUserName = getSignInUsername();

const getInitialPlayersState = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("SignInUser"));
        if (user?.username) {
            return {
                playersList: JSON.parse(localStorage.getItem(`PlayersListOf${user.username}`)) || [],
                nextCursorForPlayersList: JSON.parse(localStorage.getItem(`NextCursorOf${user.username}`)) || 0,
            };
        }
    }

    return {
        playersList: [],
        nextCursorForPlayersList: 0,
    };
};

const initialState = getInitialPlayersState();

const playerSlice = createSlice({
    name: "playersList",
    initialState,
    reducers: {
        fetchExistingPlayersList: (state) => {
            signInUserName = getSignInUsername();
            let fetchedState = getInitialPlayersState();
            state.playersList = fetchedState.playersList;
            state.nextCursorForPlayersList = fetchedState.nextCursorForPlayersList;
        },
        fetchPlayersList: (state, { payload }) => {
            const playersData = payload.playersData.map(player => ({
                ...player,
                currentTeam: null,
            }));
            state.playersList = [...state.playersList, ...playersData];
            state.nextCursorForPlayersList = payload.nextCursor;
        },
        saveNextCursorForPlayersList: (state) => {
            localStorage.setItem(`NextCursorOf${signInUserName}`, JSON.stringify(state.nextCursorForPlayersList));
        },
        savePlayersList: (state) => {
            localStorage.setItem(`PlayersListOf${signInUserName}`, JSON.stringify(state.playersList));
        },
        addToTeam: (state, { payload }) => {
            const { playerId, teamId, teamName } = payload;
            const existingPlayer = state.playersList.find(player => player.id === playerId);
            if (!existingPlayer) {
                messageAlert("error", "Player not found!");
                return;
            }
            existingPlayer.currentTeam = { teamId: teamId, teamName: teamName };
        },
        removeCurrentTeam: (state, { payload }) => {
            const { playerId } = payload;
            const existingPlayer = state.playersList.find(player => player.id === playerId);
            if (!existingPlayer) {
                messageAlert("error", "Player not found!");
                return;
            }
            existingPlayer.currentTeam = null;
        },
        removeCurrentTeamByList: (state, { payload }) => {
            const { playersList } = payload;

            if (!Array.isArray(playersList) || playersList.length === 0) {
                return;
            }

            playersList.forEach(({ id }) => {
                const player = state.playersList.find(p => p.id === id);
                if (player) {
                    player.currentTeam = null;
                }
            });
        }
    }
})

export const playerJoinToTeam = (playerId, playerName, teamId, teamName) => (dispatch) => {
    dispatch(addToTeam({ playerId, teamId, teamName }));
    dispatch(addPlayerToTeam({ playerId, playerName, teamId, teamName }));
};

export const playerLeaveFromTeam = (playerId, teamId) => (dispatch) => {
    dispatch(removeCurrentTeam({ playerId }));
    dispatch(removePlayerFromTeam({ playerId, teamId }));
};

export const { fetchExistingPlayersList, fetchPlayersList, saveNextCursorForPlayersList, savePlayersList, addToTeam, removeCurrentTeam, removeCurrentTeamByList } = playerSlice.actions;
export default playerSlice.reducer;