'use client';
import Link from "next/link";
import { useState } from "react";
import CreatePost from "../../components/createPost/createPost";
import { useCreatePost } from "@/context/CreatePostContext";

export default function Home() {

    const { openPost } = useCreatePost();
    return (
        <div className="pt-[10%] min-h-screen flex flex-col md:flex-row gap-6 p-6 "> 
        {/* bg-gray-100 */}
            {/* Лява секция - Публикации */}
            <div className="md:w-2/3 flex flex-col gap-6">
                {/* Търсачка и бутон */}
                <div className="bg-white dark:bg-d-rich-black p-4 rounded-xl shadow-md flex items-center gap-4">
                    <form className="relative flex-grow flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Търси..."
                            className="dark:bg-d-charcoal w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="absolute right-2 bg-marian-blue text-white p-1 rounded-full">
                            🔍
                        </button>
                    </form>
                    {/* бутон за отваряне на CreatePost */}
                    <button
                    className="bg-safety-orange text-white px-4 py-2 rounded-lg"
                    onClick={openPost}
                    >
                        Създай публикация 
                    </button>
                </div>

                {/* Публикация */}
                <div className=" bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
                    {/* Профилна информация */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Профилна снимка (placeholder) */}
                        <div>
                            <h4 className="font-bold">Име</h4>
                            <p className="text-gray-500 text-sm">Дата на качване</p>
                        </div>
                    </div>

                    {/* Съдържание на поста */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Заглавие на поста</h3>
                        <p className="text-gray-700 dark:text-d-cadet-gray">Съдържание на поста</p>
                    </div>

                    {/* Интеракция */}
                    <div className="flex gap-4 text-sm">
                        <button className="text-gray-600 hover:text-blue-500">👍 Like</button>
                        <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
                        <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
                        <Link href="#" className="text-blue-500 hover:underline">#Тема</Link>
                    </div>
                </div>
                <div className=" bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
                    {/* Профилна информация */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Профилна снимка (placeholder) */}
                        <div>
                            <h4 className="font-bold">Име</h4>
                            <p className="text-gray-500 text-sm">Дата на качване</p>
                        </div>
                    </div>

                    {/* Съдържание на поста */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Заглавие на поста</h3>
                        <p className="text-gray-700 dark:text-d-cadet-gray">Съдържание на поста</p>
                    </div>

                    {/* Интеракция */}
                    <div className="flex gap-4 text-sm">
                        <button className="text-gray-600 hover:text-blue-500">👍 Like</button>
                        <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
                        <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
                        <Link href="#" className="text-blue-500 hover:underline">#Тема</Link>
                    </div>
                </div>
                <div className=" bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
                    {/* Профилна информация */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Профилна снимка (placeholder) */}
                        <div>
                            <h4 className="font-bold">Име</h4>
                            <p className="text-gray-500 text-sm">Дата на качване</p>
                        </div>
                    </div>

                    {/* Съдържание на поста */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Заглавие на поста</h3>
                        <p className="text-gray-700 dark:text-d-cadet-gray">Съдържание на поста</p>
                    </div>

                    {/* Интеракция */}
                    <div className="flex gap-4 text-sm">
                        <button className="text-gray-600 hover:text-blue-500">👍 Like</button>
                        <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
                        <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
                        <Link href="#" className="text-blue-500 hover:underline">#Тема</Link>
                    </div>
                </div>
                <div className=" bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
                    {/* Профилна информация */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Профилна снимка (placeholder) */}
                        <div>
                            <h4 className="font-bold">Име</h4>
                            <p className="text-gray-500 text-sm">Дата на качване</p>
                        </div>
                    </div>

                    {/* Съдържание на поста */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Заглавие на поста</h3>
                        <p className="text-gray-700 dark:text-d-cadet-gray">Съдържание на поста</p>
                    </div>

                    {/* Интеракция */}
                    <div className="flex gap-4 text-sm">
                        <button className="text-gray-600 hover:text-blue-500">👍 Like</button>
                        <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
                        <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
                        <Link href="#" className="text-blue-500 hover:underline">#Тема</Link>
                    </div>
                </div>
                <div className=" bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black dark:text-d-cadet-gray">
                    {/* Профилна информация */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Профилна снимка (placeholder) */}
                        <div>
                            <h4 className="font-bold">Име</h4>
                            <p className="text-gray-500 text-sm">Дата на качване</p>
                        </div>
                    </div>

                    {/* Съдържание на поста */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Заглавие на поста</h3>
                        <p className="text-gray-700 dark:text-d-cadet-gray">Съдържание на поста</p>
                    </div>

                    {/* Интеракция */}
                    <div className="flex gap-4 text-sm">
                        <button className="text-gray-600 hover:text-blue-500">👍 Like</button>
                        <button className="text-gray-600 hover:text-blue-500">💬 Comment</button>
                        <button className="text-gray-600 hover:text-blue-500">🔗 Share</button>
                        <Link href="#" className="text-blue-500 hover:underline">#Тема</Link>
                    </div>
                </div>
            </div>

            {/* Дясна секция - Теми */}
            <div className=" right-0 md:w-1/3 bg-white rounded-2xl shadow-md h-[75vh] overflow-hidden shadow-md">
            <h2 className="w-[100%] bg-jordy-blue p-4 font-semibold text-base">
                Категории</h2>
                  <ul className="dark:bg-d-rich-black h-full overflow-y-auto custom-scrollbar p-4 space-y-2 flex items-stretch flex-col right-0 overflow-y-auto custom-scrollbar w-full bg-white p-4">
                    {[
                        { id: "blank", title: "blank" },
                        { id: "general-medicine", title: "Обща медицина" },
                        { id: "specialized-medicine", title: "Специализирана медицина" },
                        { id: "symptoms-diseases", title: "Симптоми и заболявания" },
                        { id: "medications-treatment", title: "Лекарства и лечение" },
                        { id: "surgery-procedures", title: "Хирургия и процедури" },
                        { id: "healthy-lifestyle", title: "Здравословен живот" },
                        { id: "pregnancy-children", title: "Бременност и детско здраве" },
                        { id: "sexual-health", title: "Полово и урологично здраве" },
                        { id: "mental-health", title: "Психично здраве" },
                        { id: "infectious-diseases", title: "Инфекциозни болести" },
                        { id: "doctors-hospitals", title: "Лекари и болници" },
                    ].map((topic) => (
                        <li key={topic.id}>
                            <a
                                href={`#${topic.id}`}
                                className="block p-2 rounded-lg hover:bg-blue-100 text-brandeis-blue"
                            >
                                {topic.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <CreatePost />
        </div>
    );
}
