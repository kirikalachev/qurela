"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation";
import Image from "next/image"
import ArrowRight from "@/app/arrow-right.svg"
import axios from "axios"
import Cookies from "js-cookie"
import Link from "next/link"
import PopupNotification from "../../components/popupNottification"
import CreateComment from "@/components/createComment";
import ProfileAvatar from "@/components/profileAvatar"; 
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, ExternalLink } from "lucide-react";


interface Comment {
  id: number
  content: string
  author: string
  created_at: string
}

interface Post {
  id: number
  title: string
  content: string
  author: string
  created_at: string
  upvotes: number
  downvotes: number
  category: string 
  comments?: Comment[]
}

export default function Dashboard() {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedMode, setSelectedMode] = useState("Проверка на информация")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState<any[]>([])
  const [commentsVisible, setCommentsVisible] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const popupShowed = localStorage.getItem("popupShowed")
    if (!popupShowed) {
      setShowPopup(true)
    }
  }, [])

  const fetchComments = async (postId: number, token: string): Promise<Comment[]> => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/forum/posts/${postId}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      return response.data
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err)
      return []
    }
  }

  const toggleComments = async (postId: number) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))

    const post = posts.find((p) => p.id === postId)
    if (post && !post.comments) {
      const token = Cookies.get("token")
      if (!token) return
      const comments = await fetchComments(postId, token)
      setPosts((prevPosts) => prevPosts.map((p) => (p.id === postId ? { ...p, comments } : p)))
    }
  }

  const handleVote = async (postId: number, type: "upvote" | "downvote") => {
    const token = Cookies.get("token")
    if (!token) return

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: type === "upvote" ? (post.upvotes ?? 0) + 1 : post.upvotes,
              downvotes: type === "downvote" ? (post.downvotes ?? 0) + 1 : post.downvotes,
            }
          : post,
      ),
    )

    const url =
      type === "upvote"
        ? `http://127.0.0.1:8000/forum/posts/${postId}/upvote/`
        : `http://127.0.0.1:8000/forum/posts/${postId}/downvote/`

    try {
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } })

      const response = await axios.get(`http://127.0.0.1:8000/forum/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const updatedPosts = response.data.map((newPost: Post) => {
        const oldPost = posts.find((p) => p.id === newPost.id)
        return {
          ...newPost,
          comments: oldPost?.comments ?? newPost.comments,
        }
      })
      setPosts(updatedPosts)
    } catch (error) {
      console.error("Грешка при гласуване:", error)
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: type === "upvote" ? Math.max((post.upvotes ?? 1) - 1, 0) : post.upvotes,
                downvotes: type === "downvote" ? Math.max((post.downvotes ?? 1) - 1, 0) : post.downvotes,
              }
            : post,
        ),
      )
    }
  }

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) return
    axios
      .get("http://127.0.0.1:8000/forum/posts/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPosts(response.data)
      })
      .catch((error) => {
        console.error("Грешка при зареждане на публикации:", error)
      })
  }, [])

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) return
    axios
      .get("http://127.0.0.1:8000/api/conversations/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setConversations(response.data.reverse())
      })
      .catch((error) => {
        console.error("Грешка при зареждане на разговори:", error)
      })
  }, [])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMode(e.target.value)
  }

  const redirectToAssistant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const queryParams = new URLSearchParams()
    queryParams.append("message", message)
    queryParams.append("mode", selectedMode)
    window.location.href = `/assistant?${queryParams.toString()}`
  }

  const navigateToPost = (postId: number) => {
    router.push(`/forum/post/${postId}`);
  };

  const copyToClipboard = async (postId: number) => {
    try {
      const url = `${window.location.origin}/forum/post/${postId}`;
      await navigator.clipboard.writeText(url);
      alert("Връзката е копирана!"); 
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Грешка при копиране на връзката");
    }
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
            <option value="Проверка на информация" className="dark:text-d-cadet-gray">Проверка</option>
            <option value="Задайте въпрос" className="dark:text-d-cadet-gray">Въпрос</option>
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
            <Image src={ArrowRight || "/placeholder.svg"} alt="Изпращане" />
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
          <span className="font-semibold dark:text-d-cadet-gray">
            {conv.name || `Чат #${conv.id}`}
          </span>
          <br />
          <span className="text-xs text-gray-500 dark:text-d-cadet-gray">
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
      <div className="flex w-full flex-col gap-4 items-center">
  {[...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)
    .map((post) => (
      <div
        key={post.id}
        className="bg-white p-4 rounded-xl shadow-md mb-4 dark:bg-d-rich-black dark:text-d-cadet-gray w-[60%]"
      >
        <div className="flex items-center gap-4 mb-4">
          <ProfileAvatar profilePic={null} username={post.author} />
          <div>
            <h4 className="font-bold dark:text-d-cadet-gray">{post.author}</h4>
            <p className="text-gray-500 dark:text-d-cadet-gray text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-lg dark:text-d-cadet-gray">{post.title}</h3>
          <p className="text-gray-700 dark:text-d-cadet-gray">{post.content}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <button className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center" onClick={() => handleVote(post.id, "upvote")}>
            <ThumbsUp size={20}  stroke="currentColor" className="dark:stroke-d-cadet-gray" />
            {post.upvotes}
          </button>
          <button className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center" onClick={() => handleVote(post.id, "downvote")}>
            <ThumbsDown size={20}  stroke="currentColor" className="dark:stroke-d-cadet-gray" />
            {post.downvotes}
          </button>
          <button className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center" onClick={() => toggleComments(post.id)}>
            <MessageCircle size={20}  stroke="currentColor" className="dark:stroke-d-cadet-gray" />
            Comment
          </button>
          <button className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center" onClick={() => copyToClipboard(post.id)}>
            <Share2 size={20}  stroke="currentColor" className="dark:stroke-d-cadet-gray" />
            Споделяне
          </button>
          <button className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center" onClick={() => navigateToPost(post.id)}>
            <ExternalLink size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray" />
            Отвори публикация
          </button>
          {post.category ? (
            <p className="text-blue-500 hover:underline">#{post.category}</p>
          ) : (
            <span className="text-gray-500">Без категория</span>
          )}
        </div>
        {commentsVisible[post.id] && (
          <>
            <div className="mt-4">
              <h4 className="font-semibold mb-2 dark:text-d-cadet-gray">Коментари:</h4>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="border dark:border-d-cadet-gray p-2 my-2 rounded">
                    <p className="text-gray-800 dark:text-d-cadet-gray">{comment.content}</p>
                    <p className="text-xs text-gray-500 dark:text-d-cadet-gray">
                      От: {comment.author} • {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-d-cadet-gray">Няма коментари.</p>
              )}
            </div>
            <div className="mt-4 border-t dark:border-d-cadet-gray pt-4">
              <CreateComment
                postId={post.id}
                onCommentAdded={(newComment) => {
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p.id === post.id
                        ? {
                            ...p,
                            comments: p.comments ? [...p.comments, newComment] : [newComment],
                          }
                        : p,
                    ),
                  );
                }}
              />
            </div>
          </>
        )}
      </div>
    ))}
</div>

    </main>
  )
}

