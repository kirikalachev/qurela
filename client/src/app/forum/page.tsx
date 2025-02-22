'use client';
import { useCreatePost } from "@/context/CreatePostContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string; // например, потребителско име
  created_at: string;
  upvotes: number;
  downvotes: number;
  category: string; // добавено поле за темата
}

export default function ForumPage() {
  const { openPost } = useCreatePost();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Няма токен, пренасочване към вход...");
      router.push("/auth/signin");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/forum/posts/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Грешка при зареждане на публикации:", error);
        setError(
          error.response?.data?.detail ||
            "Грешка при зареждане на публикации."
        );
        if (error.response?.status === 401) {
          router.push("/auth/signin");
        }
        setLoading(false);
      });
  }, [router]);

  const handleVote = (postId: number, type: "upvote" | "downvote") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url =
      type === "upvote"
        ? `http://127.0.0.1:8000/forum/posts/${postId}/upvote/`
        : `http://127.0.0.1:8000/forum/posts/${postId}/downvote/`;

    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
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
      .catch((error) => {
        console.error("Грешка при гласуване:", error);
      });
  };

  if (loading) {
    return <p>Зареждане...</p>;
  }

  if (error) {
    return <p className="text-red-500">Грешка: {error}</p>;
  }

  return (
    <main className="pt-[10%] min-h-screen flex flex-col md:flex-row gap-6 p-6">
      <div className="md:w-2/3 flex flex-col gap-6">
        <div className="bg-white dark:bg-d-rich-black p-4 rounded-xl shadow-md flex items-center gap-4">
          <form className="relative flex-grow flex items-center gap-2">
            <input
              type="text"
              placeholder="Търси..."
              className="dark:bg-d-charcoal w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 bg-marian-blue text-white p-1 rounded-full"
            >
              🔍
            </button>
          </form>
          {/* бутон за отваряне на CreatePost */}
          <button
            className="bg-safety-orange text-white px-4 py-2 rounded-lg"
            onClick={openPost}
          >
            Създай публикация
          </button>
        </div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-xl shadow-md mb-4 dark:bg-d-rich-black dark:text-d-cadet-gray"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <h4 className="font-bold">{post.author}</h4>
                <p className="text-gray-500 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-gray-700 dark:text-d-cadet-gray">
                {post.content}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              {/* Upvote Button */}
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => handleVote(post.id, "upvote")}
              >
                👍 {post.upvotes}
              </button>
              {/* Downvote Button */}
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleVote(post.id, "downvote")}
              >
                👎 {post.downvotes}
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                💬 Comment
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                🔗 Share
              </button>
              <Link
                href={`/forum/post/${post.id}`}
                className="text-blue-500 hover:underline"
              >
                #{post.category}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="right-0 md:w-1/3 bg-white rounded-2xl shadow-md h-[75vh] overflow-hidden">
        <h2 className="w-[100%] bg-jordy-blue p-4 font-semibold text-base">
          Категории
        </h2>
        <ul className="dark:bg-d-rich-black h-full overflow-y-auto custom-scrollbar p-4 space-y-2 flex flex-col">
          {[
            { id: "blank", title: "blank" },
            { id: "general-medicine", title: "Обща медицина" },
            { id: "specialized-medicine", title: "Специализирана медицина" },
            { id: "symptoms-diseases", title: "Симптоми и заболявания" },
            { id: "medications-treatment", title: "Лекарства и лечение" },
            { id: "surgery-procedures", title: "Хирургия и процедури" },
            { id: "healthy-lifestyle", title: "Здравословен живот" },
            { id: "pregnancy-children", title: "Бременност и детско здраве" },
            { id: "sexual-health", title: "Полово и урологично здраве" },
            { id: "mental-health", title: "Психично здраве" },
            { id: "infectious-diseases", title: "Инфекциозни болести" },
            { id: "doctors-hospitals", title: "Лекари и болници" },
          ].map((topic) => (
            <li key={topic.id}>
              <a
                href={`#${topic.id}`}
                className="block p-2 rounded-lg hover:bg-blue-100 text-brandeis-blue"
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
