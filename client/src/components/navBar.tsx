"use client";

import { useReducer, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, dispatch] = useReducer(toggleReducer, initialState);
  const [toggleNavContentOpened, setToggleNavContentOpened] = useState(false);
  const [isLogged, setIsLogged] = useState(false); // Проверка дали потребителя е логнат
  const router = useRouter();

  useEffect(() => {
    // Проверка за токен (в Cookies или localStorage)
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

  // Функция за превключване на dropdown-а (известия, профил и т.н.)
  const toggleNavBtns = (
    e: React.MouseEvent,
    key: "notification" | "profile" | "messages" | "settings"
  ) => {
    dispatch({ type: "TOGGLE", payload: key });
  };

  const signOut = async () => {
    try {
      const token = Cookies.get("token"); // Взимаме токена от cookies

      if (!token) {
        console.warn("No token found, redirecting to login...");
        window.location.href = "/auth/signin";
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/signout/",
        {}, // Празен обект
        {
          withCredentials: true, // Изпращаме cookies
          headers: {
            Authorization: `Bearer ${token}`, // Прикачваме токена
          },
        }
      );

      console.log(response.data.message); // Debug

      // Премахваме токена
      localStorage.removeItem("token");
      Cookies.remove("token");

      // Пренасочване към login
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
          isScrolled ? "bg-marian-blue p-[25px]" : "p-[45px]"
        }`}
      >
        <h1 className={`text-4xl font-bold cursor-pointer ${isScrolled ? "text-white" : ""}`}>
          <Link href="/dashboard">Qurela</Link>
        </h1>

        {isLogged ? (
          // Навигация за логнат потребител
          <ul
            className={`flex justify-between items-center text-center cursor-pointer transition-all ${
              isScrolled ? "basis-[300px]" : "basis-[350px]"
            }`}
          >
            {/* Assistant Dropdown */}
            <Link
              href="/assistant"
              className={`flex transition-all items-center justify-end group p-[1vh] text-sm rounded-full relative ${
                isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
              }`}
            >
              <span className={`z-1 ${isScrolled ? "text-white" : ""}`}>
                <>Асистент</>
              </span>

              <Image
                src={ChevronDown}
                alt=" "
                className={`h-4 w-auto ${isScrolled ? "white-svg" : ""}`}
              />
              <ul className="hidden group-hover:block absolute bg-white shadow-lg rounded-2xl p-1 w-inherit z-15 top-[100%] right-0 overflow-hidden">
                <li
                  className={`px-3 py-2 text-sm rounded-2xl ${
                    isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                  }`}
                >
                  Проверка
                </li>
                <li
                  className={`px-3 py-2 text-sm rounded-2xl ${
                    isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                  }`}
                >
                  Въпрос
                </li>
                <li
                  className={`px-3 py-2 text-sm rounded-2xl ${
                    isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                  }`}
                >
                  Обобщаване
                </li>
              </ul>
            </Link>

            {/* Forum Button */}
            <li
              className={`flex transition-all items-center justify-center rounded-full p-[1vh] text-sm ${
                isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
              }`}
            >
              <span className={`${isScrolled ? "text-white" : ""}`}>
                <Link href="/forum">Форум</Link>
              </span>
            </li>

            {/* Create Post Button */}
            <li
              className={`flex transition-all items-center justify-center rounded-full p-[1.5px] ${
                isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
              }`}
            >
              <span className={`${isScrolled ? "text-white" : ""}`}>
                <Image
                  src={Plus}
                  alt="Създай публикация"
                  title="Създай публикация"
                  className={`h-6 w-auto ${isScrolled ? "white-svg" : ""}`}
                />
              </span>
            </li>

            {/* Notification Button */}
            <button
              id="notification"
              onClick={(e) => toggleNavBtns(e, "notification")}
              className={`relative flex items-center justify-center rounded-full aspect-square ${
                isScrolled
                  ? state.notification
                    ? ""
                    : "hover:bg-transparent focus:bg-transparent"
                  : state.notification
                  ? "hover:bg-black-50 focus:bg-black-50"
                  : "hover:bg-transparent focus:bg-transparent"
              } ${isScrolled ? "text-white" : ""}`}
            >
              <div className="absolute top-[7%] right-[15%] w-2 h-2 bg-red-700 rounded-full z-[100]"></div>
              <Image
                src={state.notification ? NotificationClicked : Notification}
                alt="Известия"
                title="Известия"
                className={`h-7 w-auto ${isScrolled ? "white-svg" : ""}`}
              />

              {state.notification && (
                <div
                  className={`absolute bg-white shadow-lg rounded-2xl p-1 w-[340px] h-[400px] z-10 right-0 ${
                    isScrolled ? "top-[140%]" : "top-[100%]"
                  }`}
                >
                  <li
                    className={`px-6 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                    }`}
                  >
                    Нов последовател
                  </li>
                  <li
                    className={`px-6 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                    }`}
                  >
                    +1 лайк
                  </li>
                </div>
              )}
            </button>

            {/* Profile Button */}
            <button
              id="profile"
              onClick={(e) => toggleNavBtns(e, "profile")}
              className={`relative flex items-center justify-center rounded-full aspect-square ${
                isScrolled
                  ? state.profile
                    ? ""
                    : "hover:bg-transparent focus:bg-transparent"
                  : state.profile
                  ? "hover:bg-black-50 focus:bg-black-50"
                  : "hover:bg-transparent focus:bg-transparent"
              } ${isScrolled ? "text-white" : ""}`}
            >
              <Image
                src={state.profile ? UserCircleClicked : UserCircle}
                alt="Профил"
                title="Профил"
                className={`h-9 w-auto ${isScrolled ? "white-svg" : ""}`}
              />

              {state.profile && (
                <div
                  className={`absolute bg-white shadow-lg rounded-2xl p-1 w-[240px] h-[300px] z-10 right-0 flex flex-col ${
                    isScrolled ? "top-[120%]" : "top-[100%]"
                  }`}
                >
                  <Link href='/profile'
                    className={`px-3 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                    }`}
                  >
                    Моят профил
                  </Link>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                    }`}
                  >
                    Тъмна/Светла режим
                  </div>
                  <Link href='/settings'
                    className={`px-3 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                    }`}
                  >
                    Настройки
                  </Link>
                  <input type='button' onClick={signOut}
                          value="Излизане"
                    className={`px-3 py-2 rounded-2xl text-sm ${
                      isScrolled ? "hover:bg-brown" : "hover:bg-black-50"
                    }`}
                  >
                  </input>
                </div>
              )}
            </button>
          </ul>
        ) : (
          // Навигация за гост потребител
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
      <nav className="md:hidden flex fixed top-0 w-full items-center justify-between p-3 bg-marian-blue z-[9999]">
        <button onClick={toggleNavContent}>
          <Image src={Menu} alt="Меню" className="h-7 w-auto" />
        </button>
        <h1 className="text-4xl font-bold cursor-pointer text-white">
          <Link href="/dashboard">Qurela</Link>
        </h1>
        {isLogged ? (
          <button onClick={signOut} className="text-white">
            Изход
          </button>
        ) : (
          <Link href="/auth/signin" className="text-white">
            Вход
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;