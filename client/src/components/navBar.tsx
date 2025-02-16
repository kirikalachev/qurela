"use client";

import { useReducer, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import axios from "axios";

import Menu from "@/app/menu.svg";
import Notification from "@/app/notification.svg";
import NotificationClicked from "@/app/notification-clicked.svg";
import UserCircle from "@/app/user-circle.svg";
import UserCircleClicked from "@/app/user-circle-clicked.svg";
import ChevronDown from "@/app/chevron-down.svg";
import Plus from "@/app/plus.svg";

import "@/app/style.css";

// Define types
interface ToggleState {
  [key: string]: boolean;
}

interface ToggleAction {
  type: "TOGGLE" | "CLOSE";
  payload?: string;
}

const initialState: ToggleState = {
  notification: false,
  profile: false,
  messages: false,
  settings: false,
};

const toggleReducer = (state: ToggleState, action: ToggleAction): ToggleState => {
  switch (action.type) {
    case "TOGGLE":
      const currentState = state[action.payload!];
      return {
        ...Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
        [action.payload!]: !currentState,
      };
    case "CLOSE":
      return Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    default:
      return state;
  }
};

const Navbar: React.FC = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, dispatch] = useReducer(toggleReducer, initialState);
  const [toggleNavContentOpened, setToggleNavContentOpened] = useState(false);
  const [isLogged, setIsLogged] = useState(false); // Detect if the user is logged in

  function toggleMobileNav() {
    setMobileNav(!mobileNav);
  }

  useEffect(() => {
    // Check if token exists (in either cookies or localStorage)
    const token = Cookies.get("token") || localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const toggleNavContent = () => {
    setToggleNavContentOpened(!toggleNavContentOpened);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationDesktop = document.getElementById("notification-desktop");
      const profileDesktop = document.getElementById("profile-desktop");
      const notificationMobile = document.getElementById("notification-mobile");
      const profileMobile = document.getElementById("profile-mobile");

      const clickedInside =
        (notificationDesktop && notificationDesktop.contains(event.target as Node)) ||
        (profileDesktop && profileDesktop.contains(event.target as Node)) ||
        (notificationMobile && notificationMobile.contains(event.target as Node)) ||
        (profileMobile && profileMobile.contains(event.target as Node));

      if (!clickedInside) {
        dispatch({ type: "CLOSE" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle notification or profile dropdown
  const toggleNavBtns = (e: React.MouseEvent, key: "notification" | "profile") => {
    dispatch({ type: "TOGGLE", payload: key });
  };

  const signOut = async () => {
    try {
      const token = Cookies.get("token"); // Get token from cookies

      if (!token) {
        console.warn("No token found, redirecting to login...");
        window.location.href = "/auth/signin";
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/signout/",
        {}, // Send an empty object
        {
          withCredentials: true, // Ensures cookies are sent
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        }
      );

      console.log(response.data.message); // Debug message

      // Remove authentication token from local storage and cookies
      localStorage.removeItem("token");
      Cookies.remove("token");

      // Redirect to login
      window.location.href = "/auth/signin";
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden md:flex fixed top-0 w-full h-[20px] items-center justify-between transition-all z-[50] ${isScrolled ? "bg-marian-blue p-[25px]" : "p-[45px]"}`}>
        <h1 className={`text-4xl font-bold cursor-pointer ${isScrolled ? "text-white" : ""}`}>
          <Link href="/dashboard">Qurela</Link>
        </h1>

        {isLogged ? (
          // Logged-in user navigation
          <ul className="flex justify-between items-center text-center">
            <Link href="/assistant" className="p-2 text-sm">Асистент</Link>
            <Link href="/forum" className="p-2 text-sm">Форум</Link>
            <Link href="/create-post">
              <Image src={Plus} alt="Създай публикация" className="h-6 w-auto" />
            </Link>

            {/* Notifications */}
            <button id="notification-desktop" onClick={(e) => toggleNavBtns(e, "notification")}>
              <Image src={state.notification ? NotificationClicked : Notification} alt="Известия" className="h-7 w-auto" />
            </button>

            {/* Profile */}
            <button id="profile-desktop" onClick={(e) => toggleNavBtns(e, "profile")}>
              <Image src={state.profile ? UserCircleClicked : UserCircle} alt="Профил" className="h-9 w-auto" />
              {state.profile && (
                <ul className="absolute bg-white shadow-lg rounded-2xl p-1 w-[240px] h-[300px] z-10 right-0 top-[100%]">
                  <Link href="/profile" className="px-3 py-2 text-sm hover:bg-black-50">Моят профил</Link>
                  <li className="px-3 py-2 text-sm hover:bg-black-50">Настройки</li>
                  <li onClick={signOut} className="px-3 py-2 text-sm hover:bg-black-50">Излизане</li>
                </ul>
              )}
            </button>
          </ul>
        ) : (
          // Guest navigation
          <ul className="flex items-center">
            <Link href="/about" className="p-2">За сайта</Link>
            <Link href="/instructions" className="p-2">Инструкции</Link>
            <Link href="/faq" className="p-2">ЧЗВ</Link>
            <Link href="/auth/signin" className="p-2">Вход</Link>
            <Link href="/auth/signup" className="bg-brandeis-blue text-white py-1 px-3 rounded-xl">Регистрация</Link>
          </ul>
        )}
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-3 bg-marian-blue shadow-lg z-50">
  <button onClick={toggleMobileNav} className="p-1">
    <Image src={Menu} alt="Меню" className="h-7 w-auto" />
  </button>
  <h1 className="text-3xl font-semibold text-white">
    <Link href="/dashboard">Qurela</Link>
  </h1>
  {isLogged ? (
    <button
      id="profile"
      onClick={(e) => toggleNavBtns(e, "profile")}
      className="relative flex items-center justify-center rounded-full hover:bg-black/20 text-white p-1"
    >
      <Image
        src={state.profile ? UserCircleClicked : UserCircle}
        alt="Профил"
        title="Профил"
        className="h-8 w-auto"
      />

      {state.profile && (
        <div className="absolute bg-white shadow-lg rounded-lg p-2 w-60 h-72 z-10 right-0 top-full mt-2 flex flex-col">
          <Link
            href="/profile"
            className="px-3 py-2 rounded-md text-sm hover:bg-safety-orange transition-colors"
          >
            Моят профил
          </Link>
          <div
            className="px-3 py-2 rounded-md text-sm hover:bg-safety-orange transition-colors cursor-pointer"
          >
            Тъмна/Светла режим
          </div>
          <Link
            href="/settings"
            className="px-3 py-2 rounded-md text-sm hover:bg-safety-orange transition-colors"
          >
            Настройки
          </Link>
          <input
            type="button"
            onClick={signOut}
            value="Излизане"
            className="px-3 py-2 rounded-md text-sm hover:bg-black/20 transition-colors"
          />
        </div>
      )}
    </button>
  ) : (
    <Link href="/auth/signin" className="text-white text-sm">
      Вход
    </Link>
  )}

  {/* Мобилен менют */}

  <div
  className={`h-full py-10 px-4 bg-marian-blue fixed top-14 left-0 w-full flex flex-col items-center justify-between overflow-hidden transition-all duration-300 ${
    mobileNav ? "max-h-full opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
  }`}
>
    {/* Първи списък - по-видим и с модерен дизайн */}
    <ul className="w-full select-none bg-white rounded-lg shadow-md mb-2 text-base">
      <li className="py-2 text-center border-b border-gray-200 hover:bg-gray-100 transition-colors" onClick={toggleMobileNav} >
        <Link href='/assistant'>Асистент</Link>
      </li>
      <li className="py-2 text-center border-b border-gray-200 hover:bg-gray-100 transition-colors" onClick={toggleMobileNav} >
        <Link href='/forum'>Форум</Link>
      </li>
      <li className="py-2 text-center hover:bg-gray-100 transition-colors" onClick={toggleMobileNav} >
        Създай публикация
      </li>
    </ul>

    {/* Втори списък - по-малко акцент */}
    <ul className="w-full flex flex-col items-start text-sm text-gray-600 cursor-pointer ">
  <li className="py-1 text-center" onClick={toggleMobileNav} >
    <Link href="/info#about-us">За сайта</Link>
  </li>
  <li className="py-1 text-center" onClick={toggleMobileNav} >
    <Link href="/info#features">Инструкции</Link>
  </li>
  <li className="py-1 text-center" onClick={toggleMobileNav} >
    <Link href="/info#faq">ЧЗВ</Link>
  </li>
  <li className="py-1 text-center" onClick={toggleMobileNav} >
    <Link href="/resources#privacy-policy">Политика за поверителност</Link>
  </li>
  <li className="py-1 text-center" onClick={toggleMobileNav} >
    <Link href="/resources#terms-of-use">Условия на ползване</Link>
  </li>
</ul>
  </div>

  </nav>

    </>
  );
};

export default Navbar;