//old code
'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useCreatePost } from "@/context/CreatePostContext";
import CustomSelect from "@/components/createPost/customSelect"; // assuming your select component is exported from selectOption.tsx
import Cookies from "js-cookie";

export default function CreatePost() {
  const { isOpen, closePost } = useCreatePost();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      setError("Моля, попълнете всички полета!");
      return;
    }

    setLoading(true);
    setError(null);

    const token = Cookies.get("token"); // Get the token from Cookies
    if (!token) {
      window.location.href = "/auth/signin";
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/forum/posts/",
        {
          title,
          content,
          category,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Post created:", response.data);
      closePost();
    } catch (err: any) {
      console.error("Грешка при публикуване на поста:", err);
      setError(
        err.response?.data?.detail || "Неуспешно публикуване на поста."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="forbid-overflow w-full h-full top-0 left-0 fixed z-[51] flex justify-center items-center">
      {/* Background overlay */}
      <span
        className="cursor-pointer w-full h-full top-0 left-0 fixed bg-black z-[51] opacity-[0.7]"
        onClick={closePost}
      ></span>

      <div className="p-5 flex flex-col w-[55%] h-[55%] bg-white z-[52] gap-3 rounded dark:bg-d-rich-black">
        <div className="flex-[1] flex items-center justify-between px-2 select-none">
          <h2 className="text-xl font-medium dark:text-d-cadet-gray">
            Създай публикация
          </h2>
          <button onClick={closePost} className="text-xl cursor-pointer">
            x
          </button>
        </div>
        <div className="flex-[15] flex flex-col gap-4">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заглавие"
            className="dark:text-d-cadet-gray flex-[2] p-2 outline-none border rounded border-[#A9A9AC] dark:bg-d-charcoal"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="За какво си мислите?"
            className="dark:text-d-cadet-gray flex-[8] p-2 outline-none border rounded border-[#A9A9AC] dark:bg-d-charcoal"
          />
        </div>
        <div className="flex-[3] flex items-center justify-between">
          <div>
            <CustomSelect onChange={(value) => setCategory(value)} />
          </div>
          <button
            className="bg-safety-orange p-2 select-none"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Публикуване..." : "Публикуване"}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
