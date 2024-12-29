"use client";
import { useState } from 'react';

import Image from "next/image";
import Notification from '@/app/notification.svg';
import UserCircle from '@/app/user-circle.svg';
import ChevronDown from '@/app/chevron-down.svg';
import ArrowUp from '@/app/arrow-up.svg';
import Plus from '@/app/plus.svg';

import '@/app/style.css';

function NavBar() {
  return (
<nav className="flex h-[10vh] w-full flex items-center justify-between p-[3%] select-none">
  <h1 className="text-5xl font-bold cursor-pointer">Qurela</h1>
  <ul className="flex justify-around items-stretch basis-[40%] text-center cursor-pointer">
  <li className="flex hover:bg-blue-900 transition-all flex-[2] items-center justify-center group">
  <span>
    Асистент
  </span>
  <Image src={ChevronDown} alt=' ' className="h-6 w-auto" />
  <ul className="hidden group-hover:block absolute top-[9vh] bg-white shadow-lg rounded-md w-inherit z-10">
    <li className="p-2">Проверка</li>
    <li className="p-2">Въпрос</li>
    <li className="p-2">Обобщаване</li>
  </ul>
  </li>


    <li className="flex hover:bg-blue-900 transition-all flex-[2] items-center justify-center">
      <span>
       Форум
      </span>
    </li>

    <li className="flex hover:bg-blue-900 transition-all flex-1 items-center justify-center">
      <Image src={Plus} alt='Създай публикация' className="h-9 w-auto" />
    </li>
    <li className="relative flex hover:bg-blue-900 transition-all flex-1 items-center justify-center">
      <div className="absolute top-[15%] right-[30%] w-2 h-2 bg-red-700 rounded-full"></div>
      <Image src={Notification} alt='Известия' className="w-[30px] h-auto" />
    </li>
    <li className="flex hover:bg-blue-900 transition-all m-[5%]; flex-1 items-center justify-center">
      <Image src={UserCircle} alt='Акаунт' className="h-12 w-auto" />
    </li>
  </ul>
</nav>

  );
}

function Main() {
  const [inputValue, setInputValue] = useState('Проверка');
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <main className="flex items-center flex-col">
      <div className="flex justify-center items-center flex-col w-full pt-[8%] pb-[2%]">
        <h2 className="text-4xl font-bold text-center">{inputValue}</h2>
        <form className="flex justify-center w-[100%] h-[50px] ">
        <select 
          name="cars"
          id="cars"
          onChange={handleSelectChange}
        >
          <option data-type="check" value="Въведете информация за проверка">Проверка</option>
          <option data-type="question" value="Задайте въпрос">Въпрос</option>
          <option data-type="summarize" value="Обобщи информация">Обобщение</option>
        </select>
          <input className="bg-yellow-500"></input>
          <button>
            <Image src={ArrowUp} alt=' '/>
          </button>
        </form>
      </div>

      <div className="w-[100%] h-80 flex justify-between px-40">
        <div className="bg-red-700 rounded-2xl basis-[550px] overflow-hidden">
          <h3 className="w-[100%] bg-green-600 p-[10px]">Последни чатове</h3>
          <ul>
            <li>asldfjksjkdf?</li>
            <li>sdfgdfg</li>
            <li>sdgfdgfj\ssfrws</li>
          </ul>
        </div>

        <div className="bg-red-700 rounded-2xl basis-[450px] overflow-hidden">
          <h3 className="w-[100%] bg-green-600 p-[10px]">Избор на редактора</h3>
          <span>
            content
          </span>
        </div>
      </div>


    </main>
  )
}

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-alice-blue to-uranian-blue">
      <NavBar />
      <Main />
    </div>
  );
}
