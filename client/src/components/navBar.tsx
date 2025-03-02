'use client';

import { useReducer, useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import CreatePost from "@/components/createPost/createPost";
import { Menu, ChevronDown, Plus } from "lucide-react";
import { useCreatePost } from "@/context/CreatePostContext";
import ProfileAvatar from "@/components/profileAvatar";

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

// Define a profile data interface for the logged-in user
interface ProfileData {
  username: string;
  profilePic: string | null;
}

const Navbar: React.FC = () => {
  const { openPost } = useCreatePost();

  const [mobileNav, setMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, dispatch] = useReducer(toggleReducer, initialState);
  const [toggleNavContentOpened, setToggleNavContentOpened] = useState(false);
  const [isLogged, setIsLogged] = useState(false); // Checking if the user is logged in
  const [profile, setProfile] = useState<ProfileData | null>(null); // Logged-in user profile

  // State for dark mode (theme stored in localStorage)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode based on localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  function toggleMobileNav() {
    setMobileNav(!mobileNav);
  }

  useEffect(() => {
    // Check for token in Cookies
    const token = Cookies.get("token");
    setIsLogged(!!token);
  }, []);

  // Fetch logged-in user profile for navbar avatar
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setProfile({
          username: response.data.username,
          profilePic: response.data.profilePic,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch profile data:", error);
      });
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
      const toggleKeys = Object.keys(initialState);
      let clickedInside = false;
      toggleKeys.forEach(key => {
        const elements = document.querySelectorAll(`[id="${key}"]`);
        elements.forEach(el => {
          if (el.contains(event.target as Node)) {
            clickedInside = true;
          }
        });
      });
      if (!clickedInside) {
        dispatch({ type: "CLOSE" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function for toggling dropdown (notifications, profile, etc.)
  const toggleNavBtns = (
    e: React.MouseEvent,
    key: "notification" | "profile" | "messages" | "settings"
  ) => {
    dispatch({ type: "TOGGLE", payload: key });
  };

  const signOut = async () => {
    localStorage.removeItem("popupShowed");
    localStorage.removeItem("theme");

    try {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("No token found, redirecting to login...");
        window.location.href = "/auth/signin";
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/signout/",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);
      Cookies.remove("token");
      window.location.href = "/auth/signin";
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`select-none hidden md:flex fixed top-0 w-full h-[20px] items-center justify-between transition-all z-[50] ${
          isScrolled ? "bg-marian-blue p-[25px]" : "py-[45px] px-[90px]"
        }`}
      >
        <h1 className={`text-4xl font-bold cursor-pointer ${isScrolled ? "text-white" : "dark:text-d-cadet-gray"}`}>
          <Link href="/dashboard">Qurela</Link>
        </h1>

        {isLogged ? (
          // Navigation for logged-in user
          <ul
            className={`flex justify-between items-center text-center cursor-pointer transition-all ${
              isScrolled ? "basis-[300px]" : "basis-[350px]"
            }`}
          >
            {/* Assistant Dropdown */}
            <Link
              href="/assistant"
              className={`flex transition-all items-center justify-end group p-[1vh] text-sm rounded-full relative hover:bg-black-50 }`}
            >
              <span className={`z-1 ${isScrolled ? "text-white" : "dark:text-d-cadet-gray"}`}>
                Асистент
              </span>
              <ChevronDown size={24} stroke={isScrolled ? "white" : "currentColor"} className={isScrolled ? "dark:stroke-white" : "dark:stroke-d-cadet-gray"}/>
              <ul className="hidden group-hover:block absolute bg-white dark:bg-d-rich-black dark:text-d-cadet-gray dark:border dark:border-d-cadet-gray shadow-lg rounded-2xl p-1 w-inherit z-15 top-[100%] right-0 overflow-hidden"
              >
                <li
                  className={`px-3 py-2 text-sm rounded-2xl dark:text-d-cadet-gray ${
                    isScrolled ? "hover:bg-safety-orange dark:hover:bg-d-charcoal" : "hover:bg-black-50"
                  }`}
                >
                  Проверка
                </li>
                <li
                  className={`px-3 py-2 text-sm rounded-2xl dark:text-d-cadet-gray ${
                    isScrolled ? "hover:bg-safety-orange dark:hover:bg-d-charcoal" : "hover:bg-black-50"
                  }`}
                >
                  Въпрос
                </li>
                <li
                  className={`px-3 py-2 text-sm rounded-2xl dark:text-d-cadet-gray ${
                    isScrolled ? "hover:bg-safety-orange dark:hover:bg-d-charcoal" : "hover:bg-black-50"
                  }`}
                >
                  Обобщаване
                </li>
              </ul>
            </Link>

            {/* Forum Button */}
            <li
              className={`flex transition-all items-center justify-center rounded-full p-[1vh] text-sm hover:bg-black-50
              }`}
            >
              <span className={`${isScrolled ? "text-white" : "dark:text-d-cadet-gray"}`}>
                <Link href="/forum">Форум</Link>
              </span>
            </li>

            {/* Create Post Button */}
            <li
              className={`flex transition-all items-center justify-center rounded-full p-[1.5px] hover:bg-black-50 }`}
              onClick={openPost}
            >
              <span className={`${isScrolled ? "text-white" : ""}`}>
              <Plus size={24} stroke={isScrolled ? "white" : "currentColor"} className={isScrolled ? "dark:stroke-white" : "dark:stroke-d-cadet-gray"}/>
              </span>
            </li>

            {/* Profile Button */}
            <button
              id="profile"
              onClick={(e) => toggleNavBtns(e, "profile")}
              className={`relative flex items-center justify-center rounded-full aspect-square dark:text-d-cadet-gray ${
                isScrolled
                  ? state.profile
                    ? ""
                    : "hover:bg-transparent focus:bg-transparent"
                  : state.profile
                  ? "hover:bg-black-50 focus:bg-black-50"
                  : "hover:bg-transparent focus:bg-transparent"
              } ${isScrolled ? "text-white" : ""}`}
            >
              {/* Use profile avatar with logged in profile data */}
              <ProfileAvatar profilePic={profile?.profilePic || null} username={profile?.username || "User"} />

              {state.profile && (
                <div
                className={`dark:text-d-cadet-gray dark:bg-d-rich-black dark:border dark:border-d-cadet-gray absolute bg-white shadow-lg rounded-2xl p-1 w-[240px] h-[300px] z-10 right-0 flex flex-col ${
                  isScrolled ? "top-[120%]" : "top-[100%]"
                  }`}
                >
                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-safety-orange dark:hover:bg-d-charcoal" : "hover:bg-black-50"
                    }`}
                  >
                    Моят профил
                  </Link>
                  {/* Dark/Light Theme - Desktop */}
                  <div
                    onClick={toggleDarkMode}
                    className={`px-3 py-2 rounded-2xl text-sm cursor-pointer dark:text-d-cadet-gray ${
                      isScrolled ? "hover:bg-safety-orange dark:hover:bg-d-charcoal" : "hover:bg-black-50"
                    }`}
                  >
                    {isDarkMode ? "Светла тема" : "Тъмна тема"}
                  </div>
                  <input
                    type="button"
                    onClick={signOut}
                    value="Излизане"
                    className={`px-3 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-safety-orange dark:hover:bg-d-charcoal" : "hover:bg-black-50"
                    }`}
                  />
                </div>
              )}
            </button>
          </ul>
        ) : (
          // Navigation for guest user
          <ul
            className={`flex justify-between items-center text-center cursor-pointer transition-all ${
              isScrolled ? "basis-[420px] text-white" : "basis-[450px]"
            }`}
          >
            <Link href="/info" className="p-2">
              За сайта
            </Link>
            <Link href="/info#instructions" className="p-2">
              Инструкции
            </Link>
            <Link href="/info#faq" className="p-2">
              ЧЗВ
            </Link>
            <Link href="/auth/signin" className={`p-2 text-brandeis-blue ${isScrolled ? "text-white" : ""}`}>
              Вход
            </Link>
            <Link href="/auth/signup" className="bg-brandeis-blue text-white py-1 px-3 rounded-xl">
              Регистрация
            </Link>
          </ul>
        )}
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-3 bg-marian-blue shadow-lg z-50">
        <button onClick={toggleMobileNav} className="p-1">
        <Menu size={24} stroke="white"/>
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
            <ProfileAvatar profilePic={profile?.profilePic || null} username={profile?.username || "User"} />

            {state.profile && (
              <div className="absolute bg-white shadow-lg rounded-lg p-2 w-60 h-72 z-10 right-0 top-full mt-2 flex flex-col">
                <Link
                  href="/profile"
                  className="px-3 py-2 rounded-md text-sm hover:bg-platinum-gray transition-colors"
                >
                  Моят профил
                </Link>
                {/* Dark/Light Theme - Mobile */}
                <div
                  onClick={toggleDarkMode}
                  className="px-3 py-2 rounded-md text-sm hover:bg-platinum-gray transition-colors cursor-pointer"
                >
                  {isDarkMode ? "Светла тема" : "Тъмна тема"}
                </div>
                <Link
                  href="/settings"
                  className="px-3 py-2 rounded-md text-sm hover:bg-platinum-gray transition-colors"
                >
                  Настройки
                </Link>
                <input
                  type="button"
                  onClick={signOut}
                  value="Излизане"
                  className="px-3 py-2 rounded-md text-sm hover:bg-platinum-gray transition-colors"
                />
              </div>
            )}
          </button>
        ) : (
          <Link href="/auth/signin" className="text-white text-sm">
            Вход
          </Link>
        )}

        {/* Mobile Menu */}
        <div
          className={`h-full py-10 px-4 bg-marian-blue fixed top-14 left-0 w-full flex flex-col items-center justify-between overflow-hidden transition-all duration-300 ${
            mobileNav ? "max-h-full opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
          }`}
        >
          {/* Primary list */}
          <ul className="w-full select-none bg-white rounded-lg shadow-md mb-2 text-base">
            <li className="py-2 text-center border-b border-gray-200 hover:bg-gray-100 transition-colors" onClick={toggleMobileNav}>
              <Link href="/assistant">Асистент</Link>
            </li>
            <li className="py-2 text-center border-b border-gray-200 hover:bg-gray-100 transition-colors" onClick={toggleMobileNav}>
              <Link href="/forum">Форум</Link>
            </li>
            <li className="py-2 text-center hover:bg-gray-100 transition-colors" onClick={openPost}>
              Създай публикация
            </li>
          </ul>

          {/* Secondary list */}
          <ul className="w-full flex flex-col items-start text-sm text-gray-600 cursor-pointer ">
            <li className="py-1 text-center" onClick={toggleMobileNav}>
              <Link href="/info#about-us">За сайта</Link>
            </li>
            <li className="py-1 text-center" onClick={toggleMobileNav}>
              <Link href="/info#features">Инструкции</Link>
            </li>
            <li className="py-1 text-center" onClick={toggleMobileNav}>
              <Link href="/info#faq">ЧЗВ</Link>
            </li>
            <li className="py-1 text-center" onClick={toggleMobileNav}>
              <Link href="/resources#privacy-policy">Политика за поверителност</Link>
            </li>
            <li className="py-1 text-center" onClick={toggleMobileNav}>
              <Link href="/resources#terms-of-use">Условия на ползване</Link>
            </li>
          </ul>
        </div>
      </nav>
      <CreatePost />
    </>
  );
};

export default Navbar;
