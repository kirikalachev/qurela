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
    const chatItems = [
      "Какви са симптомите на диабет тип 2 и как се диагностицира?",
      "Каква е разликата между вирусна и бактериална инфекция?",
      "Какви са основните рискови фактори за сърдечно-съдови заболявания?",
      "Какво е значение на имунната система и какво може да я отслаби?",
    ];

    // Компонент за отделен чат елемент
    const ChatItem = ({ item, index }) => {
      const [open, setOpen] = useState(false);
      const containerRef = useRef(null);

      // Затваряме падащото меню при клик извън компонента
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setOpen(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      const handleOptionClick = (option) => {
        // Тук можете да добавите логика за извършване на действието
        console.log(`Опция "${option}" избрана за чат елемент ${index}`);
        setOpen(false);
      };

      return (
        <li
          ref={containerRef}
          className="relative p-2 border-b-gray-300 border-b-[2px] hover:bg-gray-300 group m-0 basis-[55px] flex items-center"
        >
          <span>{item}</span>
          {/* Градиентен overlay при hover */}
          <span
            className="h-full w-[20%] absolute top-0 right-0
                       bg-gradient-to-r from-transparent via-platinum-gray to-platinum-gray
                       group-hover:from-transparent group-hover:via-gray-300 group-hover:to-gray-300"
          ></span>
          {/* Бутона за опции */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // да не се активира и слушателя за извън компонента
              setOpen(!open);
            }}
            className="h-full aspect-square absolute top-0 right-0 flex justify-center items-center"
            title="Опции"
          >
            <Image src={Options} alt="Опции" />
          </button>
          {/* Падащото меню */}
          {open && (
            <ul className="bg-Anti-flash-white w-[150px] h-fit p-2 absolute top-[70%] left-[45%] md:left-[90%] z-[170] rounded-xl">
              <li
                onClick={() => handleOptionClick("Изтегляне")}
                className="p-2 hover:bg-platinum-gray rounded-xl"
              >
                Изтегляне
              </li>
              <li
                onClick={() => handleOptionClick("Преименуване")}
                className="p-2 hover:bg-platinum-gray rounded-xl"
              >
                Преименуване
              </li>
              <li
                onClick={() => handleOptionClick("Изтриване")}
                className="p-2 hover:bg-platinum-gray rounded-xl"
              >
                Изтриване
              </li>
            </ul>
          )}
        </li>
      );
    };

    return (
      <main className="flex items-center pt-12 min-h-[100vh]">
        <div className="flex w-[80%] h-[80vh] m-auto gap-7 items-stretched flex-wrap">
          {/* Лява секция */}
          <div className="flex-[3] flex gap-6 flex-col justify-stretched">
            {/* Форма за въвеждане на текст */}
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
                  <Image src={ArrowRight} alt="Изпращане" />
                </button>
              </div>
            </form>

            {/* Показване на отговора */}
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
                <Image src={Copy} alt="Копиране" />
              </button>
              <p className="flex-[9] h-max border-l-gray-300 border-l-[7px] flex">
                <span className="mx-2 my-5 text-sm overflow-y-auto h-[150px] copy-text">
                  bye bye
                </span>
              </p>

              <div className="flex-[2] w-full h-[10%] bg-gray-300 flex gap-4 px-4 justify-end">
                <div className="flex items-center cursor-pointer">
                  <Image src={Download} alt="Изтегляне" />
                  <span>Изтегляне</span>
                </div>

                <div className="flex items-center cursor-pointer">
                  <Image src={Trash} alt="Изтриване" />
                  <span>Изтриване</span>
                </div>
              </div>
            </div>
          </div>

          {/* Дясна секция */}
          <div className="flex-[2] bg-platinum-gray rounded-2xl">
            <h3 className="w-[100%] bg-jordy-blue px-3 py-2 font-semibold text-base rounded-tl-2xl rounded-tr-2xl">
              Последни чатове
            </h3>
            <ul className="text-sm m-0 flex flex-col cursor-pointer">
              {chatItems.map((item, index) => (
                <ChatItem key={index} item={item} index={index} />
              ))}
            </ul>
          </div>
        </div>
      </main>
    );
  };

  return <ChatComponent />;
}
