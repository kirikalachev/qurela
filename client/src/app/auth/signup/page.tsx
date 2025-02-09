"use client";
import Link from 'next/link';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  // Handle signup form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
        username,
        password,
        email,
      });
      console.log('Registration success:', response.data);
      setVerifyEmail(true); // Show OTP input
    } catch (err: any) {
      setError(err.response?.data.error || 'Error during registration');
      console.error('Error during registration:', err.response?.data);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move to the next input if it's not the last one
      if (index < otp.length - 1 && value !== '') {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.every(digit => digit !== '')) {
      try {
        const otpValue = otp.join('');
        console.log("Sending OTP:", otpValue);
        const response = await axios.post('http://127.0.0.1:8000/api/verify_email/', {
          email, // Ensure email is sent
          code: otpValue,
        });
        console.log('OTP verification success:', response.data);
        router.push('/auth/signin'); // Redirect to login after verification
      } catch (err: any) {
        setError(err.response?.data.error || 'Invalid verification code. Try again.');
      }
    } else {
      setError('Please fill all OTP fields.');
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

            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 text-white text-center p-8 bg-center bg-cover bg-[url(/images/signup-img.jpg)]">
              <h2 className="text-2xl font-semibold">Създайте акаунт</h2>
              <p className="mt-4">
                За да станете част от нашата общност, моля, регистрирайте се, използвайки вашата лична информация.
              </p>
            </div>

            {verifyEmail ? (
              <div className="w-full lg:w-1/2 p-6">
                <h2 className="text-2xl font-semibold text-center">Верификация на имейл</h2>
                <form className="mt-6" onSubmit={handleOtpSubmit}>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        maxLength={1}
                        className="w-10 h-10 text-center border rounded"
                        ref={(el) => { inputRefs.current[index] = el; }}
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brandeis-blue text-white py-3 rounded mt-4 hover:bg-marian-blue"
                  >
                    Потвърдете код
                  </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
