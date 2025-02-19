'use client';

import Image from 'next/image';
import ArrowRight from '@/app/arrow-right.svg';
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";

export default function App() {
    const data = {
        question: {heading: 'Средната телесна температура при човек', input: "Каква е нормалната телесна температура при възрастен човек?", output: "Нормалната телесна температура при възрастен човек обикновено е около 36.5 – 37.5°C, но може леко да варира в зависимост от времето на деня и индивидуалните особености." },
        check: {heading: 'Студената вода причинява ангина', input: "Пиенето на студена вода причинява ангина.", output: "Ангината се причинява от вируси или бактерии, а не от температурата на водата. Студените напитки могат временно да раздразнят гърлото, но не водят до инфекция." },
        summarize: {
          heading: 'Съкратен текст: Витамин C',
          input: `Витамин C е основно хранително вещество, което играе ключова роля в поддържането на имунната система. Той помага за образуването на колаген, подобрява усвояването на желязото и действа като антиоксидант, предпазвайки клетките от увреждане. Недостигът на витамин C може да доведе до скорбут – състояние, което причинява слабост, кървене на венците и проблеми с зарастването на рани. Най-добрите източници на витамин C са цитрусовите плодове, ягодите, чушките и броколите.`,


          output: `
          Витамин C подпомага имунитета, образуването на колаген и усвояването на желязото. Недостигът му може да причини скорбут. Основни източници са цитрусите, ягодите и чушките.
          `
        }
      };
    
      const [selectedType, setSelectedType] = useState("check");
      const { input, output, heading } = data[selectedType];

  return (
    <main className="bg-white flex flex-col items-center min-h-[100vh] pt-[200px] md:pt-[10%]">
        <section className='flex w-[86%] pb-[250px]'>
            <div className='flex-1 flex flex-col gap-8'>
                <h2 className='text-marian-blue text-3xl font-medium'>
                    Заедно срещу дезинформацията!
                </h2>
                <p className='text-[#2e2e2e] text-xl'>
                    Qurela предлага <span className='font-semibold text-inherit'>бърза и точна проверка</span> на медицински факти с помощта на изкуствен интелект.
                </p>

                <div className='flex gap-3 select-none'>
                    <Link href='/auth/signin' className='px-5 py-1 rounded-xl bg-marian-blue text-white text-base h-9 flex justify-center items-center'>
                        <span className='text-white'>Вход</span>
                    </Link>
                    <Link href='/auth/signup' className='px-5 py-1 rounded-xl bg-safety-orange text-base flex justify-center items-center'>
                        <span className='text-white'>Да започваме!</span>
                    </Link>
                </div>

                {/* line */}
                <div className='w-[70%] h-[2px] bg-gray-400'></div>

                {/* statistic */}
                <div className='flex gap-3 items-center'>
                    <span className='text-2xl text-safety-orange font-semibold'>126 592</span>
                    <span className='text-lg text-marian-blue font-semibold'>Проверени твърдения</span>
                </div>
            </div>

            <div className='flex-1 flex justify-end'>
                {/* Use the correct path starting from the root */}
                <Image src="/image.png" alt="dfs" width={600} height={600} />
            </div>
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

    <section className='bg-[#EBF3FF] w-full flex gap-4'>
        
        <div className='p-12 flex-1'>
            <h2 className='text-marian-blue text-2xl font-medium'>
                Нашите цели
            </h2>
            <ul className='list-disc m-8 flex flex-col gap-4 w-[70%]'>
                <li>Осигуряваме бърза и точна проверка на медицинските факти с изкуствен интелект.</li>
                <li>Борба с дезинформацията в здравния сектор.</li>
                <li>Улесняваме създаването на надеждно медицинско съдържание.</li>
            </ul>
        </div>

        <div className='p-12 flex-1'>
            
            <h2 className='text-marian-blue text-2xl font-medium'>
                Демо
            </h2>
            <div className="flex gap-6 flex-col justify-stretched h-[300px]">
                {/* Text Input Form */}
                <div className="flex flex-col rounded-xl flex-[8] bg-white">
                    <textarea
                    placeholder="Съобщение до Qurela"
                    value={input}
                    readOnly
                    className="flex-[8] m-4 outline-none"
                    ></textarea>
                    <div className="flex-[2] flex justify-between m-2">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="select-none bg-platinum-gray rounded-full flex justify-center items-center cursor-pointer text-center text-sm outline-none"
                    >
                        <option value="check">Проверка</option>
                        <option value="question">Въпрос</option>
                        <option value="summarize">Обобщение</option>
                    </select>
                    <button
                        className="aspect-square bg-marian-blue rounded-full flex justify-center items-center cursor-pointer"
                        title="Изпращане"
                    >
                        <Image src={ArrowRight} alt=" " />
                    </button>
                    </div>
                </div>

                {/* Response Display */}
                <div className="bg-white rounded-xl flex-[7] overflow-hidden flex flex-col">
                    <h3 className="flex-[2] border-l-red-500 border-l-[7px] flex items-center">
                    <span className="mx-2 text-base font-semibold">{heading}
                    </span>
                    </h3>
                    <div className="flex-[9] h-max border-l-gray-300 border-l-[7px] flex">
                    <span className="mx-2 my-5 text-sm overflow-y-auto h-[150px] copy-text">
                        <div>
                        <p>{output}</p>
                        </div>
                    </span>
                    </div>

                    <div className="flex-[2] w-full h-[10%] bg-gray-300 flex gap-4 px-4 justify-end">
                    </div>
                </div>
            </div>
        </div>
    </section>

{/* team */}
    <section className='w-full flex bg-[#EBF3FF] justify-center flex-col items-center gap-10 pb-[200px]'>
        <h2 className='text-marian-blue text-2xl font-medium text-center w-full font-medium'>
            Нашият екип
        </h2>
        <div className='flex justify-betweem w-[50%]'>
            <div className='flex-col flex justify-center items-center '>
                <img src="/roblox.png" alt="dfs" width="40%" height="auto" className='pt-[]'/>
                <p className='text-[#2e2e2e] text-lg'>
                    Кирил, 16
                </p>
            </div>

            <div className='flex flex-col justify-center items-center '>
                <img src="/roblox.png" alt="dfs" width="40%" height="auto" className='pt-[]'/>
                <p className='text-[#2e2e2e] text-lg'>
                    Християн, 16
                </p>
            </div>
        </div>
    </section>
{/* 
    <section className='w-[100vw] bg-[#EBF3FF] flex flex-col gap-8 justify-center items-center h-[500px] rounded-xl overflow-hidden'>
    <div className="w-full h-full overflow-hidden flex justify-center items-center">
        <img src="/people.png" className="hover:scale-110 transition-transform duration-300 w-full h-auto" />
    </div>

    <h2 className='text-white text-3xl font-semibold'>Имаш още въпроси?</h2>

    <div className='flex gap-4 select-none'>
        <Link href='/auth/signup' className='px-4 py-3 rounded-2xl bg-safety-orange text-white text-lg flex items-center justify-center'>
            <span className='text-white'>Да започваме!</span>
        </Link>
        <Link href='/info#faq' className='px-8 py-3 rounded-2xl bg-marian-blue text-white text-lg flex items-center justify-center'>
            <span className='text-white'>ЧЗВ</span>
        </Link>
    </div>
</section> */}

<section className='w-[100vw] bg-[#EBF3FF] flex flex-col gap-8 justify-center items-center h-[500px] rounded-xl oveflow-hidden'
style={{ backgroundImage: "url('/people.png')", backgroundSize: 'cover', backgroundPosition: 'center', height: '500px' }}>
{/* <img src="/people.png" className="hover:scale-110 transition-transform duration-300 w-full h-auto" /> */}
    <h2 className='text-white text-3xl font-semibold'>Имаш още въпроси?</h2>

    <div className='flex gap-4 select-none'>
    <Link href='/auth/signup' className='px-4 py-3 rounded-2xl bg-safety-orange text-white text-lg flex items-center justify center'>
        <span className='text-white'>Да започваме!</span>
    </Link>
    <Link href='/info#faq' className='px-8 py-3 rounded-2xl bg-marian-blue text-white text-lg flex items-center justify center'>
        <span className='text-white'>ЧЗВ</span>
    </Link>
    </div>

</section>


    </main>
  );
}
