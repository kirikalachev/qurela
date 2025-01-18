'use client';
import React from 'react';
import Image from 'next/image';
import StudyIMG from '@/app/study.jpg';
import Link from 'next/link';

const FormPopup: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <main className='h-[100vh] overflow-hidden'>
      {/* <Image src={StudyIMG} alt='' className='w-full h-auto'></Image> */}
      <div className='absolute w-full h-full bg-rich-black'>
        <video 
          className='object-cover h-full w-full'
          autoPlay
          muted
          loop
        >
          <source src="background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* bg-black bg-opacity-40 backdrop-blur-sm */}
      <div className="absolute inset-0 flex items-center justify-center  z-50 m-5">
        <div className="absolute w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden ">
          <div className="flex">
            <Link href='/' className='absolute top-[15px] left-[15px]'>Назад</Link>
            <div
              className={`hidden lg:flex flex-col justify-center items-center w-1/2 text-white text-center p-8 bg-center bg-cover ${
                isLogin ? 'bg-[url(/images/login-img.jpg)]' : 'bg-[url(/images/signup-img.jpg)]'
              }`}
            >
              <h2 className="text-2xl font-semibold">
                {isLogin ? 'Добре дошли отново' : 'Създайте акаунт'}
              </h2>
              <p className="mt-4">
                {isLogin
                  ? 'Моля, влезте, използвайки вашата лична информация, за да останете свързани с нас.'
                  : 'За да станете част от нашата общност, моля, регистрирайте се, използвайки вашата лична информация.'}
              </p>
            </div>
            <div className="w-full lg:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-center">
                {isLogin ? 'ВЛИЗАНЕ' : 'РЕГИСТРАЦИЯ'}
              </h2>
              <form className="mt-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={isLogin ? 'Имейл' : 'Въведете имейла си'}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder={isLogin ? 'Парола' : 'Създайте парола'}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                  />
                </div>
                {isLogin ? (
                  <a
                    href="#"
                    className="text-brown text-sm block text-right mb-4"
                  >
                    Забравена парола?
                  </a>
                ) : (
                  <div className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      id="policy"
                      className="w-4 h-4 mr-2"
                    />
                    <label htmlFor="policy">
                      Съгласявам се с{' '}
                      <a href="#" className="text-brown">
                        условията на ползване
                      </a>
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-brandeis-blue text-white py-3 rounded mt-4 hover:bg-marian-blue"
                >
                  {isLogin ? 'Влизане' : 'Регистрация'}
                </button>
              </form>
              <div className="text-center mt-4">
                {isLogin
                  ? "Нямате акунт?"
                  : 'Вече имате акаунт?'}{' '}
                <a
                  href="#"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-brandeis-blue font-semibold"
                >
                  {isLogin ? 'Регистрация' : 'Влизане'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FormPopup;
