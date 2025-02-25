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

  // Проверка за наличието на токен при зареждане на страницата
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const ChatComponent = () => {
    const [showCopyText, setShowCopyText] = useState(false);
    // Съхраняване на запазените разговори от backend
    const [savedChats, setSavedChats] = useState<any[]>([]);
    // Състояние за текущия разговор и неговите съобщения
    const [currentConversation, setCurrentConversation] = useState<any>(null);
    const [conversationMessages, setConversationMessages] = useState<any[]>([]);
    // Състояния за текстовото поле, избрания режим, отговора, зареждането и грешките
    const [inputText, setInputText] = useState('');
    const [selectedMode, setSelectedMode] = useState('Проверка на информация');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = () => {
      // Проверяваме дали има вход и изход
      const inputContent = inputText ? `Input: ${inputText}` : "Input: (няма въведени данни)";
      const outputContent = response ? `Output: ${response}` : "Output: (няма наличен отговор)";
    
      // Създаваме съдържание за файла
      const content = `${inputContent}\n\n${outputContent}`;
    
      // Създаваме Blob обект с текстово съдържание
      const blob = new Blob([content], { type: "text/plain" });
    
      // Създаваме URL за Blob
      const url = window.URL.createObjectURL(blob);
    
      // Създаваме временно <a> за изтегляне
      const a = document.createElement("a");
      a.href = url;
      a.download = "chat_output.txt"; // Име на файла
      document.body.appendChild(a);
      a.click();
    
      // Почистване на URL и премахване на елемента
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };

    // Функция за преименуване на разговор
    const renameConversation = async (conversationId: number) => {
      const newName = prompt("Въведете новото име на разговора:");
      if (!newName) return;
    
      const token = Cookies.get("token");
      if (!token) return;
    
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/conversations/${conversationId}/rename/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name: newName })
        });
    
        if (!res.ok) throw new Error("Грешка при преименуването.");
    
        // Актуализираме локално списъка със запазени чатове
        setSavedChats(prevChats =>
          prevChats.map(chat =>
            chat.id === conversationId ? { ...chat, name: newName } : chat
          )
        );
    
        alert("Разговорът е преименуван успешно!");
      } catch (err) {
        console.error("Неуспешно преименуване:", err);
      }
    };

    // Извличане на запазените разговори при монтиране на компонента
    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) return;
      fetch('http://127.0.0.1:8000/api/conversations/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setSavedChats(data);
        })
        .catch(err => {
          console.error("Error fetching conversations:", err);
        });
    }, []);

    // Зареждане на конкретен разговор по неговото ID
    const loadConversation = (conversationId: number) => {
      const token = Cookies.get("token");
      if (!token) return;

      fetch(`http://127.0.0.1:8000/api/conversations/${conversationId}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Loaded conversation data:", data);

          // Проверяваме дали data е масив или съдържа масив messages
          const messages = Array.isArray(data) ? data : data.messages || [];
          
          // Намираме последното съобщение от потребителя
          const lastUserMessage = messages.slice().reverse().find(msg => msg.sender === 'user');
          const lastBotMessage = messages.find(msg => msg.sender === 'bot');

          setInputText(lastUserMessage ? lastUserMessage.text : '');
          setResponse(lastBotMessage ? lastBotMessage.text : '');
          setConversationMessages(messages);
          setCurrentConversation(data);
        })
        .catch(err => {
          console.error("Error loading conversation:", err);
        });
    };

    // Функция за копиране на текст
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

    // Функция за изтриване на кореспонденция
    const handleDeleteConversation = async (conversationId: number) => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/conversations/${conversationId}/delete/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Не може да се изтрие кореспонденцията');
        }

        // Актуализиране на списъка със запазени чатове
        setSavedChats(prevChats => prevChats.filter(chat => chat.id !== conversationId));
        alert('Кореспонденцията беше изтрита успешно!');
      } catch (err) {
        console.error("Error deleting conversation:", err);
        alert('Грешка при изтриване на кореспонденцията');
      }
    };

    // Компонент за елемент от списъка с чатове
    const ChatItem = ({ conversation }: { conversation: any }) => {
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
        if (option === "Изтриване") {
          handleDeleteConversation(conversation.id);
        }
        console.log(`Опция "${option}" избрана за чат ${conversation.id}`);
        setOpen(false);
      };

      return (
        <li
          ref={containerRef}
          onClick={() => loadConversation(conversation.id)}
          className="relative p-2 border-b-gray-300 border-b-[2px] hover:bg-gray-100 transition-all duration-500 dark:hover:bg-d-gunmetal group m-0 flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="font-semibold">Chat #{conversation.id}</span>
            <br />
            <span className="text-xs text-gray-500">
              {new Date(conversation.created_at).toLocaleString()}
            </span>
          </div>
          {/* Бутона за опции */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="h-8 w-8 flex justify-center items-center"
            title="Опции"
          >
            <OptionsButton />
          </button>
          {open && (
            <ul className="fixed z-[12] dark:bg-d-rich-black bg-Anti-flash-white w-[150px] h-fit p-2 absolute top-full right-0 z-[170] rounded-xl">
              <li
                onClick={() => handleOptionClick("Изтегляне")}
                className="z-[12] p-2 hover:bg-platinum-gray rounded-xl dark:hover:bg-d-gunmetal"
              >
                Изтегляне
              </li>
              <li
                onClick={() => renameConversation(conversation.id)}
                className="p-2 hover:bg-platinum-gray rounded-xl dark:hover:bg-d-gunmetal"
              >
                Преименуване
              </li>
              <li
                onClick={() => handleOptionClick("Изтриване")}
                className="z-[12] p-2 hover:bg-platinum-gray rounded-xl dark:hover:bg-d-gunmetal"
              >
                Изтриване
              </li>
            </ul>
          )}
        </li>
      );
    };

    // Обработчик на формата за изпращане на съобщение
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
            message: inputText,
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
            {/* Ляв панел – детайли на разговора и формата за съобщение */}
            <div className="flex-[3] flex gap-6 flex-col">
              {/* Формата за изпращане на ново съобщение */}
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
                  <div onClick={handleDownload} className="flex items-center cursor-pointer">
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

            {/* Десен панел – история на чатове */}
            <div className="flex-[2] bg-white rounded-2xl dark:bg-d-rich-black">
              <h3 className="w-full bg-jordy-blue px-3 py-2 font-semibold text-base rounded-tl-2xl rounded-tr-2xl">
                Последни чатове
              </h3>
              <ul className="text-sm m-0 flex flex-col cursor-pointer dark:text-d-cadet-gray overflow-y-auto h-[70vh]">
                {savedChats.length > 0 ? (
                  savedChats.map((conversation) => (
                    <ChatItem key={conversation.id} conversation={conversation} />
                  ))
                ) : (
                  <li className="p-2 text-center">Няма запазени чатове</li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </>
    );
  };

  return <ChatComponent />;
}
