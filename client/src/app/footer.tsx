import Link from 'next/link';

export default function Footer() {
    return (
      <footer className='bg-rich-black mt-5 border-t-[5px] border-marian-blue'>
          <div className='flex items-top py-[3%] px-[5%] flex-wrap'>
            <div className='flex-1'>
              <h2 className='text-2xl font-semibold'>Qurela</h2>
              <p className='w-[70%]'>
              Unik е уеб приложение, което има за цел борба с дезинформацията в медицинската сфера
              </p>
            </div>
  
            <div className='flex-1'>
              <h2 className='uppercase font-semibold text-lg'>информация</h2>
              <ul>
                <li><Link href='/'>Начало</Link></li>
                <li>За нас</li>
                <li>Функционалности</li>
                <li>Често задавани въпроси</li>
              </ul>
            </div>
  
            <div className='flex-1'>
              <h2 className='uppercase font-semibold text-lg'>ресурси</h2>
              <ul>
              <li>
                  <Link href='/auth'>Регистрация / Вход</Link>
                </li>
                <li>Политика за поверителност</li>
                <li>Условия на ползване</li>
              </ul>
            </div>
  
            <div className='flex-1'>
              <h2 className='uppercase font-semibold text-lg'>свържи се с нас</h2>
              <ul>
                <li>Facebook</li>
                <li>qurela@info.com</li>
              </ul>
            </div>
          </div>
  
          <div className='w-full text-center'>
          &copy; 2025 Qurela. Всички права запазени
          </div>
      </footer>
    )
  }