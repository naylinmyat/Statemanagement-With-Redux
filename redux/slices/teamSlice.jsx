"use client";
import { createSlice } from "@reduxjs/toolkit";
import messageAlert from "@/components/messageAlert";
import { removeCurrentTeamByList } from "./playerSlice";

const getSignInUsername = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("SignInUser"));
        return user?.username || null;
    }
    return null;
};

let signInUserName = getSignInUsername();

const getInitialTeamsState = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("SignInUser"));
        if (user?.username) {
            return {
                teamsList: JSON.parse(localStorage.getItem(`TeamsListOf${user.username}`)) || [],
            };
        }
    }

    return {
        teamsList: [],
    };
};

const initialState = getInitialTeamsState();

const teamSlice = createSlice({
    name: "teamsList",
    initialState,
    reducers: {
        fetchExistingTeamsList: (state) => {
            signInUserName = getSignInUsername();
            let fetchedState = getInitialTeamsState();
            state.teamsList = fetchedState.teamsList;
        },
        createTeam: (state, { payload }) => {
            const { name, region, country } = payload;
            const validTeam = state.teamsList.find(team => team.name === payload.name);
            if (validTeam) {
                messageAlert("error", "This team is already exists!");
            } else if (!name || !region || !country) {
                messageAlert("error", "Please fill all informations!");
            } else {
                let id;
                if (state.teamsList.length < 1) {
                    id = 1;
                } else {
                    id = state.teamsList[state.teamsList.length - 1].id + 1;
                }
                const addTeam = {
                    id: id,
                    name: name,
                    playersList: [],
                    playerCount: 0,
                    region: region,
                    country: country,
                };
                state.teamsList.push(addTeam);
                messageAlert("success", "Created Successfully!");
            }
        },
        updateTeamBasicInfo: (state, { payload }) => {
            const { id, name, region, country } = payload;

            if (!name || !region || !country) {
                messageAlert("error", "Please fill all informations!");
                return;
            }

            const existingTeam = state.teamsList.find(team => team.id === id);
            if (!existingTeam) {
                messageAlert("error", "Team not found!");
                return;
            }

            const duplicateName = state.teamsList.find(team => team.name === name && team.id !== id);
            if (duplicateName) {
                messageAlert("error", "Another team with this name already exists!");
                return;
            }

            existingTeam.name = name;
            existingTeam.region = region;
            existingTeam.country = country;

            messageAlert("success", "Team updated successfully!");
        },
        removeTeam: (state, { payload }) => {
            const { teamId } = payload;
            const teamIndex = state.teamsList.findIndex(team => team.id === teamId);

            if (teamIndex !== -1) {
                state.teamsList.splice(teamIndex, 1);
            } else {
                messageAlert("error", "Team not found!");
            }
        },
        addPlayerToTeam: (state, { payload }) => {
            const { playerId, playerName, teamId, teamName } = payload;

            if (!playerId || !playerName || !teamId || !teamName) {
                messageAlert("error", "Failed to add!");
                return;
            }

            const existingTeam = state.teamsList.find(team => team.id === teamId);
            if (!existingTeam) {
                messageAlert("error", "Team not found!");
                return;
            }

            existingTeam.playersList.push({ id: playerId, name: playerName });
            existingTeam.playerCount++;

            messageAlert("success", "Joined Successfully!");
        },
        removePlayerFromTeam: (state, { payload }) => {
            const { playerId, teamId } = payload;

            if (!playerId || !teamId) {
                messageAlert("error", "Failed to leave!");
                return;
            }

            const existingTeam = state.teamsList.find(team => team.id === teamId);
            if (!existingTeam) {
                messageAlert("error", "Team not found!");
                return;
            }

            existingTeam.playersList = existingTeam.playersList.filter(player => player.id !== playerId);
            existingTeam.playerCount--;

            messageAlert("success", "Leaved Successfully!");
        },
        saveTeamsList: (state) => {
            localStorage.setItem(`TeamsListOf${signInUserName}`, JSON.stringify(state.teamsList));
        },
    }
})

export const deleteTeam = (teamId, playersList) => (dispatch) => {
    dispatch(removeTeam({ teamId }));
    dispatch(removeCurrentTeamByList({ playersList }));
    messageAlert("success", "Team removed successfully!");
};

export const { fetchExistingTeamsList, createTeam, updateTeamBasicInfo, removeTeam, addPlayerToTeam, removePlayerFromTeam, saveTeamsList } = teamSlice.actions;
export default teamSlice.reducer;