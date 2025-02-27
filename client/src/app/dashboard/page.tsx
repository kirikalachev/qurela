'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from "next/link";
import PopupNotification from "../../components/popupNottification";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  category: string;
}

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedMode, setSelectedMode] = useState('Проверка на информация');
  const [message, setMessage] = useState('');
  // New state to hold conversation history
  const [conversations, setConversations] = useState<any[]>([]);

  // Show popup on first load if not shown before
  useEffect(() => {
    const popupShowed = localStorage.getItem("popupShowed");
    if (!popupShowed) {
      setShowPopup(true);
    }
  }, []);

  // Load forum posts from the backend
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/forum/posts/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Грешка при зареждане на публикации:", error);
      });
  }, []);

  // Load chat history (conversations) from the backend
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/api/conversations/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Reverse so that newest conversations appear first
        setConversations(response.data.reverse());
      })
      .catch((error) => {
        console.error("Грешка при зареждане на разговори:", error);
      });
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMode(e.target.value);
  };

  // Redirect to the assistant page with query parameters for message and mode
  const redirectToAssistant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryParams = new URLSearchParams();
    queryParams.append("message", message);
    queryParams.append("mode", selectedMode);
    window.location.href = `/assistant?${queryParams.toString()}`;
  };

  return (
    <main className="flex flex-col items-center min-h-[100vh] pt-[40%] md:pt-[15%] gap-3 justify-center">
      {showPopup && <PopupNotification />}
      <h2 className="dark:text-d-cadet-gray text-2xl md:text-3xl font-bold">{selectedMode}</h2>
      <div className="flex justify-center items-center flex-col w-full">
        <form
          className="dark:bg-d-rich-black bg-white flex justify-between md:justify-center items-center w-[90%] h-fit md:w-[55%] md:h-[55px] m-[1vh] p-[7px] rounded-2xl md:rounded-full md:flex-nowrap flex-wrap"
          onSubmit={redirectToAssistant}
        >
          {/* For mobile view */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Съобщение до Qurela"
            className="flex-[100%] md:hidden outline-none w-full h-[120px] px-1 text-basis whitespace-nowrap overflow-hidden"
          />
          <select
            value={selectedMode}
            onChange={handleSelectChange}
            className="p-2 md:h-[100%] dark:bg-d-charcoal dark:text-d-cadet-gray bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
          >
            <option value="Проверка на информация">Проверка</option>
            <option value="Задайте въпрос">Въпрос</option>
            <option value="Обобщи информация">Обобщение</option>
          </select>
          {/* For desktop view */}
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="outline-none w-full max-h-6 px-1 text-basis hidden md:block bg-transparent dark:text-d-cadet-gray"
            placeholder="Съобщение до Qurela"
            autoFocus
          />
          <button
            className="p-2 md:h-[100%] aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer"
            title="Изпращане"
          >
            <Image src={ArrowRight} alt="Изпращане" />
          </button>
        </form>
      </div>

      {/* Dashboard sections: Chat History and Editor Selection */}
      <div className="w-[90%] h-[60vh] flex justify-between gap-y-7 gap-x-14 flex-col md:flex-row md:w-[65%] md:h-60">
        {/* Chat History Section */}
        <div className="bg-platinum-gray dark:bg-d-rich-black rounded-2xl flex-[4] overflow-hidden flex-1">
          <h3 className="w-[100%] bg-jordy-blue p-3 font-semibold text-base">Последни чатове</h3>
          <ul className="p-3 text-sm">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <Link key={conv.id} href={`/assistant?conversationId=${conv.id}`}>
                  <li className="dark:text-d-cadet-gray mb-2 cursor-pointer">
                    <span className="font-semibold">{conv.name || `Чат #${conv.id}`}</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(conv.created_at).toLocaleString()}
                    </span>
                  </li>
                </Link>
              ))
            ) : (
              <li className="dark:text-d-cadet-gray">Няма запазени чатове</li>
            )}
          </ul>
        </div>

        {/* Editor Selection Section */}
        <div className="flex flex-col bg-platinum-gray dark:bg-d-rich-black rounded-2xl flex-[3] overflow-hidden flex-1">
          <h3 className="w-[100%] bg-brandeis-blue p-3 text-white font-semibold text-base">Избор на редактора</h3>
          <span className="w-full h-[100%] flex justify-center items-center">
            <p className="text-base font-bold text-gray-500">Празно</p>
          </span>
        </div>
      </div>

      <h2 className="mt-12 dark:text-d-cadet-gray text-2xl md:text-3xl font-bold">Трендинг</h2>
      <div className='flex w-full flex-col gap-4 items-center'>
        {posts.map((post) => (
          <div key={post.id} className="min-h-12 w-[65%] bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <h4 className="font-bold">{post.author}</h4>
                <p className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-gray-700 dark:text-d-cadet-gray">{post.content}</p>
            </div>

            <div className="flex gap-4 text-sm">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => console.log("Upvote", post.id)}
              >
                👍 {post.upvotes}
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => console.log("Downvote", post.id)}
              >
                👎 {post.downvotes}
              </button>
              <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
              <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
              <Link href={`/forum/post/${post.id}`} className="text-blue-500 hover:underline">
                #{post.category}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}