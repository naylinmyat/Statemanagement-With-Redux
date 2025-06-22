"use client";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useState } from "react";
import messageAlert from "@/components/messageAlert";
import { setIsSignIn, signIn } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { saveNextCursorForPlayersList, savePlayersList } from "@/redux/slices/playerSlice";


const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const { usersList } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (localStorage.getItem('UserList') === null) {
      localStorage.setItem('UserList', JSON.stringify(usersList));
    }

    if(localStorage.getItem('SignInUser') !== "null" && localStorage.getItem('SignInUser') !== null){
      dispatch(saveNextCursorForPlayersList());
      dispatch(savePlayersList());
    }

    if (localStorage.getItem('Token') === null) {
      localStorage.setItem('Token', JSON.stringify(false));
    } else if (JSON.parse(localStorage.getItem('Token')) === true) {
      dispatch(setIsSignIn());
      router.push("/mainpage");
    }
  }, [])

  const handleUsernameOnChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      dispatch(signIn({ username }));
      router.push("/mainpage");
    } catch (e) {
      messageAlert("error", e);
      console.log(e);
    }
  }

  return (
    <div className={`w-screen h-screen ${currentTheme.primaryBg} flex justify-center items-center transition-all`}>
      <Navbar />
      <form onSubmit={handleLogin}>
        <div className={`w-[360px] ${currentTheme.upperLayerBg} rounded-lg py-6 px-10 flex flex-col items-center gap-4 transition-all`}>
          <p className={`${currentTheme.secondaryTextColor} text-center text-xl font-semibold`}>Login Form</p>
          <input
            placeholder="Enter username..."
            value={username}
            onChange={handleUsernameOnChange}
            className={`w-full ${currentTheme.primaryBg} rounded-lg ${currentTheme.primaryTextColor} px-3 py-1.5 border-none focus:outline-none`}
          />
          <button type="submit" className={`px-6 py-0.5 ${currentTheme.primaryBg} ${currentTheme.primaryTextColor} rounded-lg cursor-pointer hover:font-semibold transition-all`}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
