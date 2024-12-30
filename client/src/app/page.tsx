'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import Notification from '@/app/notification.svg';
import UserCircle from '@/app/user-circle.svg';
import ChevronDown from '@/app/chevron-down.svg';
import ArrowUp from '@/app/arrow-up.svg';
import Plus from '@/app/plus.svg';

import '@/app/style.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationsOpened, setisNotificationsOpened] = useState(false)

  const handleNotifications = () => {
    setisNotificationsOpened((prev) => !prev);
    console.log(isNotificationsOpened);
  };

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

  return (
<nav
  className={`fixed top-0 w-full flex h-[7vh] items-center justify-between select-none transition-all ${isScrolled ? 'bg-marian-blue p-[2%]' : 'p-[3%]'}
  `}
>
  <h1
    className={`
      text-5xl font-bold cursor-pointer
      ${isScrolled ? 'text-white' : ''}
    `}
  >
    Qurela
  </h1>

  <ul className={`flex justify-between items-stretch basis-[35%] text-center cursor-pointer transition-all ${isScrolled ? ' basis-[30%]' : ''}`}>
  
    <li
      className={`flex transition-all items-center justify-end group p-2 rounded-full relative ${
        isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
      }`}
    >
      <span className={`z-1 ${isScrolled ? 'text-white' : ''}`}>Асистент</span>
      <Image
        src={ChevronDown}
        alt=" "
        className={`h-6 w-auto ${isScrolled ? 'white-svg' : ''}`}
      />
      <ul className='hidden group-hover:block absolute bg-alice-blue shadow-lg rounded-2xl p-1 w-inherit z-[-1] top-[100%] right-0 overflow-hidden'>
        <li className={`px-6 py-2 rounded-2xl ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>Проверка</li>
        <li className={`px-6 py-2 rounded-2xl ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>Въпрос</li>
        <li className={`px-6 py-2 rounded-2xl ${isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'}`}>Обобщаване</li>
      </ul>
    </li>
    
    <li
      className={`flex transition-all items-center justify-center rounded-full ${
        isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
      }`}
    >
      <span className={`${isScrolled ? 'text-white' : ''}`}>Форум</span>
    </li>

    <li
      className={`flex transition-all items-center justify-center rounded-full ${
        isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
      }`}
    >
      <span className={`${isScrolled ? 'text-white' : ''}`}>
        <Image
          src={Plus}
          alt="Създай публикация"
          title='Създай публикация'
          className={`h-9 w-auto ${isScrolled ? 'white-svg' : ''}`}
        />
      </span>
    </li>

    <button
      className={`relative flex items-center justify-center rounded-full 
        ${
          isScrolled
            ? isNotificationsOpened
              ? 'hover:bg-brown focus:bg-brown'
              : 'hover:bg-transparent focus:bg-transparent'
            : isNotificationsOpened
            ? 'hover:bg-black-50 focus:bg-black-50'
            : 'hover:bg-transparent focus:bg-transparent'
        }
      `}
      
    >
      <span className={`${isScrolled ? 'text-white' : ''}`}>
        <div className="absolute top-[7%] right-[15%] w-2 h-2 bg-red-700 rounded-full"></div>
        <Image
          onClick={handleNotifications}
          src={Notification}
          alt="Известия"
          title='Известия'
          className={`h-9 w-auto ${isScrolled ? 'white-svg' : ''}`}
        />
        
        {isNotificationsOpened && (
          <ul className="absolute bg-alice-blue shadow-lg rounded-2xl p-1 w-inherit z-[-1] top-[100%] right-0 overflow-hidden">
            <li
              className={`px-6 py-2 rounded-2xl ${
                isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
              }`}
            >
              Проверка
            </li>
            <li
              className={`px-6 py-2 rounded-2xl ${
                isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
              }`}
            >
              Въпрос
            </li>
            <li
              className={`px-6 py-2 rounded-2xl ${
                isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
              }`}
            >
              Обобщаване
            </li>
          </ul>
        )}


      </span>
    </button>

    <li
      className={`flex transition-all items-center justify-end rounded-full ${
        isScrolled ? 'hover:bg-brown' : 'hover:bg-black-50'
      }`}
    >
      <span className={`${isScrolled ? 'text-white' : ''}`}>
        <Image
          src={UserCircle}
          alt="Профил"
          title='Профил'
          className={`h-9 w-auto ${isScrolled ? 'white-svg' : ''}`}
        />
      </span>
    </li>
  
  </ul>
</nav>

  );
};


function Main() {
  const [inputValue, setInputValue] = useState('Проверка на информация');
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <main className="flex flex-col items-center min-h-[100vh] pt-10 gap-3 justify-center">
      <h2 className='text-3xl font-bold text-center'>{inputValue}</h2>
      <div className='flex justify-center items-center flex-col w-full'>
        <form className='bg-white flex justify-center items-center w-[55%] h-[55px] m-[1vh] p-[7px] rounded-full'>
          <select
            className='h-[100%] bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center' 
            onChange={handleSelectChange}
          >
            <option data-type='check' value='Проверка на информация'>Проверка</option>
            <option data-type='question' value='Задайте въпрос'>Въпрос</option>
            <option data-type='summarize' value='Обобщи информация'>Обобщение</option>
          </select>
            <input className='outline-none w-full h-full px-1 text-lg'></input>
            <button className='h-[100%] aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer'  title='Изпращане'>
              <Image src={ArrowUp} alt=' '/>
            </button>
        </form>
      </div>

      <div className='w-[65%] h-60 flex justify-between gap-x-14'>
        <div className='bg-platinum-gray rounded-2xl flex-[4] overflow-hidden'>
          <h3 className='w-[100%] bg-jordy-blue p-3 font-semibold text-base'>Последни чатове</h3>
          <ul className='p-3 text-base'>
            <li>Какви са симптомите на диабет тип 2 и как се диагностицира?</li>
            <li>Каква е разликата между вирусна и бактериална инфекция?</li>
            <li>Какви са основните рискови фактори за сърдечно-съдови заболявания?</li>
            {/* <li>Какво е значение на имунната система и какво може да я отслаби?</li> */}
            {/* <li>Какво представлява хипертонията и какви са методите за контролиране на високото кръвно налягане?</li> */}
          </ul>

        </div>

        <div className='flex flex-col bg-platinum-gray rounded-2xl flex-[3] overflow-hidden'>
          <h3 className='w-[100%] bg-brandeis-blue p-3 text-white font-semibold text-base'>Избор на редактора</h3>
          <span className='w-full h-[100%] flex justify-center items-center'>
            <p className='text-2xl font-bold text-gray-500'>
            Празно
            </p>
          </span>
        </div>
      </div>
    </main>
  )
}

function Footer() {
  return (
    <footer className='bg-rich-black mt-5 border-t-[5px] border-marian-blue'>
        <div className='flex items-top py-[3%] px-[5%]'>
          <div className='flex-1'>
            <h2 className='text-2xl font-semibold'>Qurela</h2>
            <p className='w-[70%]'>
            Unik е уеб приложение, което има за цел борба с дезинформацията в медицинската сфера
            </p>
          </div>

          <div className='flex-1'>
            <h2 className='uppercase font-semibold text-lg'>информация</h2>
            <ul>
              <li>Начало</li>
              <li>За нас</li>
              <li>Функционалности</li>
              <li>Общностен форум</li>
              <li>Регистрация / Вход</li>
            </ul>
          </div>

          <div className='flex-1'>
            <h2 className='uppercase font-semibold text-lg'>ресурси</h2>
            <ul>
              <li>Често задавани въпроси</li>
              <li>Политика за поверителност</li>
              <li>Условия на ползване</li>
            </ul>
          </div>

          <div className='flex-1'>
            <h2 className='uppercase font-semibold text-lg'>свържи се с нас</h2>
            <ul>
              <li>Facebook</li>
              <li>qurela@info.com</li>
            </ul>
          </div>
        </div>

        <div className='w-full text-center'>
        &copy; 2025 Qurela. Всички права запазени
        </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className='bg-gradient-to-b from-alice-blue to-uranian-blue min-h-[100vh]'>
    {/* bg-gradient-to-b from-alice-blue to-uranian-blue min-h-[100vh] */}

      <Navbar />
      <Main />
      <Footer />
    </div>
  );
}
