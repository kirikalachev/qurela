'use client';
import { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import Notification from '@/app/notification.svg';
import NotificationClicked from '@/app/notification-clicked.svg';
import UserCircle from '@/app/user-circle.svg';
import UserCircleClicked from '@/app/user-circle-clicked.svg';
import ChevronDown from '@/app/chevron-down.svg';
import ArrowUp from '@/app/arrow-up.svg';
import Plus from '@/app/plus.svg';

import '@/app/style.css';

interface ToggleState {
  notification: boolean;
  profile: boolean;
}

interface ToggleAction {
  type: 'TOGGLE' | 'CLOSE';
  payload?: 'notification' | 'profile'; 
}

const initialState: ToggleState = {
  notification: false,
  profile: false,
};

const toggleReducer = (state: ToggleState, action: ToggleAction): ToggleState => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        [action.payload!]: !state[action.payload!],
        ...(action.payload === 'notification' ? { profile: false } : { notification: false }),
      };
    case 'CLOSE':
      return { notification: false, profile: false }; // Close all dropdowns
    default:
      return state;
  }
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, dispatch] = useReducer(toggleReducer, initialState);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationElement = document.getElementById('notification');
      const profileElement = document.getElementById('profile');
      // Close both dropdowns if click is outside of them
      if (
        notificationElement && !notificationElement.contains(event.target as Node) &&
        profileElement && !profileElement.contains(event.target as Node)
      ) {
        dispatch({ type: 'CLOSE' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle notification or profile dropdown
  const toggleNavBtns = (e: React.MouseEvent, key: 'notification' | 'profile') => {
    dispatch({ type: 'TOGGLE', payload: key });
  };

  return (
    <nav
      className={`fixed top-0 w-full flex h-[7vh] items-center justify-between select-none transition-all ${
        isScrolled ? 'bg-marian-blue p-[2%]' : 'p-[3%]'
      }`}
    >
      <h1 className={`text-4xl font-bold cursor-pointer ${isScrolled ? 'text-white' : ''}`}>
        <Link href='/'>Qurela</Link>
      </h1>

      <ul
        className={`flex justify-between items-center text-center cursor-pointer transition-all ${
          isScrolled ? 'basis-[30%]' : 'basis-[37%]'
        }`}
      >
        {/* Assistant Dropdown */}
        <li
          className={`flex transition-all items-center justify-end group p-1 rounded-full relative ${
            isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
          }`}
        >
          <span className={`z-1 ${isScrolled ? 'text-white' : ''}`}>
            <Link href='/assistant'>Асистент</Link>
          </span>

          <Image
            src={ChevronDown}
            alt=" "
            className={`h-4 w-auto ${isScrolled ? 'white-svg' : ''}`}
          />
          <ul className="hidden group-hover:block absolute bg-white shadow-lg rounded-2xl p-1 w-inherit z-15 top-[100%] right-0 overflow-hidden">
            <li className={`px-3 py-2 text-sm rounded-2xl ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
              Проверка
            </li>
            <li className={`px-3 py-2 text-sm rounded-2xl ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
              Въпрос
            </li>
            <li className={`px-3 py-2 text-sm rounded-2xl ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
              Обобщаване
            </li>
          </ul>
        </li>

        {/* Forum Button */}
        <li
          className={`flex transition-all items-center justify-center rounded-full p-1 ${
            isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
          }`}
        >
          <span className={`${isScrolled ? 'text-white' : ''}`}>
            <Link href='/forum'>Форум</Link>
            </span>
        </li>

        {/* Create Post Button */}
        <li
          className={`flex transition-all items-center justify-center rounded-full p-1 ${
            isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
          }`}
        >
          <span className={`${isScrolled ? 'text-white' : ''}`}>
            <Image
              src={Plus}
              alt="Създай публикация"
              title="Създай публикация"
              className={`h-7 w-auto ${isScrolled ? 'white-svg' : ''}`}
            />
          </span>
        </li>

        {/* Notification Button */}
        <button
          id="notification"
          onClick={(e) => toggleNavBtns(e, 'notification')}
          className={`relative flex items-center justify-center rounded-full aspect-square ${
            isScrolled
              ? state.notification
                ? ''
                : 'hover:bg-transparent focus:bg-transparent'
              : state.notification
              ? 'hover:bg-black-50 focus:bg-black-50'
              : 'hover:bg-transparent focus:bg-transparent'
          } ${isScrolled ? 'text-white' : ''}`}
        >
          <div className="absolute top-[7%] right-[15%] w-2 h-2 bg-red-700 rounded-full"></div>
          <Image
            src={state.notification ? NotificationClicked : Notification}
            alt="Известия"
            title="Известия"
            className={`h-7 w-auto ${isScrolled ? 'white-svg' : ''}`}
          />

          {state.notification && (
            <ul className={`absolute bg-white shadow-lg rounded-2xl p-1 w-[25vw] h-[65vh] z-10 right-0 ${ isScrolled? 'top-[140%]' : 'top-[100%]'}`}>
              <li className={`px-6 py-2 rounded-2xl text-sm ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
                Нов последовател
              </li>
              <li className={`px-6 py-2 rounded-2xl text-sm ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
                +1 лайк
              </li>
            </ul>
          )}
        </button>

        {/* Profile Button */}
        <button
          id="profile"
          onClick={(e) => toggleNavBtns(e, 'profile')}
          className={`relative flex items-center justify-center rounded-full aspect-square ${
            isScrolled
              ? state.notification
                ? ''
                : 'hover:bg-transparent focus:bg-transparent'
              : state.notification
              ? 'hover:bg-black-50 focus:bg-black-50'
              : 'hover:bg-transparent focus:bg-transparent'
          } ${isScrolled ? 'text-white' : ''}`}

        >
          <Image
            src={state.profile ? UserCircleClicked : UserCircle}
            alt="Профил"
            title="Профил"
            className={`h-9 w-auto ${isScrolled ? 'white-svg' : ''}`}
          />

          {state.profile && (
            <ul className={`absolute bg-white shadow-lg rounded-2xl p-1 w-[25vw] h-[65vh] z-10 right-0 ${ isScrolled? 'top-[120%]' : 'top-[100%]'}`}>
              <li className={`px-3 py-2 rounded-2xl text-sm ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
                Моят профил
              </li>
              <li className={`px-3 py-2 rounded-2xl text-sm ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
                Тъмна/Светла режим
              </li>
              <li className={`px-3 py-2 rounded-2xl text-sm ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
                Настройки
              </li>
              <li className={`px-3 py-2 rounded-2xl text-sm ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>
                Излизане
              </li>
            </ul>
          )}
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;