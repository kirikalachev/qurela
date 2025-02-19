'use client';

import { useState } from 'react';

export default function Info() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="flex flex-col items-center pt-[5%] min-h-[100vh] px-6 text-rich-black dark:text-d-cadet-gray">
            {/* About Us Section */}
            <section id="about-us" className="max-w-3xl text-center my-10">
                <h2 className="text-3xl font-semibold text-marian-blue mb-4">За нас</h2>
                <p className="text-lg leading-relaxed">
                    Добре дошли в <strong>Qurela</strong> – вашето място за интелигентна навигация в здравето!
                    Нашата платформа е създадена, за да ви предостави точна, полезна и достъпна информация,
                    съчетана с интуитивен дизайн и мощни инструменти.
                </p>
            </section>

            {/* Functionality Section */}
            <section id="functionality" className="max-w-3xl text-center my-10">
                <h2 className="text-3xl font-semibold text-marian-blue mb-4">Функционалности</h2>
                <ul className="text-lg leading-relaxed list-disc list-inside">
                    <li>🩺 AI-базиран медицински асистент</li>
                    <li>📝 Лесно управление на потребителския профил</li>
                    <li>📢 Дискусионен форум за здравни теми</li>
                    <li>🔒 Сигурна автентикация и защита на данните</li>
                    <li>📬 Автоматизирана система за известия и напомняния</li>
                </ul>
            </section>

            {/* Instructions Section */}
            <section id="instructions" className="max-w-3xl text-center my-10">
                <h2 className="text-3xl font-semibold text-marian-blue mb-4">Как да използвате приложението?</h2>
                <p className="text-lg leading-relaxed mb-4">
                    Нашето приложение предлага лесен и интуитивен начин за работа. Следвайте стъпките по-долу, за да се възползвате от всичките му функции:
                </p>
                <ul className="text-lg leading-relaxed list-disc list-inside text-left">
                    <li><strong>Проверка:</strong> Въведете симптоми или запитване, и AI асистентът ще ви предостави информация и насоки.</li>
                    <li><strong>Обобщаване:</strong> Платформата автоматично анализира и обобщава ключовите данни от вашите кореспонденции.</li>
                    <li><strong>Въпроси:</strong> Можете да задавате последващи въпроси за по-задълбочена информация.</li>
                    <li><strong>Автоматично запазване:</strong> Всички ваши взаимодействия се запазват автоматично, така че винаги можете да ги прегледате, редактирате или изтривате.</li>
                    <li><strong>Изтегляне на кореспонденции:</strong> Ако желаете, можете да изтеглите разговорите си под формата на текстов документ.</li>
                </ul>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="max-w-3xl overflow-hidden my-10">
                <h2 className="text-3xl font-semibold text-marian-blue mb-6">Често задавани въпроси</h2>
                <div className="flex gap-4 flex-col w-[600px]">
                    {[ 
                        { question: "Как да се регистрирам?", answer: "Просто натиснете бутона \"Регистрация\" и следвайте инструкциите." },
                        { question: "Как мога да нулирам паролата си?", answer: "Отидете в секцията \"Забравена парола\" и следвайте стъпките." },
                        { question: "Безопасни ли са личните ми данни?", answer: "Да! Използваме най-съвременни технологии за криптиране и защита." }
                    ].map((item, index) => (
                        <div key={index} className="bg-platinum-gray text-rich-black rounded-lg dark:bg-d-charcoal">
                            <h3 className="dark:text-d-cadet-gray text-lg font-medium cursor-pointer p-3" onClick={() => toggleAnswer(index)}>
                                {item.question}
                            </h3>
                            <p className={`dark:text-d-cadet-gray w-full px-3 mt-2 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-12 py-3' : 'max-h-0 py-0'}`}>{item.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
