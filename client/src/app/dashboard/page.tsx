// dashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';
import api from '@/lib/api'; 
import Link from "next/link";
import '@/app/style.css';
import PopupNotification from "../../components/popupNottification";

interface ProfileData {
  username: string;
}

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const popupShowed = localStorage.getItem("popupShowed");
    if (!popupShowed) {
      setShowPopup(true);
    }
  }, []);

  const [inputValue, setInputValue] = useState('Проверка на информация');
  const [protectedData, setProtectedData] = useState<any>(null);
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };

  const redirectToAssistant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = '/assistant';
  };


  return (
    <main className="flex flex-col items-center min-h-[100vh] pt-[40%] md:pt-[15%] gap-3 justify-center">
            {showPopup && <PopupNotification />}
      <h2 className="text-2xl md:text-3xl font-bold">{inputValue}</h2>
      <div className="flex justify-center items-center flex-col w-full">
        <form
          className="bg-white flex justify-between md:justify-center items-center w-[90%] h-fit md:w-[55%] md:h-[55px] m-[1vh] p-[7px] rounded-2xl md:rounded-full md:flex-nowrap flex-wrap"
          onSubmit={redirectToAssistant}
        >
          <textarea
            className="flex-[100%] md:hidden outline-none w-full h-[120px] px-1 text-basis whitespace-nowrap overflow-hidden"
          />
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

      {protectedData && (
        <div className="w-[90%] p-4 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold">Protected Data</h3>
          <pre>{JSON.stringify(protectedData, null, 2)}</pre>
        </div>
      )}

      <div className="w-[90%] h-[60vh] flex justify-between gap-y-7 gap-x-14 flex-col md:flex-row md:w-[65%] md:h-60 ">
        {/* dark тъмна версия */}
        <div className="bg-platinum-gray dark:bg-gray-800 rounded-2xl flex-[4] overflow-hidden flex-1">
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
      <div className='flex w-full justify-center'>
        <div className="min-h-12 w-[70%] bg-white p-4 rounded-xl shadow-md">
                      {/* Профилна информация */}
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Профилна снимка (placeholder) */}
                          <div>
                              <h4 className="font-bold">Име</h4>
                              <p className="text-gray-500 text-sm">Дата на качване</p>
                          </div>
                      </div>

                      {/* Съдържание на поста */}
                      <div className="mb-4">
                          <h3 className="font-semibold text-lg">Заглавие на поста</h3>
                          <p className="text-gray-700">Съдържание на поста
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus eius in, ratione distinctio, deserunt facere sint facilis delectus esse sit obcaecati at! Tempore doloribus aspernatur maxime? Molestiae voluptatum ad dolorum?
                          </p>
                      </div>

                      {/* Интеракция */}
                      <div className="flex gap-4 text-sm">
                          <button className="text-gray-600 hover:text-blue-500">👍 Like</button>
                          <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
                          <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
                          <Link href="#" className="text-blue-500 hover:underline">#Тема</Link>
                      </div>
        </div>
      </div>
    </main>
  );
}
