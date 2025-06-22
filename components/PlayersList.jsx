"use client";
import { fetchPlayersList, playerJoinToTeam, playerLeaveFromTeam, saveNextCursorForPlayersList, savePlayersList } from '@/redux/slices/playerSlice'
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react'
import messageAlert from './messageAlert';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTheme } from '@/contexts/ThemeContext';
import { BalldontlieAPI } from "@balldontlie/sdk";
import { saveTeamsList } from '@/redux/slices/teamSlice';

const PlayersList = () => {
    const { currentTheme, theme } = useTheme();
    const { playersList, nextCursorForPlayersList } = useSelector((store) => store.playersList);
    const { teamsList } = useSelector((store) => store.teamsList);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const api = new BalldontlieAPI({ apiKey: "5e890af8-a947-45a0-ac27-db2bfffc28f3" });

    const [teamId, setTeamId] = useState(null);
    const [teamName, setTeamName] = useState(null);
    const [selectedTeams, setSelectedTeams] = useState({});

    const handleSelectedTeamChange = (playerId, selectedTeamId) => {
        const parsedId = parseInt(selectedTeamId, 10);
        const result = teamsList.find((team) => team.id === parsedId);

        setSelectedTeams(prev => ({
            ...prev,
            [playerId]: {
                teamId: parsedId,
                teamName: result?.name || null
            }
        }));
    };

    useEffect(() => {
        if (nextCursorForPlayersList === 0) {
            const fetchData = async () => {
                try {
                    const players = await api.nba.getPlayers({
                        season: 2024,
                        per_page: 10,
                        cursor: nextCursorForPlayersList,
                    });
                    dispatch(fetchPlayersList({
                        playersData: players.data,
                        nextCursor: players.meta.next_cursor,
                    }));
                    dispatch(saveNextCursorForPlayersList());
                    dispatch(savePlayersList());
                } catch (error) {
                    messageAlert("error", error);
                }
            };

            fetchData();
        }
    }, [nextCursorForPlayersList]);


    const handleScroll = async () => {
        try {
            const el = scrollRef.current;
            if (!el) return;

            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
            if (nearBottom && !isLoadingMore) {
                setIsLoadingMore(true);
                const players = await api.nba.getPlayers({ season: 2024, per_page: 10, cursor: nextCursorForPlayersList });
                dispatch(fetchPlayersList({ playersData: players.data, nextCursor: players.meta.next_cursor }));
                dispatch(saveNextCursorForPlayersList());
                dispatch(savePlayersList());
                setIsLoadingMore(false);
            }
        } catch (e) {
            setIsLoadingMore(false);
            messageAlert("error", e);
        }
    };

    const handleJoin = (playerId, playerName, teamId, teamName) => {
        dispatch(playerJoinToTeam(playerId, playerName, teamId, teamName));
        dispatch(savePlayersList());
        dispatch(saveTeamsList());
    };

    const handleLeave = (playerId, teamId) => {
        dispatch(playerLeaveFromTeam(playerId, teamId));
        dispatch(savePlayersList());
        dispatch(saveTeamsList());
    }

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`w-full h-[80vh] overflow-y-auto mt-2 flex flex-wrap justify-center gap-4`}
        >
            {playersList.map((player) =>
                <div key={player.id} className={`w-[400px] ${currentTheme.upperLayerBg} px-6 py-4 rounded-lg flex flex-col gap-1`}>
                    <p className={`${currentTheme.secondaryTextColor} text-xl`}>{player.first_name} {player.last_name}</p>
                    <p className={`${currentTheme.yellowTextColor} text-lg`}>Team : {player.currentTeam?.teamName || "Invalid"}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Country: {player.country}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>College: {player.college}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Height: {player.height}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Weight: {player.weight}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Position: {player.position}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Jersey Number: {player.jersey_number}</p>
                    <div className='flex gap-2 items-center mt-2'>
                        <select
                            id={`teams-${player.id}`}
                            value={selectedTeams[player.id]?.teamId || ""}
                            onChange={(e) => handleSelectedTeamChange(player.id, e.target.value)}
                            className={`w-[200px] px-4 py-2 border border-gray-300 rounded-lg ${currentTheme.secondaryTextColor} focus:outline-none`}
                        >
                            <option value="">Select a team</option>
                            {teamsList.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name} - {team.country}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                const selected = selectedTeams[player.id];
                                if (selected) {
                                    handleJoin(player.id, `${player.first_name} ${player.last_name}`, selected.teamId, selected.teamName);
                                } else {
                                    messageAlert("error", "Please select a team");
                                }
                            }}
                            disabled={!selectedTeams[player.id]?.teamId || player.currentTeam}
                            className={`px-4 py-2 ${theme === "light" ? 'bg-green-600 text-black' : 'bg-green-500 text-white'} rounded-lg cursor-pointer hover:font-semibold disabled:cursor-not-allowed disabled:bg-green-600/50`}
                        >
                            Join
                        </button>
                        <button
                            onClick={() => handleLeave(player.id, player.currentTeam.teamId)}
                            disabled={player.currentTeam ? false : true}
                            className={`px-4 py-2 bg-red-500 ${theme === "light" ? 'text-black' : 'text-white'} rounded-lg cursor-pointer hover:font-semibold disabled:cursor-not-allowed disabled:bg-red-500/50`}
                        >
                            Leave
                        </button>
                    </div>
                </div>
            )}
            {isLoadingMore &&
                <div className="w-full text-center flex justify-center items-center py-3">
                    <AiOutlineLoading3Quarters className={`animate-spin text-lg ${currentTheme.primaryTextColor}`} />
                </div>
            }
        </div>
    )
}

export default PlayersList