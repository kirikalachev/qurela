'use client';
import React from 'react';
import Image from 'next/image';
import StudyIMG from '@/app/study.jpg';

const FormPopup: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <main className='h-[100vh] overflow-hidden'>
      {/* <Image src={StudyIMG} alt='' className='w-full h-auto'></Image> */}
      <video 
        height="100%" 
        width="auto"
        autoPlay
        muted
        loop>
        <source src="background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
      <div className="absolute w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            <div
              className={`hidden lg:flex flex-col justify-center items-center w-1/2 text-white text-center p-8 bg-center bg-cover ${
                isLogin ? 'bg-[url(/images/login-img.jpg)]' : 'bg-[url(/images/signup-img.jpg)]'
              }`}
            >
              <h2 className="text-2xl font-semibold">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="mt-4">
                {isLogin
                  ? 'Please log in using your personal information to stay connected with us.'
                  : 'To become a part of our community, please sign up using your personal information.'}
              </p>
            </div>
            <div className="w-full lg:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-center">
                {isLogin ? 'LOGIN' : 'SIGNUP'}
              </h2>
              <form className="mt-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={isLogin ? 'Email' : 'Enter your email'}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder={isLogin ? 'Password' : 'Create password'}
                    className="w-full border rounded p-3 focus:outline-teal-500"
                  />
                </div>
                {isLogin ? (
                  <a
                    href="#"
                    className="text-brown text-sm block text-right mb-4"
                  >
                    Forgot password?
                  </a>
                ) : (
                  <div className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      id="policy"
                      className="w-4 h-4 mr-2"
                    />
                    <label htmlFor="policy">
                      I agree to the{' '}
                      <a href="#" className="text-brown">
                        Terms & Conditions
                      </a>
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-brandeis-blue text-white py-3 rounded mt-4 hover:bg-marian-blue"
                >
                  {isLogin ? 'Log In' : 'Sign Up'}
                </button>
              </form>
              <div className="text-center mt-4">
                {isLogin
                  ? "Don't have an account?"
                  : 'Already have an account?'}{' '}
                <a
                  href="#"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-brandeis-blue font-semibold"
                >
                  {isLogin ? 'Signup' : 'Login'}
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
