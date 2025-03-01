'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from "react";
import LoadingScreen from "../components/loadingScreen";
import { motion } from "framer-motion";

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      console.log(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-white flex flex-col items-center min-h-screen pt-[150px] md:pt-[10%]">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row w-[90%] pb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col gap-8"
        >
          <h2 className="text-marian-blue text-3xl font-medium">
            Проверена медицинска информация на едно място.
          </h2>
          <p className="text-[#2e2e2e] text-xl">
            Qurela предлага{" "}
            <span className="font-semibold text-inherit">бърза и точна проверка</span> на медицински факти с помощта на изкуствен интелект.
          </p>

          <div className="flex gap-3 select-none">
          <Link href="/auth/signin" className="px-5 py-2 rounded-xl bg-marian-blue text-base flex justify-center items-center">
              <span className="text-white">Вход</span>
            </Link>
            <Link href="/auth/signup" className="px-5 py-2 rounded-xl bg-safety-orange text-base flex justify-center items-center">
              <span className="text-white">Да започваме!</span>
            </Link>
          </div>

          <div className="w-[70%] h-[2px] bg-gray-400"></div>

          <div className="flex gap-3 items-center">
            <span className="text-2xl text-safety-orange font-semibold">126 592</span>
            <span className="text-lg text-marian-blue font-semibold">Проверени твърдения</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0"
        >
          <img src="/qurela-image.png" alt="" width={600} height={600} className="max-w-full h-auto" />
        </motion.div>
      </section>

      <img src="/wave.png" alt="wave" className="w-full pt-10" />

      {/* Goals Section */}
      <section className="bg-[#EBF3FF] w-full flex flex-col md:flex-row gap-4 items-center py-12 px-6">
        <div className="p-8 flex-1 rounded-lg overflow-hidden">
          <h2 className="text-marian-blue text-3xl font-bold mb-8">
            Нашите цели
          </h2>
          <div className="relative goals-container flex flex-col items-start">
            <div className="absolute left-[5px] flex flex-col gap-10 top-0 h-full border-l-4 border-marian-blue"></div>

            <div className="flex items-center gap-4 transition-all duration-300 cursor-pointer">
              <div className="w-4 h-4 bg-marian-blue rounded-full"></div>
              <p className="goal-text text-gray-800 text-base transition-all duration-300 ease-in-out">
                Бърза, точна и автоматизирана проверка на медицинска информация.
              </p>
            </div>
            <div className="flex items-center gap-4 transition-all duration-300 cursor-pointer mt-8">
              <div className="w-4 h-4 bg-marian-blue rounded-full"></div>
              <p className="goal-text text-gray-800 text-base transition-all duration-300 ease-in-out">
                Борба с дезинформацията в здравния сектор.
              </p>
            </div>
            <div className="flex items-center gap-4 transition-all duration-300 cursor-pointer mt-8">
              <div className="w-4 h-4 bg-marian-blue rounded-full"></div>
              <p className="goal-text text-gray-800 text-base transition-all duration-300 ease-in-out">
                Улесняваме създаването на надеждно медицинско съдържание.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <LoadingScreen />
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full flex bg-[#EBF3FF] justify-center flex-col items-center gap-10 pb-20">
        <h2 className="text-marian-blue text-3xl font-bold mb-8">Нашият екип</h2>
        <div className="flex flex-col md:flex-row justify-between w-full md:w-1/2 gap-8">
          <div className="flex flex-col justify-center items-center">
            <img src="/roblox.png" alt="Кирил" className="w-32 h-auto" />
            <p className="text-[#2e2e2e] text-lg mt-4">
              Кирил, 16
            </p>
          </div>

          <div className="flex flex-col justify-center items-center">
            <img src="/roblox.png" alt="Християн" className="w-32 h-auto" />
            <p className="text-[#2e2e2e] text-lg mt-4">
              Християн, 16
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative overflow-hidden w-full bg-[#EBF3FF] flex flex-col gap-8 justify-center items-center h-80 md:h-[500px] rounded-t-xl">
  <div className="relative w-full h-full md:h-[500px]">
    <span className="bg-black opacity-70 w-full h-full absolute top-0 left-0 z-[10]"></span>
    <img 
      src="/people.jpg" 
      alt="People" 
      className={`w-full h-full transition-transform duration-800 ${isScrolled ? 'scale-110' : 'scale-100'} object-cover md:object-contain md:h-auto`}
    />
  </div>
  <div className="absolute top-1/2 md:top-[40%] transform -translate-y-1/2 md:transform-none z-[11] flex flex-col gap-3 items-center">
    <h2 className="text-white text-3xl font-semibold text-center">Имаш още въпроси?</h2>
    <div className="flex gap-4 select-none">
      <Link href="/auth/signup" className="px-4 py-3 rounded-2xl bg-safety-orange text-white text-lg flex items-center">
        <span className="text-white">Да започваме!</span>
      </Link>
      <Link href="/info#faq" className="px-8 py-3 rounded-2xl bg-marian-blue text-white text-lg flex items-center">
        <span className="text-white">ЧЗВ</span>
      </Link>
    </div>
  </div>
</section>

    </main>
  );
}
