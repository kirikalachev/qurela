'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';
import Trash from '@/app/trash.svg';
import Download from '@/app/download.svg';
import Copy from '@/app/copy.svg';
import OptionsButton from '@/app/assistant/optionsButton';
import CopyText from "@/app/assistant/CopyText";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Check for token on page load
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const ChatComponent = () => {
    const [showCopyText, setShowCopyText] = useState(false);

    // Function to copy text
    const handleCopyText = () => {
      const element = document.querySelector('.copy-text');
      if (element && element.textContent) {
        navigator.clipboard.writeText(element.textContent)
          .then(() => {
            setShowCopyText(true);
            setTimeout(() => setShowCopyText(false), 2000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }
    };

    // Example list of chats – later load dynamically from the backend
    const chatItems = [
      "Какви са симптомите на диабет тип 2 и как се диагностицира?",
      "Каква е разликата между вирусна и бактериална инфекция?",
      "Какви са основните рискови фактори за сърдечно-съдови заболявания?",
      "Какво е значение на имунната система и какво може да я отслаби?",
    ];

    // Component for individual chat items with options
    const ChatItem = ({ item, index }: { item: string; index: number }) => {
      const [open, setOpen] = useState(false);
      const containerRef = useRef<HTMLLIElement>(null);

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      const handleOptionClick = (option: string) => {
        console.log(`Опция "${option}" избрана за чат елемент ${index}`);
        setOpen(false);
      };

      return (
        <li
          ref={containerRef}
          className="relative p-2 border-b-gray-300 border-b-[2px] hover:bg-gray-100 transition-all 0.5s dark:hover:bg-d-gunmetal group m-0 basis-[55px] flex items-center"
        >
          <span>{item}</span>
          {/* Gradient overlay on hover */}
          <span
            className="h-full w-[20%] absolute top-0 right-0
                       bg-gradient-to-r from-transparent via-white to-white
                       group-hover:from-transparent group-hover:via-gray-100 group-hover:to-gray-100
                       transition-all 0.5s 
                       dark:bg-gradient-to-r dark:from-transparent dark:via-d-rich-black dark:to-d-rich-black
                       dark:group-hover:from-transparent dark:group-hover:via-d-gunmetal dark:group-hover:to-d-gunmetal"
          ></span>
          {/* Options button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="h-full aspect-square absolute top-0 right-0 flex justify-center items-center"
            title="Опции"
          >
            <OptionsButton />
          </button>
          {/* Dropdown menu */}
          {open && (
            <ul className="dark:bg-d-rich-black bg-Anti-flash-white w-[150px] h-fit p-2 absolute top-[70%] left-[45%] md:left-[90%] z-[170] rounded-xl">
              <li
                onClick={() => handleOptionClick("Изтегляне")}
                className="p-2 hover:bg-platinum-gray rounded-xl dark:hover:bg-d-gunmetal"
              >
                Изтегляне
              </li>
              <li
                onClick={() => handleOptionClick("Преименуване")}
                className="p-2 hover:bg-platinum-gray rounded-xl dark:hover:bg-d-gunmetal"
              >
                Преименуване
              </li>
              <li
                onClick={() => handleOptionClick("Изтриване")}
                className="p-2 hover:bg-platinum-gray rounded-xl dark:hover:bg-d-gunmetal"
              >
                Изтриване
              </li>
            </ul>
          )}
        </li>
      );
    };

    // States for input text, selected mode, response, loading, and errors
    const [inputText, setInputText] = useState('');
    const [selectedMode, setSelectedMode] = useState('Проверка на информация');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setResponse('');
    
      const token = Cookies.get("token");
      if (!token) {
        setError("Не сте влезли в системата. Моля, влезте.");
        setLoading(false);
        return;
      }
    
      try {
        const res = await fetch('http://127.0.0.1:8000/api/conversations/send/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: inputText, // Updated payload key to match backend
            mode: selectedMode
          })
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          throw new Error(data.error || `Грешка: ${res.status}`);
        }
    
        setResponse(data.response);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Нещо се обърка.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {showCopyText && <CopyText />}
        <main className="flex items-center pt-12 min-h-[100vh]">
          <div className="flex w-[80%] h-[80vh] m-auto gap-7 items-stretched flex-wrap">
            {/* Left section – input form and result display */}
            <div className="flex-[3] flex gap-6 flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col rounded-xl flex-[4] bg-white dark:bg-d-rich-black">
                <textarea
                  placeholder="Съобщение до Qurela"
                  autoFocus
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-[8] m-4 outline-none bg-transparent"
                ></textarea>
                <div className="flex-[2] flex justify-between m-2">
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="dark:bg-d-charcoal dark:text-d-cadet-gray bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
                  >
                    <option value="Проверка на информация">Проверка</option>
                    <option value="Задайте въпрос">Въпрос</option>
                    <option value="Обобщи информация">Обобщение</option>
                  </select>
                  <button
                    type="submit"
                    className="aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer"
                    title="Изпращане"
                  >
                    <Image src={ArrowRight} alt="Изпращане" />
                  </button>
                </div>
              </form>

              <div className="relative bg-white rounded-xl flex-[5] overflow-hidden flex flex-col dark:bg-d-rich-black">
                <h3 className="flex-[2] border-l-green-500 border-l-[7px] flex items-center">
                  <span className="dark:text-d-cadet-gray mx-2 text-base font-semibold">
                    {loading ? 'Зареждане...' : 'Резултат'}
                  </span>
                </h3>
                <button
                  onClick={handleCopyText}
                  className="absolute top-2 right-2 rounded-xl transition-all active:bg-gray-300 flex items-center justify-center w-8 h-8"
                  title="Копиране"
                >
                  <Image src={Copy} alt="Копиране" />
                </button>
                <p className="flex-[9] h-max border-l-platinum-gray-300 dark:border-l-d-charcoal-300 border-l-[7px] flex">
                  <span className="dark:text-d-cadet-gray mx-2 my-5 text-sm overflow-y-auto h-[150px] copy-text">
                    {error ? `Грешка: ${error}` : response || 'Тук ще се появи отговорът от сървъра.'}
                  </span>
                </p>

                <div className="flex-[2] w-full h-[10%] bg-gray-300 flex gap-4 px-4 justify-end dark:bg-d-charcoal">
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

            {/* Right section – chat history */}
            <div className="flex-[2] bg-white rounded-2xl dark:bg-d-rich-black">
              <h3 className="w-full bg-jordy-blue px-3 py-2 font-semibold text-base rounded-tl-2xl rounded-tr-2xl">
                Последни чатове
              </h3>
              <ul className="text-sm m-0 flex flex-col cursor-pointer dark:text-d-cadet-gray">
                {chatItems.map((item, index) => (
                  <ChatItem key={index} item={item} index={index} />
                ))}
              </ul>
            </div>
          </div>
        </main>
      </>
    );
  };

  return <ChatComponent />;
}
