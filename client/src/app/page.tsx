'use client';
import { useState } from 'react';
import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';

import '@/app/style.css';

export default function Home() {
  const [inputValue, setInputValue] = useState('Проверка на информация');
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };

  const redirectToAssistant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    window.location.href = '/assistant'; 
  };

  return (
    <main className="flex flex-col items-center min-h-[100vh] pt-[40%] md:pt-[15%] gap-3 justify-center">
      <h2 className="text-2xl md:text-3xl font-bold">{inputValue}</h2>
      <div className="flex justify-center items-center flex-col w-full">
        <form
          className="bg-white flex justify-between md:justify-center items-center w-[90%] h-fit md:w-[55%] md:h-[55px] m-[1vh] p-[7px] rounded-2xl md:rounded-full md:flex-nowrap flex-wrap"
          onSubmit={redirectToAssistant}
        >
          <textarea
          className='flex-[100%] md:hidden outline-none w-full h-[120px] px-1 text-basis whitespace-nowrap overflow-hidden '
          >

          </textarea>
          <select
            className="p-2 md:h-[100%] bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
            onChange={handleSelectChange}
          >
            <option data-type="check" value="Проверка на информация">Проверка</option>
            <option data-type="question" value="Задайте въпрос">Въпрос</option>
            <option data-type="summarize" value="Обобщи информация">Обобщение</option>
          </select>
          <input
            className="outline-none w-full max-h-6 px-1 text-basis hidden md:block"
            placeholder="Съобщение до Qurela"
            autoFocus
          />
          <button
            className="p-2 md:h-[100%] aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer"
            title="Изпращане"
          >
            <Image src={ArrowRight} alt=" " />
          </button>
        </form>
      </div>

      <div className="w-[90%] h-[60vh] flex justify-between gap-y-7 gap-x-14 flex-col md:flex-row md:w-[65%] md:h-60 ">
        <div className="bg-platinum-gray rounded-2xl flex-[4] overflow-hidden flex-1">
          <h3 className="w-[100%] bg-jordy-blue p-3 font-semibold text-base">Последни чатове</h3>
          <ul className="p-3 text-sm">
            <li>Какви са симптомите на диабет тип 2 и как се диагностицира?</li>
            <li>Каква е разликата между вирусна и бактериална инфекция?</li>
            <li>Какви са основните рискови фактори за сърдечно-съдови заболявания?</li>
            <li>Какво е значение на имунната система и какво може да я отслаби?</li>
          </ul>
        </div>

        <div className="flex flex-col bg-platinum-gray rounded-2xl flex-[3] overflow-hidden flex-1">
          <h3 className="w-[100%] bg-brandeis-blue p-3 text-white font-semibold text-base">Избор на редактора</h3>
          <span className="w-full h-[100%] flex justify-center items-center">
            <p className="text-base font-bold text-gray-500">Празно</p>
          </span>
        </div>
      </div>
      {/* forum */}
      <h2 className="text-2xl md:text-3xl font-bold self-start mx-[5%] md:self-center md:mx-[0] mt-[5%]">
        Трендинг
      </h2>
      <div className="bg-white flex justify-between md:justify-center items-center w-[90%] md:w-[65%] m-[1vh] rounded-2xl md:flex-nowrap flex-wrap">
        <div className='w-full bg-Anti-flash-white rounded-xl p-2'>
          <div className='w-full flex justify-between'>
            <div className='flex align-center'>
              <div>
                <img
                  src="https://picsum.photos/200"  // Direct URL of the image
                  alt="Random Image"
                  className='h-10 aspect-square rounded-full'
                />
              </div>
              <div>
                <h3>
                  Ivan Ivanov
                </h3>
                <p>
                  3years ago
                </p>
              </div>
            </div>

            <div>menu</div>
          </div>

          <div>
            <h3>Lorem ipsum lorem</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, quaerat perferendis. Nobis, neque harum. Blanditiis, velit sequi! Ullam velit odio laborum, cupiditate quae, asperiores, excepturi necessitatibus voluptatum quis aspernatur eum.
            </p>
          </div>

          <div className='flex justify-between items-center p-2'>
            <div className='flex justify-between gap-x-2'>
              <div>Like</div>
              <div>Comment</div>
              <div>Share</div>
            </div>
            <div>Topic</div>
          </div>
        </div>
      </div>
    </main>
  );
}
