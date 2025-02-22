'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import ArrowRight from '@/app/arrow-right.svg';
import Image from 'next/image';

const YourComponent = () => {
  // Контролира избраната опция в select
  const [selectedType, setSelectedType] = useState("check");
  // Показваната опция (актуализира се след 2 секунди)
  const [activeType, setActiveType] = useState("check");
  // Състояние за зареждане
  const [isLoading, setIsLoading] = useState(false);

  const data = {
    question: {
      heading: 'Средната телесна температура при човек', 
      input: "Каква е нормалната телесна температура при възрастен човек?", 
      output: "Нормалната телесна температура при възрастен човек обикновено е около 36.5 – 37.5°C, но може леко да варира в зависимост от времето на деня и индивидуалните особености."
    },
    check: {
      heading: 'Студената вода причинява ангина', 
      input: "Пиенето на студена вода причинява ангина.", 
      output: "Ангината се причинява от вируси или бактерии, а не от температурата на водата. Студените напитки могат временно да раздразнят гърлото, но не водят до инфекция."
    },
    summarize: {
      heading: 'Съкратен текст: Витамин C',
      input: `Витамин C е основно хранително вещество, което играе ключова роля в поддържането на имунната система. Той помага за образуването на колаген, подобрява усвояването на желязото и действа като антиоксидант, предпазвайки клетките от увреждане. Недостигът на витамин C може да доведе до скорбут – състояние, което причинява слабост, кървене на венците и проблеми с зарастването на рани. Най-добрите източници на витамин C са цитрусовите плодове, ягодите, чушките и броколите.`,
      output: `Витамин C подпомага имунитета, образуването на колаген и усвояването на желязото. Недостигът му може да причини скорбут. Основни източници са цитрусите, ягодите и чушките.`
    }
  };

  // Извличаме съдържанието от данните според activeType
  const { input, output: dataOutput, heading } = data[activeType];

  const handleChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    setIsLoading(true);
    setActiveType(newType);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className='p-12 flex-1'>
      <h2 className='text-marian-blue text-2xl font-medium'>
        Демо
      </h2>
      <div className="text-gray-800 flex gap-6 flex-col h-[300px]">
        {/* Text Input Form */}
        <div className="flex flex-col rounded-xl flex-[8] bg-white">
          <textarea
            placeholder="Съобщение до Qurela"
            readOnly
            className="flex-[8] m-4 outline-none"
            value={input}
          ></textarea>
          <div className="flex-[2] flex justify-between m-2">
            <select
              value={selectedType}
              onChange={handleChange}
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
        <div className="bg-white h-full rounded-xl flex-[7] overflow-hidden flex flex-col">
  {isLoading ? (
    <div className="flex flex-1 items-center justify-center">
      <motion.div
        className="w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  ) : (
    <>
      <h3 className="flex-[2] border-l-red-500 border-l-[7px] flex items-center">
        <span className="mx-2 text-base font-semibold">{heading}</span>
      </h3>
      <div className="flex-[9] h-max border-l-gray-300 border-l-[7px] flex items-center justify-center">
        <span className="mx-2 my-5 text-sm overflow-y-auto h-[150px] copy-text">
          <div>
            <p>{dataOutput}</p>
          </div>
        </span>
      </div>
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default YourComponent;
