'use client';

import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';
import Trash from '@/app/trash.svg';
import Download from '@/app/download.svg';
import Copy from '@/app/copy.svg';
import Options from '@/app/three-dots.svg';

import CopyText from "@/app/assistant/CopyText";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const ChatComponent = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null); // Track the active dropdown index
    const dropdownRef = useRef<HTMLUListElement | null>(null);

    const chatItems = [
      "Какви са симптомите на диабет тип 2 и как се диагностицира?",
      "Каква е разликата между вирусна и бактериална инфекция?",
      "Какви са основните рискови фактори за сърдечно-съдови заболявания?",
      "Какво е значение на имунната система и какво може да я отслаби?",
    ];

    // Function to handle dropdown toggle
    const handleEditClick = (index: number) => {
      setActiveIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the dropdown
    };

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setActiveIndex(null); // Close the dropdown
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <main className="flex items-center pt-12 min-h-[100vh] items-center">
        <div className="flex w-[80%] h-[80vh] m-auto gap-7 items-stretched flex-wrap">
          {/* Left Section */}
          <div className="flex-[3] flex gap-6 flex-col justify-stretched">
            {/* Text Input Form */}
            <form className="flex flex-col h-10 rounded-xl flex-[4] bg-white">
              <textarea
                placeholder="Съобщение до Qurela"
                autoFocus
                className="flex-[8] m-4 outline-none"
              ></textarea>
              <div className="flex-[2] flex justify-between m-2">
                <select
                  className="bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
                >
                  <option data-type="check" value="Проверка на информация">
                    Проверка
                  </option>
                  <option data-type="question" value="Задайте въпрос">
                    Въпрос
                  </option>
                  <option data-type="summarize" value="Обобщи информация">
                    Обобщение
                  </option>
                </select>
                <button
                  className="aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer"
                  title="Изпращане"
                >
                  <Image src={ArrowRight} alt=" " />
                </button>
              </div>
            </form>

            {/* Response Display */}
            <div className="relative bg-white rounded-xl flex-[5] overflow-hidden flex flex-col">
              <h3 className="flex-[2] border-l-green-500 border-l-[7px] flex items-center">
                <span className="mx-2 text-base font-semibold">
                  Всички ще умрем
                </span>
              </h3>
              <button
                onClick={CopyText}
                className="absolute top-2 right-2 rounded-xl transition-all active:bg-gray-300 flex items-center justify-center w-8 h-8"
                title="Копиране"
              >
                <Image src={Copy} alt="" />
              </button>
              <p className="flex-[9] h-max border-l-gray-300 border-l-[7px] flex">
                <span className="mx-2 my-5 text-sm overflow-y-auto h-[150px] copy-text">
              bye bye                    
              </span>
              </p>

              <div className="flex-[2] w-full h-[10%] bg-gray-300 flex gap-4 px-4 justify-end">
                <div className="flex items-center cursor-pointer">
                  <Image src={Download} alt="" />
                  <span>Изтегляне</span>
                </div>

                <div className="flex items-center cursor-pointer">
                  <Image src={Trash} alt="" />
                  <span>Изтриване</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-[2] bg-platinum-gray rounded-2xl">
            <h3 className="w-[100%] bg-jordy-blue px-3 py-2 font-semibold text-base rounded-tl-2xl rounded-tr-2xl">
              Последни чатове
            </h3>
            <ul className="text-sm m-0 flex flex-col cursor-pointer">
              {chatItems.map((item, index) => (
                <li
                  key={index}
                  className="relative p-2 border-b-gray-300 border-b-[2px] hover:bg-gray-300 m-0 basis-[55px] flex items-center"
                >
                  <span>{item}</span>
                  <span className="h-full w-[20%] bg-gradient-to-r from-transparent via-platinum-gray to-platinum-gray hover:from-transparent hover:via-gray-300 hover:to-gray-300 absolute top-0 right-0"></span>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="h-full aspect-square absolute top-0 right-0 flex justify-center items-center"
                  >
                    <Image src={Options} alt="" />
                  </button>
                  {activeIndex === index && (
                    <ul
                      ref={dropdownRef}
                      className="bg-Anti-flash-white w-[150px] h-fit p-2 absolute top-[70%] left-[45%] md:left-[90%] z-[170] rounded-xl"
                    >
                      <li className="p-2 hover:bg-platinum-gray rounded-xl">
                        Изтегляне
                      </li>
                      <li className="p-2 hover:bg-platinum-gray rounded-xl">
                        Преименуване
                      </li>
                      <li className="p-2 hover:bg-platinum-gray rounded-xl">
                        Изтриване
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    );
  };

  return <ChatComponent />;
}
