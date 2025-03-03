"use client";
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
        username,
        password,
        email,
      });
      console.log('Registration success:', response.data);

      if (response.data.tokens && response.data.tokens.access) {
        document.cookie = `token=${response.data.tokens.access}; path=/; Secure; SameSite=Strict`;
        sessionStorage.setItem("showPopup", "true");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data.error || 'Error during registration');
      console.error('Error during registration:', err.response?.data);
    }
  };

  return (
    <main className="h-[100vh] overflow-hidden z-[50]">
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

            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 text-white text-center p-8 bg-center bg-cover bg-[url(/images/signup-img.jpg)]">
              <h2 className="text-2xl font-semibold">Създайте акаунт</h2>
              <p className="mt-4">
                За да станете част от нашата общност, моля, регистрирайте се, използвайки вашата лична информация.
              </p>
            </div>

            <div className="w-full lg:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-center">РЕГИСТРАЦИЯ</h2>
              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Създайте потребителско име"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Въведете вашия имейл"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Създайте парола"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brandeis-blue text-white py-3 rounded mt-4 hover:bg-marian-blue"
                >
                  Регистрация
                </button>
              </form>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
