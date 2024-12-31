'use client';
import { useState } from 'react';
import Image from 'next/image';
import ArrowUp from '@/app/arrow-up.svg';

import '@/app/style.css';

export default function Home() {
  const [inputValue, setInputValue] = useState('Проверка на информация');
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };

  const redirectToAssistant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    window.location.href = '/assistant'; // Redirect manually using window.location
  };

  return (
    <main className="flex flex-col items-center min-h-[100vh] pt-12 gap-3 justify-center">
      <h2 className="text-3xl font-bold text-center">{inputValue}</h2>
      <div className="flex justify-center items-center flex-col w-full">
        <form
          className="bg-white flex justify-center items-center w-[55%] h-[55px] m-[1vh] p-[7px] rounded-full"
          onSubmit={redirectToAssistant}
        >
          <select
            className="h-[100%] bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
            onChange={handleSelectChange}
          >
            <option data-type="check" value="Проверка на информация">Проверка</option>
            <option data-type="question" value="Задайте въпрос">Въпрос</option>
            <option data-type="summarize" value="Обобщи информация">Обобщение</option>
          </select>
          <input
            className="outline-none w-full h-full px-1 text-basis"
            placeholder="Съобщение до Qurela"
            autoFocus
          />
          <button
            className="h-[100%] aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer"
            title="Изпращане"
          >
            <Image src={ArrowUp} alt=" " />
          </button>
        </form>
      </div>

      <div className="w-[65%] h-60 flex justify-between gap-x-14">
        <div className="bg-platinum-gray rounded-2xl flex-[4] overflow-hidden">
          <h3 className="w-[100%] bg-jordy-blue p-3 font-semibold text-base">Последни чатове</h3>
          <ul className="p-3 text-sm">
            <li>Какви са симптомите на диабет тип 2 и как се диагностицира?</li>
            <li>Каква е разликата между вирусна и бактериална инфекция?</li>
            <li>Какви са основните рискови фактори за сърдечно-съдови заболявания?</li>
            <li>Какво е значение на имунната система и какво може да я отслаби?</li>
          </ul>
        </div>

        <div className="flex flex-col bg-platinum-gray rounded-2xl flex-[3] overflow-hidden">
          <h3 className="w-[100%] bg-brandeis-blue p-3 text-white font-semibold text-base">Избор на редактора</h3>
          <span className="w-full h-[100%] flex justify-center items-center">
            <p className="text-base font-bold text-gray-500">Празно</p>
          </span>
        </div>
      </div>
    </main>
  );
}
