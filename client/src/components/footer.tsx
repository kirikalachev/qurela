import Link from 'next/link';

export default function Footer() {
    return (
      <footer className='bg-rich-black border-t-[5px] border-marian-blue'>
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
              <li><Link href='/info#about-us'>За нас</Link></li>
              <li><Link href='/info#features'>Функционалности</Link></li>
              <li><Link href='/info#faq'>Често задавани въпроси</Link></li>
c
              </ul>
            </div>
  
            <div className='flex-1'>
              <h2 className='uppercase font-semibold text-lg'>ресурси</h2>
              <ul>
                <li>
                  <Link href='/auth/signin'>Вход</Link>
                </li>
                <li>
                  <Link href='/auth/signup'>Регистрация</Link>
                </li>
                <li>
                  <Link href='/resources#privacy-policy'>Политика за поверителност</Link>
                </li>
                <li>
                  <Link href='/resources#terms-of-use'>Условия на ползване</Link>
                </li>
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