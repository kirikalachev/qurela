'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import LoadingScreen from "../components/loadingScreen";
import { motion } from "framer-motion";



export default function App() {
    
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        setScrollY(window.scrollY);  // Update state with scroll position
        console.log(window.scrollY);  // Log scrollY position to console
      };
      
      window.addEventListener("scroll", handleScroll);
      
      // Cleanup on unmount
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
    <main className="bg-white flex flex-col items-center min-h-[100vh] pt-[200px] md:pt-[10%]">
        <section className='flex w-[86%] pb-[250px]'>
        <motion.div
      initial={{ opacity: 0, x: -50 }} // Start fully transparent & shifted left
      animate={{ opacity: 1, x: 0 }} // Fade in & move to original position
      transition={{ duration: 0.8, ease: "easeOut" }} // 1-second smooth transition
      className="flex-1 flex flex-col gap-8"
    >
      <h2 className="text-marian-blue text-3xl font-medium">
        Заедно срещу дезинформацията!
      </h2>
      <p className="text-[#2e2e2e] text-xl">
        Qurela предлага{" "}
        <span className="font-semibold text-inherit">бърза и точна проверка</span> на медицински факти с помощта на изкуствен интелект.
      </p>

      <div className="flex gap-3 select-none">
        <Link href="/auth/signin" className="px-5 py-1 rounded-xl bg-marian-blue text-white text-base h-9 flex justify-center items-center">
          <span className="text-white">Вход</span>
        </Link>
        <Link href="/auth/signup" className="px-5 py-1 rounded-xl bg-safety-orange text-base flex justify-center items-center">
          <span className="text-white">Да започваме!</span>
        </Link>
      </div>

      {/* line */}
      <div className="w-[70%] h-[2px] bg-gray-400"></div>

      {/* statistic */}
      <div className="flex gap-3 items-center">
        <span className="text-2xl text-safety-orange font-semibold">126 592</span>
        <span className="text-lg text-marian-blue font-semibold">Проверени твърдения</span>
      </div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: 50 }} // Start off-screen to the right
            animate={{ opacity: 1, x: 0 }} // Move to original position
            transition={{ duration: 0.8, ease: "easeOut" }} // Smooth animation
            className="flex-1 flex justify-end"
            >
            <Image src="/image.png" alt="dfs" width={600} height={600} />
        </motion.div>

        </section>


        <div className="flex justify-center items-center">
      <iframe
        width="853"
        height="480"
        src="https://www.youtube.com/embed/QKk6IWuduSU"
        title="Rain Sounds for Sleeping - Sound of Heavy Rainstorm & Thunder in the Misty Forest At Night"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className='rounded-lg'
      />


    </div>

    <img src="/wave.png" alt="dfs" width="100%" height="auto" className='pt-[150px]'/>

    <section className="bg-[#EBF3FF] w-full flex flex-col md:flex-row gap-4 items-center py-12 px-6">
    <div className="p-8 flex-1 rounded-lg overflow-hidden">
    <h2 className="text-marian-blue text-3xl font-bold mb-8">
      Нашите цели
    </h2>
    <div className="relative goals-container flex flex-col items-start">
      {/* Вертикалната линия */}
      <div className="whitespace-nowrap absolute left-[5px] flex flex-col gap-10 top-0 h-full border-l-4 border-marian-blue"></div>

      <div className="whitespace-nowrap goal flex items-center justify-start gap-4 transition-all duration-300 cursor-pointer">
        <div className="w-4 h-4 bg-marian-blue rounded-full"></div>
        <p className="whitespace-nowrap  goal-text text-gray-800 text-base transition-all duration-300 ease-in-out">
          Бърза, точна и автоматизирана проверка на медицинска информация.
        </p>
      </div>
      <div className="goal flex items-center justify-start gap-4 transition-all duration-300 cursor-pointer mt-8">
        <div className="w-4 h-4 bg-marian-blue rounded-full"></div>
        <p className="goal-text text-gray-800 text-base transition-all duration-300 ease-in-out">
          Борба с дезинформацията в здравния сектор.
        </p>
      </div>
      <div className="goal flex items-center justify-start gap-4 transition-all duration-300 cursor-pointer mt-8">
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
  
  <style jsx>{`
    /* При hover върху контейнера, всички текстове по подразбиране стават малко по-малки */
    .goals-container:hover .goal .goal-text {
      font-size: 1.0rem;
      transition: font-size 0.3s ease-in-out;
    }
    /* Когато конкретната цел (goal) е hover-ната, нейният текст става малко по-голям */
    .goal:hover .goal-text {
      font-size: 1.15rem !important;
    }
    /* При hover върху целта, точката става малко по-голяма */
    .goal div {
      transition: transform 0.3s ease-in-out;
    }
    .goal:hover div {
      transform: scale(1.3);
    }
  `}</style>
</section>








{/* team */}
    <section className='w-full flex bg-[#EBF3FF] justify-center flex-col items-center gap-10 pb-[200px]'>
    <h2 className="text-marian-blue text-3xl font-bold mb-8">            Нашият екип
        </h2>
        <div className='flex justify-betweem w-[50%]'>
            <div className='flex-col flex justify-center items-center '>
                <img src="/roblox.png" alt="dfs" width="60%" height="auto" className='pt-[]'/>
                <p className='text-[#2e2e2e] text-lg'>
                    Кирил, 16
                </p>
            </div>

            <div className='flex flex-col justify-center items-center '>
                <img src="/roblox.png" alt="dfs" width="60%" height="auto" className='pt-[]'/>
                <p className='text-[#2e2e2e] text-lg'>
                    Християн, 16
                </p>
            </div>
        </div>
    </section>

<section className='relative overflow-hidden w-full bg-[#EBF3FF] flex flex-col gap-8 justify-center items-center h-[500px] rounded-t-xl oveflow-hidden'>
    <div className='relative overflow-hidden w-[full] h-[500px]'>
    <span className='bg-black opacity-[0.7] w-full h-full absolute top-0 left-0 z-[10]'></span>
    <img 
        src="/people.jpg" 
        alt="" 
        className={`w-full h-auto transition-transform duration-[800ms] ${isScrolled ? 'scale-110' : 'scale-100'}`}
        />
    </div>
    <div className='absolute top-[40%] z-[11] flex justify-cente items-center flex-col gap-3'>
        <h2 className='text-white text-3xl font-semibold'>Имаш още въпроси?</h2>

        <div className='flex gap-4 select-none'>
        <Link href='/auth/signup' className='px-4 py-3 rounded-2xl bg-safety-orange text-white text-lg flex items-center justify center'>
            <span className='text-white'>Да започваме!</span>
        </Link>
        <Link href='/info#faq' className='px-8 py-3 rounded-2xl bg-marian-blue text-white text-lg flex items-center justify center'>
            <span className='text-white'>ЧЗВ</span>
        </Link>
        </div>
    </div>

</section>


    </main>
  );
}
