import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: number;
  onCommentAdded: (comment: any) => void;
}

export default function CreateComment({ postId, onCommentAdded }: CreateCommentProps) {
  const [commentText, setCommentText] = useState("");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false); // No token = not logged in
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch profile data:", error);
        if (error.response?.status === 401) {
          router.push("/auth/signin");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  // 🚀 Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/forum/posts/${postId}/comment/`,
        { content: commentText },
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`  // Sending token as Bearer token
          },
          withCredentials: true,  // Ensures cookies are sent if needed
        }
      );
  
      if (response.status === 201) {
        console.log("Comment added successfully!");
        setCommentText(""); // Clear input field
        onCommentAdded(response.data); // Notify parent component about new comment
      }
    } catch (error: any) {
      console.error("Error submitting comment:", error.response?.data || error);
      setError(error.response?.data?.detail || "Error submitting comment");
    }
  };
  
  if (loading) return <p>Зареждане...</p>;

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      {!profileData ? (
        <p className="text-red-500">
          Трябва да <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/auth/signin")}>влезете</span>, за да коментирате.
        </p>
      ) : (
        <>
          <textarea
            className="w-full p-2 border rounded-md dark:bg-d-charcoal dark:text-d-cadet-gray outline-none"
            placeholder="Напишете коментар..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded-md">
            Коментирай
          </button>
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
