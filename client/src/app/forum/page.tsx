'use client';
import { useCreatePost } from "@/context/CreatePostContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CreateComment from "@/components/CreateComment"; 
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Search, ExternalLink } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  category: {
    id: number;
    name: string;
  };
  comments?: Comment[];
}

interface Category {
  id: number;
  name: string;
}

export default function ForumPage() {
  const { openPost } = useCreatePost();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const router = useRouter();
  
  const [commentsVisible, setCommentsVisible] = useState<{ [key: number]: boolean }>({});

  const toggleComments = (postId: number) => {
    setCommentsVisible(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const fetchComments = async (postId: number, token: string): Promise<Comment[]> => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/forum/posts/${postId}/comments/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Няма токен, пренасочване към вход...");
      router.push("/auth/signin");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/forum/posts/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(async (response) => {
        const postsData: Post[] = response.data;
      
        postsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            const comments = await fetchComments(post.id, token);
            return { ...post, comments };
          })
        );
      
        setPosts(postsWithComments);
        setAllPosts(postsWithComments);
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

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/forum/categories/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Невалиден формат на данни за категории");
        }
      })
      .catch((error) => {
        console.error("Грешка при зареждане на категории:", error);
      });
  }, [router]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let filteredPosts = allPosts;
    if (searchQuery.trim() !== '') {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeCategory !== null) {
      filteredPosts = filteredPosts.filter(post => post.category?.id === activeCategory);
    }
    setPosts(filteredPosts);
  };

  const handleCategoryFilter = (categoryId: number) => {
    setActiveCategory(categoryId);
    let filteredPosts = allPosts.filter(post => post.category?.id === categoryId);
    if (searchQuery.trim() !== '') {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setPosts(filteredPosts);
  };

  const clearCategoryFilter = () => {
    setActiveCategory(null);
    if (searchQuery.trim() !== '') {
      setPosts(allPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setPosts(allPosts);
    }
  };

  const handleVote = async (postId: number, type: "upvote" | "downvote") => {
    const token = Cookies.get("token");
    if (!token) return;
  
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: type === "upvote" ? (post.upvotes ?? 0) + 1 : post.upvotes,
              downvotes: type === "downvote" ? (post.downvotes ?? 0) + 1 : post.downvotes,
            }
          : post
      )
    );
  
    const url =
      type === "upvote"
        ? `http://127.0.0.1:8000/forum/posts/${postId}/upvote/`
        : `http://127.0.0.1:8000/forum/posts/${postId}/downvote/`;
  
    try {
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
  
      const response = await axios.get(`http://127.0.0.1:8000/forum/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const updatedPosts = response.data.map((newPost: Post) => {
        const oldPost = allPosts.find((p) => p.id === newPost.id);
        return {
          ...newPost,
          comments: oldPost?.comments ?? [],
        };
      });
      setAllPosts(updatedPosts);
      let filteredPosts = updatedPosts;
      if (searchQuery.trim() !== '') {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (activeCategory !== null) {
        filteredPosts = filteredPosts.filter(post => post.category?.id === activeCategory);
      }
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Грешка при гласуване:", error);
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: type === "upvote" ? Math.max((post.upvotes ?? 1) - 1, 0) : post.upvotes,
                downvotes: type === "downvote" ? Math.max((post.downvotes ?? 1) - 1, 0) : post.downvotes,
              }
            : post
        )
      );
    }
  };
  
  if (loading) {
    return <p>Зареждане...</p>;
  }

  if (error) {
    return <p className="text-red-500">Грешка: {error}</p>;
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
    <main className="min-h-[100vh] pt-[10%] min-h-screen flex flex-col md:flex-row gap-6 p-6">
      <div className="md:w-2/3 flex flex-col gap-6">
        <div className="bg-white dark:bg-d-rich-black p-4 rounded-xl shadow-md flex items-center gap-4">
          <form className="relative flex-grow flex items-center gap-2" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Търси..."
              className="dark:bg-d-charcoal w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 bg-marian-blue text-white p-1 rounded-full"
            >
              🔍
            </button>
          </form>
          {/* Button to clear category filter if active */}
          {activeCategory && (
            <button
              onClick={clearCategoryFilter}
              className="bg-gray-200 text-black px-4 py-2 rounded-lg"
            >
              Показване на всички категории
            </button>
          )}
          {/* Бутон за отваряне на CreatePost */}
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
              <h3 className="font-semibold text-lg" onClick={() => navigateToPost(post.id)}>{post.title}</h3>
              <p className="text-gray-700 dark:text-d-cadet-gray">
                {post.content}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => handleVote(post.id, "upvote")}
              >
                <ThumbsUp size={20} />
                {post.upvotes}
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleVote(post.id, "downvote")}
              >
                <ThumbsDown size={20} />
                {post.downvotes}
              </button>
              <button
                className="text-gray-600 hover:text-blue-500"
                onClick={() => toggleComments(post.id)}
              >
                <MessageCircle size={20} />
                Коментиране
              </button>
              <button className="text-gray-600 hover:text-blue-500" onClick={() => copyToClipboard(post.id)}>
              <Share2 size={20} />
              Споделяне
              </button>
              <button 
                className="text-gray-600 hover:text-blue-500"
                onClick={() => navigateToPost(post.id)}
              >
                <ExternalLink size={20} /> Отвори публикация
              </button>
              {post.category ? (
                <p
                  className="text-blue-500 hover:underline"
                >
                  #{post.category}
                </p>
              ) : (
                <span className="text-gray-500">Без категория</span>
              )}
            </div>
            {commentsVisible[post.id] && (
              <>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Коментари:</h4>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="border p-2 my-2 rounded">
                        <p className="text-gray-800">{comment.content}</p>
                        <p className="text-xs text-gray-500">
                          От: {comment.author} • {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Няма коментари.</p>
                  )}
                </div>
                <div className="mt-4 border-t pt-4">
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
                            : p
                        )
                      );
                      setAllPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === post.id
                            ? {
                                ...p,
                                comments: p.comments ? [...p.comments, newComment] : [newComment],
                              }
                            : p
                        )
                      );
                    }} 
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="right-0 md:w-1/3 bg-white rounded-2xl shadow-md h-[75vh] overflow-hidden">
        <h2 className="w-[100%] bg-jordy-blue p-4 font-semibold text-base">
          Категории
        </h2>
        <ul className="dark:bg-d-rich-black h-full overflow-y-auto custom-scrollbar p-4 space-y-2 flex flex-col">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryFilter(category.id)}
                  className="block w-full text-left p-2 rounded-lg hover:bg-blue-100 text-brandeis-blue"
                >
                  {category.name}
                </button>
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">Няма налични категории</li>
          )}
        </ul>
      </div>
    </main>
  );
}
