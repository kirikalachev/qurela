// app/forum/post/[id]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation'; // Correct hook for dynamic routes in app/
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';  // For handling cookies

const PostDetailPage = () => {
  const { id } = useParams();  // Get the dynamic ID from the URL using useParams
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');  // Get the token from cookies

    if (!token) {
      // If there's no token, redirect to the sign-in page
      router.push('/auth/signin');
      return;
    }

    if (id) {  // Only fetch if id is available
      axios
        .get(`http://127.0.0.1:8000/forum/posts/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setPost(response.data);  // Set the fetched post data
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
          setError('Failed to load post');
        });
    }
  }, [id, router]);  // Re-fetch when `id` changes

  if (error) return <p>{error}</p>;

  return (
    <div className="pt-[10%] min-h-screen flex flex-col md:flex-row gap-6 p-6">
      <div className="md:w-2/3 flex flex-col gap-6">
        {post ? (
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
              <p className="text-gray-700 dark:text-d-cadet-gray">
                {post.content}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <button className="text-green-600 hover:text-green-800">
                👍 {post.upvotes}
              </button>
              <button className="text-red-600 hover:text-red-800">
                👎 {post.downvotes}
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                💬 Comment
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                🔗 Share
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
