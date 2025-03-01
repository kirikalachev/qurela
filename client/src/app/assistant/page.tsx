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
    const [savedChats, setSavedChats] = useState<any[]>([]);
    const [currentConversation, setCurrentConversation] = useState<any>(null);
    const [conversationMessages, setConversationMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [selectedMode, setSelectedMode] = useState('Проверка на информация');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // On mount, extract query parameters and (optionally) auto-submit
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
      // Optionally, auto-submit if a message was passed
      if (message) {
        handleAutoSubmit(message, mode || selectedMode);
      }
    }, []);

    // Function to automatically submit a chat message (extracted from query)
    const handleAutoSubmit = async (message: string, mode: string) => {
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
            message: message,
            mode: mode
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Грешка: ${res.status}`);
        }
        setResponse(data.response);
      } catch (err: any) {
        setError(err.message || 'Нещо се обърка.');
      } finally {
        setLoading(false);
      }
    };

    // Normal form submission (if user makes edits and resubmits)
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
        setError(err.message || 'Нещо се обърка.');
      } finally {
        setLoading(false);
      }
    };

    // Function to delete a conversation
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

        // Update the saved chats list
        setSavedChats(prevChats => prevChats.filter(chat => chat.id !== conversationId));
        alert('Кореспонденцията беше изтрита успешно!');
      } catch (err) {
        console.error("Error deleting conversation:", err);
        alert('Грешка при изтриване на кореспонденцията');
      }
    };

    // Displaying chat history (Последни чатове) fetched from the backend
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
        .then(data => setSavedChats(data))
        .catch(err => console.error("Error fetching conversations:", err));
    }, []);

    // Render the chat interface
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
                  onClick={() => {
                    const element = document.querySelector('.copy-text');
                    if (element && element.textContent) {
                      navigator.clipboard.writeText(element.textContent)
                        .then(() => {
                          setShowCopyText(true);
                          setTimeout(() => setShowCopyText(false), 2000);
                        });
                    }
                  }}
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
                  <div onClick={() => {
                    // Download functionality
                    const inputContent = inputText ? `Input: ${inputText}` : "Input: (няма въведени данни)";
                    const outputContent = response ? `Output: ${response}` : "Output: (няма наличен отговор)";
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
                  }} className="flex items-center cursor-pointer">
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
                      className="flex justify-between items-center p-2 border-b-[2px] border-gray-300 hover:bg-gray-100 dark:hover:bg-d-gunmetal"
                      onClick={() => {
                        console.log("Clicked conversation:", conversation);
                        if (conversation.messages.length >= 2) {
                          setInputText(conversation.messages[0].text);
                          setResponse(conversation.messages[1].text);
                        } else {
                          setInputText('');
                          setResponse('Все още няма отговор.');
                        }
                      }}
                    >
                      <span>
                        Chat #{conversation.id} – {new Date(conversation.created_at).toLocaleString()}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }} 
                        title="Изтриване"
                      >
                        <Image src={Trash} alt="Изтриване" />
                      </button>
                    </li>
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
