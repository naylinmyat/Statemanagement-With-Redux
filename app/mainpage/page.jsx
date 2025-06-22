"use client";
import Navbar from '@/components/Navbar'
import PlayersList from '@/components/PlayersList';
import TeamList from '@/components/TeamList';
import { useTheme } from '@/contexts/ThemeContext';
import { setIsSignIn } from '@/redux/slices/authSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { fetchExistingPlayersList } from '@/redux/slices/playerSlice';
import { fetchExistingTeamsList } from '@/redux/slices/teamSlice';

const MainPage = () => {
    const { currentTheme } = useTheme();
    const [currentTab, setCurrentTab] = useState("players");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('Token') === null) {
            localStorage.setItem('Token', JSON.stringify(false));
        } else if (JSON.parse(localStorage.getItem('Token')) === true) {
            dispatch(setIsSignIn());
            dispatch(fetchExistingPlayersList());
            dispatch(fetchExistingTeamsList());
        }
    }, [])

    return (
        <div className={`w-screen ${currentTheme.primaryBg} flex flex-col items-center transition-all`}>
            <Navbar />
            <div className='flex-1 mt-14 w-full px-[4%] py-4'>
                <div className='w-[92%] fixed flex flex-row gap-4 justify-center items-center'>
                    <button onClick={() => setCurrentTab("players")} className={`px-6 py-1 border-1 ${currentTheme.primaryBorder} ${currentTab === "players" ? `${currentTheme.secondaryTextColor} ${currentTheme.upperLayerBg}` : `${currentTheme.primaryTextColor} ${currentTheme.primaryBg}`} rounded-lg cursor-pointer hover:font-semibold transition-all`}>Players</button>
                    <button onClick={() => setCurrentTab("teams")} className={`px-6 py-1 border-1 ${currentTheme.primaryBorder} ${currentTab === "teams" ? `${currentTheme.secondaryTextColor} ${currentTheme.upperLayerBg}` : `${currentTheme.primaryTextColor} ${currentTheme.primaryBg}`} rounded-lg cursor-pointer hover:font-semibold transition-all`}>Teams</button>
                    {currentTab !== "players" &&
                        <button onClick={() => { setModalType("create"), setIsModalOpen(true) }} className={`px-6 py-1 border-1 ${currentTheme.primaryBorder} ${currentTheme.secondaryTextColor} ${currentTheme.upperLayerBg} rounded-lg cursor-pointer hover:font-semibold transition-all`}>Create Team</button>
                    }
                </div>
                <div className={`mt-12`}>
                    {currentTab === "players" ?
                        <PlayersList /> :
                        <TeamList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} modalType={modalType} setModalType={setModalType} />
                    }
                </div>
            </div>
        </div>
    )
}

export default MainPage