'use client';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CreateComment from "@/components/CreateComment"; 

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
  // Comments will be stored separately in state
}

const PostDetailPage = () => {
  const { id } = useParams(); // Get post id from URL
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get token from cookies
  const token = Cookies.get('token');

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!token) return;
    const url = `http://127.0.0.1:8000/forum/posts/${post!.id}/${type}/`;
    try {
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      // Option 1: Refetch the post details
      const response = await axios.get(`http://127.0.0.1:8000/forum/posts/${post!.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPost(response.data);
    } catch (error) {
      console.error("Vote error:", error);
    }
  };
  

  // Fetch post details
  useEffect(() => {
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    if (id) {
      axios
        .get(`http://127.0.0.1:8000/forum/posts/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
          setError('Failed to load post');
        });
    }
  }, [id, router, token]);

  // Fetch comments for the post
  useEffect(() => {
    if (!token) return;
    if (id) {
      axios
        .get(`http://127.0.0.1:8000/forum/posts/${id}/comments/`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((response) => {
          setComments(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(`Error fetching comments for post ${id}:`, error);
          setLoading(false);
        });
    }
  }, [id, token]);

  // Callback when a new comment is added
  const handleCommentAdded = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (error) return <p>{error}</p>;
  if (loading || !post) return <p>Loading...</p>;

  const copyToClipboard = async (postId: number) => {
    try {
      const url = `${window.location.origin}/forum/post/${postId}`;
      await navigator.clipboard.writeText(url);
      alert("Връзката е копирана!"); // You can replace this with your preferred notification system
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Грешка при копиране на връзката");
    }
  };

  return (
    <div className="pt-[10%] min-h-screen flex flex-col gap-6 p-6">
      {/* Post Details */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-4 dark:bg-d-rich-black dark:text-d-cadet-gray">
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
          <p className="text-gray-700 dark:text-d-cadet-gray">{post.content}</p>
        </div>
        <div className="flex gap-4 text-sm">
        <button 
          className="text-green-600 hover:text-green-800"
          onClick={() => handleVote("upvote")}
        >
          👍 {post.upvotes}
        </button>
        <button 
          className="text-red-600 hover:text-red-800"
          onClick={() => handleVote("downvote")}
        >
          👎 {post.downvotes}
        </button>
          <button className="text-gray-600 hover:text-blue-500" onClick={() => copyToClipboard(post.id)}>
            🔗 Споделяне
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
        <h4 className="font-semibold mb-4">Коментари:</h4>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
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

        {/* Create New Comment */}
        <div className="mt-4 border-t pt-4">
          <CreateComment postId={Number(id)} onCommentAdded={handleCommentAdded} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
