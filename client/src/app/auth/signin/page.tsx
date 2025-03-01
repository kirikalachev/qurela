"use client";

import Link from 'next/link';
import { useState } from 'react';
import api from "../../../utilis/api";
import { useRouter } from "next/navigation";
import PopupNotification from "../../../components/popupNottification";


const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("signin/", { username, password });

      if (response.data.tokens.access) {
        console.log("Login success:", response.data);
      
        document.cookie = `token=${response.data.tokens.access}; path=/; Secure; SameSite=Strict`;
      
        sessionStorage.setItem("showPopup", "true");
      
        router.push("/dashboard");
      }
      
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="h-[100vh] overflow-hidden">
      <div className="absolute w-full h-full bg-rich-black">
        <video className="object-cover h-full w-full" autoPlay muted loop>
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-50 m-5">
        <div className="absolute w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            <Link href="/" className="absolute top-[15px] left-[15px]">Назад</Link>
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 text-center p-8 bg-center bg-cover bg-[url(/images/login-img.jpg)]">
              <h2 className="text-2xl font-semibold">Добре дошли отново</h2>
              <p className="mt-4">
                Моля, влезте, използвайки вашата лична информация, за да останете свързани с нас.
              </p>
            </div>
            <div className="w-full lg:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-center">ВЛИЗАНЕ</h2>
              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Потребителско име"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Парола"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                    required
                  />
                </div>
                <a href="#" className="text-brown text-sm block text-right mb-4">
                  Забравена парола?
                </a>
                <button
                  type="submit"
                  className="w-full bg-brandeis-blue text-white py-3 rounded mt-4 hover:bg-marian-blue"
                >
                  Влизане
                </button>
              </form>
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
              <div className="text-center mt-4">
                Нямате акаунт?{' '}
                <Link href="/auth/signup" className="text-brandeis-blue font-semibold">
                  Регистрация
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;