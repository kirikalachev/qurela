'use client';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CreateComment from "@/components/CreateComment";
import ProfileAvatar from "@/components/profileAvatar"; 
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";


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
}

const PostDetailPage = () => {
  const { id } = useParams(); 
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('token');

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!token || !post) return;
    const url = `http://127.0.0.1:8000/forum/posts/${post.id}/${type}/`;
    try {
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      const response = await axios.get(`http://127.0.0.1:8000/forum/posts/${post.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPost(response.data);
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

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

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (error) return <p>{error}</p>;
  if (loading || !post) return <p className="min-h-[100vh]"></p>;

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
    <div className="pt-[10%] flex flex-col gap-6 p-6">
    {/* Post Details */}
    <div className="bg-white p-4 rounded-xl shadow-md mb-4 dark:bg-d-rich-black dark:text-d-cadet-gray">
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
        <button 
          className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center"
          onClick={() => handleVote("upvote")}
        >
          <ThumbsUp size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray"/>
          {post.upvotes}
        </button>
        <button 
          className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center"
          onClick={() => handleVote("downvote")}
        >
          <ThumbsDown size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray"/>
          {post.downvotes}
        </button>
        <button className="text-rich-black dark:text-d-cadet-gray flex gap-1 items-center" onClick={() => copyToClipboard(post.id)}>
          <Share2 size={20} stroke="currentColor" className="dark:stroke-d-cadet-gray"/>
          Споделяне
        </button>
      </div>
    </div>
  
    {/* Comments Section */}
    <div className="bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
      <h4 className="font-semibold mb-4 dark:text-d-cadet-gray">Коментари:</h4>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
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
  
      {/* Create New Comment */}
      <div className="mt-4 border-t dark:border-d-cadet-gray pt-4">
        <CreateComment postId={Number(id)} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  </div>
  
  );
};

export default PostDetailPage;
