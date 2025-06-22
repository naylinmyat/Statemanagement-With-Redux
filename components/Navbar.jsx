"use client";
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "@/contexts/ThemeContext";
import { signOut } from "@/redux/slices/authSlice";
import { IoMdSunny } from "react-icons/io";
import { IoMoonSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { theme, toggleTheme, currentTheme } = useTheme();
    let { isSignIn } = useSelector((store) => store.user);
    const [displayLetter, setDisplayLetter] = useState("Welcome");

    useEffect(() => {
        if(isSignIn){
            setDisplayLetter(JSON.parse(localStorage.getItem('SignInUser')).username);
        }
    }, [isSignIn])

    const handleSignOut = () => {
        dispatch(signOut());
        router.push("/");
    }

    return (
        <>
            <div className={`w-full fixed top-0 flex flex-row justify-between items-center px-[4%] py-3 text-lg font-medium ${currentTheme.upperLayerBg}`}>
                <p className={`text-3xl ${currentTheme.secondaryTextColor}`}>
                    {displayLetter}
                </p>
                <div className="flex items-center">
                    <div className="flex items-center text-xl mr-7">
                        <button
                            onClick={toggleTheme}
                            className="cursor-pointer"
                        >
                            {theme === "light" ?
                                <IoMdSunny className="text-white text-4xl transition-all" /> :
                                <IoMoonSharp className="text-black text-4xl transition-all" />
                            }
                        </button>
                    </div>
                    <p onClick={() => handleSignOut()} className={`${currentTheme.secondaryTextColor} text-xl cursor-pointer hover:underline underline-offset-3 transition-all`}>SignOut</p>
                </div>
            </div>
        </>
    )
}

export default Navbar