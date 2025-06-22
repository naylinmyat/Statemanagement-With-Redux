import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaInbox } from "react-icons/fa";
import { createTeam, deleteTeam, saveTeamsList, updateTeamBasicInfo } from '@/redux/slices/teamSlice';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { savePlayersList } from '@/redux/slices/playerSlice';

const TeamList = ({ isModalOpen, setIsModalOpen, modalType, setModalType }) => {
    const { currentTheme } = useTheme();
    const { teamsList } = useSelector((store) => store.teamsList);
    const [canClick, setCanClick] = useState(false);
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (name && region && country) {
            setCanClick(true);
        } else {
            setCanClick(false);
        }
    }, [name, region, country])

    const handleCreate = async () => {
        dispatch(createTeam({ name, region, country }));
        dispatch(saveTeamsList());
        setIsModalOpen(false);
        handleClear();
    }

    const handleUpdate = async () => {
        dispatch(updateTeamBasicInfo({ id, name, region, country }));
        dispatch(saveTeamsList());
        setIsModalOpen(false);
        handleClear();
    }

    const handleDeleteClick = async (teamId, playersList, name) => {
        try {
            Swal.fire({
                title: `Are you sure?`,
                text: `You want to delete ( ${name} ) ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: `Yes`,
                cancelButtonText: `No`
            }).then(async (result) => {
                try {
                    if (result.isConfirmed) {
                        dispatch(deleteTeam(teamId, playersList));
                        dispatch(saveTeamsList());
                        dispatch(savePlayersList());
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleClickEdit = (id, name, region, country) => {
        setId(id);
        setName(name);
        setRegion(region);
        setCountry(country);
        setModalType("edit");
        setIsModalOpen(true);
    }

    const handleClear = () => {
        setId(null);
        setName("");
        setRegion("");
        setCountry("");
    }

    return (
        <div
            className={`w-full h-[80vh] overflow-y-auto mt-2 flex flex-wrap justify-center gap-4`}
        >
            {teamsList.length < 1 &&
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <FaInbox className={`text-gray-400`} size={100} />
                    <p className={`text-gray-400 text-2xl`}>No Team Found!</p>
                </div>
            }
            {teamsList.map((team) =>
                <div key={team.id} className={`w-[400px] max-h-[300px] ${currentTheme.upperLayerBg} px-6 py-4 rounded-lg flex flex-col gap-1`}>
                    <div className='flex justify-between items-center'>
                        <p className={`${currentTheme.secondaryTextColor} text-xl`}>{team.name}</p>
                        <div className='flex gap-2 items-center'>
                            <MdModeEdit onClick={() => handleClickEdit(team.id, team.name, team.region, team.country)} className={`${currentTheme.secondaryTextColor} cursor-pointer`} size={22} />
                            <MdDelete onClick={() => handleDeleteClick(team.id, team.playersList, team.name)} className={`${currentTheme.secondaryTextColor} cursor-pointer`} size={22} />
                        </div>
                    </div>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Country: {team.country}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>Region: {team.region}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-sm`}>PlayerCount: {team.playerCount}</p>
                    <p className={`${currentTheme.secondaryTextColor} text-lg`}>Player List</p>
                    <div className="overflow-y-auto max-h-[100px] pr-1">
                        {team.playersList.map((player) => (
                            <p key={player.id} className={`${currentTheme.secondaryTextColor} text-sm`}>
                                {player.name}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen &&
                <div
                    id="popup-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed inset-0 flex items-center justify-center bg-gray-300/50 z-10 transition-opacity duration-300"
                >
                    <div className={`relative ${currentTheme.upperLayerBg} rounded-xl shadow-lg transform transition-all duration-300 translate-y-0 w-full max-w-lg md:w-96 mx-auto p-6`}>
                        <div className="flex items-center justify-between pb-2 mb-4 border-b">
                            <h5 className={`text-lg font-semibold ${currentTheme.secondaryTextColor}`}>
                                {modalType === "create" ?
                                    "Create Team" :
                                    "Update Team"
                                }
                            </h5>
                            <button
                                onClick={() => { setIsModalOpen(false), handleClear() }}
                                type="button"
                                className={`${currentTheme.secondaryTextColor} bg-transparent cursor-pointer rounded-lg p-2 flex justify-center items-center transition-all`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className={`block text-sm font-medium ${currentTheme.secondaryTextColor}`}
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className={`w-full ${currentTheme.primaryBg} rounded-lg ${currentTheme.primaryTextColor} px-3 py-1.5 border-none focus:outline-none`}
                                    placeholder="Enter name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="country"
                                    className={`block text-sm font-medium ${currentTheme.secondaryTextColor}`}
                                >
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    className={`w-full ${currentTheme.primaryBg} rounded-lg ${currentTheme.primaryTextColor} px-3 py-1.5 border-none focus:outline-none`}
                                    placeholder="Enter country..."
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="region"
                                    className={`block text-sm font-medium ${currentTheme.secondaryTextColor}`}
                                >
                                    Region
                                </label>
                                <input
                                    type="text"
                                    id="region"
                                    className={`w-full ${currentTheme.primaryBg} rounded-lg ${currentTheme.primaryTextColor} px-3 py-1.5 border-none focus:outline-none`}
                                    placeholder="Enter name..."
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                disabled={!canClick}
                                type="button"
                                className={`relative w-full inline-flex justify-center items-center rounded-lg border border-transparent px-5 py-2 mt-2 ${currentTheme.primaryBg} ${currentTheme.primaryTextColor} hover:font-semibold cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-100`}
                                onClick={() => { modalType === "create" ? handleCreate() : handleUpdate() }}
                            >
                                <span className="relative z-10">
                                    {modalType === "create" ?
                                        "Create" :
                                        "Update"
                                    }
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TeamList