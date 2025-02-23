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
  const [inputValue, setInputValue] = useState('Проверка на информация');
  const [protectedData, setProtectedData] = useState<any>(null);

  useEffect(() => {
    const popupShowed = localStorage.getItem("popupShowed");
    if (!popupShowed) {
      setShowPopup(true);
    }
  }, []);

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };

  const handleVote = (postId: number, type: "upvote" | "downvote") => {
    const token = Cookies.get("token");
    if (!token) return;
  
    // Keep track of the previous vote values before making a change
    const previousPosts = [...posts];
  
    // Local update for instant feedback
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: type === "upvote" ? post.upvotes + 1 : post.upvotes,
              downvotes: type === "downvote" ? post.downvotes + 1 : post.downvotes,
            }
          : post
      )
    );
  
    const url =
      type === "upvote"
        ? `http://127.0.0.1:8000/forum/posts/${postId}/upvote/`
        : `http://127.0.0.1:8000/forum/posts/${postId}/downvote/`;
  
    // Send the vote request to the server
    axios
    .post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      console.log("Vote response:", response.data);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
              }
            : post
        )
      );
    })
  
  };
  
  
  

  const redirectToAssistant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = '/assistant';
  };

  return (
    <main className="flex flex-col items-center min-h-[100vh] pt-[40%] md:pt-[15%] gap-3 justify-center">
      {showPopup && <PopupNotification />}
      <h2 className="dark:text-d-cadet-gray text-2xl md:text-3xl font-bold">{inputValue}</h2>
      <div className="flex justify-center items-center flex-col w-full">
        <form
          className="dark:bg-d-rich-black bg-white flex justify-between md:justify-center items-center w-[90%] h-fit md:w-[55%] md:h-[55px] m-[1vh] p-[7px] rounded-2xl md:rounded-full md:flex-nowrap flex-wrap"
          onSubmit={redirectToAssistant}
        >
          <textarea
            className="flex-[100%] md:hidden outline-none w-full h-[120px] px-1 text-basis whitespace-nowrap overflow-hidden"
          />
          <select
            className="p-2 md:h-[100%] dark:bg-d-charcoal dark:text-d-cadet-gray bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
            onChange={handleSelectChange}
          >
            <option value="Проверка на информация">Проверка</option>
            <option value="Задайте въпрос">Въпрос</option>
            <option value="Обобщи информация">Обобщение</option>
          </select>
          <input
            className="outline-none w-full max-h-6 px-1 text-basis hidden md:block bg-transparent dark:text-d-cadet-gray"
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

      <div className="w-[90%] h-[60vh] flex justify-between gap-y-7 gap-x-14 flex-col md:flex-row md:w-[65%] md:h-60">
        <div className="bg-platinum-gray dark:bg-d-rich-black rounded-2xl flex-[4] overflow-hidden flex-1">
          <h3 className="w-[100%] bg-jordy-blue p-3 font-semibold text-base">Последни чатове</h3>
          <ul className="p-3 text-sm">
            <li className='dark:text-d-cadet-gray'>Какви са симптомите на диабет тип 2 и как се диагностицира?</li>
            <li className='dark:text-d-cadet-gray'>Каква е разликата между вирусна и бактериална инфекция?</li>
            <li className='dark:text-d-cadet-gray'>Какви са основните рискови фактори за сърдечно-съдови заболявания?</li>
            <li className='dark:text-d-cadet-gray'>Какво е значение на имунната система и какво може да я отслаби?</li>
          </ul>
        </div>

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
                onClick={() => handleVote(post.id, "upvote")}
              >
                👍 {post.upvotes}
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleVote(post.id, "downvote")}
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
