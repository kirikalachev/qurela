'use client';
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';
import { Trash2, Download, Copy } from "lucide-react";
import CopyText from "@/app/assistant/CopyText";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  text: string;
}

interface Conversation {
  id: number;
  main_title: string;
  created_at: string;
  messages: ChatMessage[];
}

interface ResponseResult {
  url: string;
  title: string;
  snippet: string;
  score: number;
}

interface ResponseData {
  main_title: string;
  category: string;
  query: string;
  results: ResponseResult[];
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const ChatComponent = () => {
    const [showCopyText, setShowCopyText] = useState<boolean>(false);
    const [savedChats, setSavedChats] = useState<Conversation[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [selectedMode, setSelectedMode] = useState<string>('Проверка на информация');
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const message = params.get("message");
      const mode = params.get("mode");
      if (message) {
        setInputText(message);
      }
      if (mode) {
        setSelectedMode(mode);
      }
      if (message) {
        handleAutoSubmit(message, mode || selectedMode);
      }
    }, [selectedMode]);

    const handleAutoSubmit = async (message: string, mode: string): Promise<void> => {
      setLoading(true);
      setError('');
      setResponse(null);
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
            message,
            mode
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Грешка: ${res.status}`);
        }
        setResponse(data.response);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Нещо се обърка.');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setResponse(null);
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
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Нещо се обърка.');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteConversation = async (conversationId: number): Promise<void> => {
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

        setSavedChats(prevChats => prevChats.filter(chat => chat.id !== conversationId));
        alert('Кореспонденцията беше изтрита успешно!');
      } catch (err) {
        console.error("Error deleting conversation:", err);
        alert('Грешка при изтриване на кореспонденцията');
      }
    };

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
        .then((data: Conversation[]) => setSavedChats(data))
        .catch(err => console.error("Error fetching conversations:", err));
    }, []);

    return (
      <>
        {showCopyText && <CopyText />}
        <main className="flex items-center pt-12 min-h-[100vh]">
          <div className="flex w-[80%] h-[80vh] m-auto gap-7 items-stretched flex-wrap">
            {/* Left Panel – Chat input and response */}
            <div className="flex-[3] flex gap-6 flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col rounded-xl flex-[4] bg-white dark:bg-d-rich-black">
                <textarea
                  placeholder="Съобщение до Qurela"
                  autoFocus
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-[8] m-4 outline-none bg-transparent dark:text-d-cadet-gray"
                ></textarea>
                <div className="flex-[2] flex justify-between m-2">
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="dark:text-d-cadet-gray dark:bg-d-charcoal dark:text-d-cadet-gray bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
                  >
                    <option className='dark:text-d-cadet-gray' value="Проверка на информация">Проверка</option>
                    <option className='dark:text-d-cadet-gray' value="Задайте въпрос">Въпрос</option>
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
                    {loading
                      ? 'Зареждане...'
                      : response && typeof response === 'object' && response.main_title
                        ? response.main_title
                        : 'Резултат'}
                  </span>
                </h3>
                <button
                  onClick={() => {
                    const element = document.querySelector('.copy-text');
                    if (element && element.textContent) {
                      navigator.clipboard.writeText(element.textContent).then(() => {
                        setShowCopyText(true);
                        setTimeout(() => setShowCopyText(false), 2000);
                      });
                    }
                  }}
                  className="absolute top-2 right-2 rounded-xl transition-all active:bg-gray-300 flex items-center justify-center w-8 h-8"
                  title="Копиране"
                >
                  <Copy size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray" />
                </button>
                <div className="flex-[9] h-max border-l-platinum-gray-300 dark:border-l-d-charcoal border-l-[7px] flex">
                  <span className="dark:text-d-cadet-gray mx-2 my-5 text-sm overflow-y-auto h-[150px] copy-text">
                    {error
                      ? `Грешка: ${error}`
                      : response && typeof response === 'object'
                        ? (
                          <div>
                            <p className='dark:text-d-cadet-gray'>Category: {response.category}</p>
                            <p className='dark:text-d-cadet-gray'>Query: {response.query}</p>
                            <ul className='dark:text-d-cadet-gray'>
                              {response.results?.map((item, index) => (
                                <li key={index} className='dark:text-d-cadet-gray'>
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className='dark:text-d-cadet-gray'>
                                    {item.title}
                                  </a>
                                  <p className='dark:text-d-cadet-gray'>{item.snippet}</p>
                                  <p className='dark:text-d-cadet-gray'>Score: {item.score}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                        : response || 'Тук ще се появи отговорът от сървъра.'}
                  </span>
                </div>
                <div className="flex-[2] w-full h-[10%] bg-gray-300 flex gap-4 px-4 justify-end dark:bg-d-charcoal">
                  <div
                    onClick={() => {
                      const inputContent = inputText ? `Input: ${inputText}` : "Input: (няма въведени данни)";
                      const outputContent = response
                        ? `Output: ${typeof response === 'object' ? JSON.stringify(response, null, 2) : response}`
                        : "Output: (няма наличен отговор)";
                      const content = `${inputContent}\n\n${outputContent}`;
                      const blob = new Blob([content], { type: "text/plain" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "chat_output.txt";
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }}
                    className="flex items-center cursor-pointer gap-2"
                  >
                  <Download size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray" />
                  <span className='dark:text-d-cadet-gray'>Изтегляне</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel – Chat history */}
            <div className="flex-[2] bg-white rounded-2xl dark:bg-d-rich-black">
              <h3 className="w-full bg-jordy-blue px-3 py-2 font-semibold text-base rounded-tl-2xl rounded-tr-2xl">
                Последни чатове
              </h3>
              <ul className="text-sm m-0 flex flex-col dark:text-d-cadet-gray overflow-y-auto h-[70vh]">
                {savedChats.length > 0 ? (
                  savedChats.map((conversation) => (
                    <li
                      key={conversation.id}
                      className="dark:text-d-cadet-gray flex justify-between items-center p-2 border-b-[2px] border-gray-300 hover:bg-gray-100 dark:hover:bg-d-gunmetal"
                      onClick={() => {
                        console.log("Clicked conversation:", conversation);
                        if (conversation.messages.length >= 2) {
                          setInputText(conversation.messages[0].text);
                          setResponse({ 
                            main_title: conversation.main_title, 
                            category: "", 
                            query: "", 
                            results: [{ url: "", title: conversation.messages[1].text, snippet: "", score: 0 }] 
                          });
                        } else {
                          setInputText('');
                          setResponse(null);
                          setError('Все още няма отговор.');
                        }
                      }}
                    >
                      <span className='dark:text-d-cadet-gray'>
                        {conversation.main_title || "Без заглавие"} – {new Date(conversation.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        title="Изтриване"
                      >
                        <Trash2 size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray" />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center dark:text-d-cadet-gray">Няма запазени чатове</li>
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
