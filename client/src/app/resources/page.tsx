'use client';

export default function PolicyPage() {
  return (
    <main className="flex flex-col items-center pt-[5%] min-h-[100vh] px-6 text-rich-black dark:text-d-cadet-gray">
      {/* Политика за поверителност */}
      <section id="privacy-policy" className="max-w-3xl my-10">
      <br></br><br></br><br></br>
        <h2 className="text-3xl font-semibold text-marian-blue mb-4 dark:text-d-cadet-gray">Политика за поверителност</h2>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Ние в Qurela се стремим да защитим личната Ви информация и да осигурим прозрачност относно начина, по който събираме, използваме и съхраняваме данните Ви. Тази политика за поверителност описва каква информация събираме, защо го правим и какви мерки предприемаме за Вашата сигурност.
        </p>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">1. Събиране и използване на данни</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Ние събираме информация, която може да включва, но не се ограничава до:
        </p>
        <ul className="list-disc list-inside text-lg mb-4 dark:text-d-cadet-gray">
          <li className="dark:text-d-cadet-gray">Лични данни – име, имейл адрес, телефонен номер и други данни, които доброволно предоставяте;</li>
          <li className="dark:text-d-cadet-gray">Данни за използване – информация за това как използвате платформата, включително предпочитания и настройки;</li>
          <li className="dark:text-d-cadet-gray">Техническа информация – данни, свързани с устройството и интернет връзката Ви (например IP адрес, тип браузър, операционна система).</li>
        </ul>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Тези данни се използват за подобряване на услугите ни, персонализиране на съдържанието и осигуряване на сигурност при достъпа до платформата.
        </p>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">2. Сигурност и споделяне на данни</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Ние използваме съвременни технологии за криптиране и защитни мерки, за да предпазим личните Ви данни. Вашата информация няма да бъде продадена или предоставяна на трети страни, освен ако това е необходимо за:
        </p>
        <ul className="list-disc list-inside text-lg mb-4 dark:text-d-cadet-gray">
          <li className="dark:text-d-cadet-gray">Изпълнение на договорни задължения към Вас;</li>
          <li className="dark:text-d-cadet-gray">Спазване на законови и регулаторни изисквания;</li>
          <li className="dark:text-d-cadet-gray">Защитата на нашите права и собственост.</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">3. Права на потребителите</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Вие имате право да:
        </p>
        <ul className="list-disc list-inside text-lg mb-4 dark:text-d-cadet-gray">
          <li className="dark:text-d-cadet-gray">Достъпвате и коригирате личните си данни;</li>
          <li className="dark:text-d-cadet-gray">Изискате изтриване на данните си;</li>
          <li className="dark:text-d-cadet-gray">Ограничите обработката на данните или да поискате тяхната преносимост.</li>
        </ul>
        <p className="text-lg leading-relaxed dark:text-d-cadet-gray">
          За допълнителна информация или въпроси относно нашата политика за поверителност, моля, свържете се с нашия екип.
        </p>
      </section>

      {/* Условия на ползване */}
      <section id="terms-of-use" className="max-w-3xl my-10 dark:text-d-cadet-gray">
        <h2 className="text-3xl font-semibold text-marian-blue mb-4 dark:text-d-cadet-gray">Условия на ползване</h2>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          С използването на платформата Qurela вие се съгласявате с настоящите условия. Моля, прочетете ги внимателно, тъй като те уреждат начина, по който вие използвате нашите услуги.
        </p>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">1. Приемане на условията</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Като използвате нашата платформа, вие потвърждавате, че сте запознати с условията и се съгласявате да ги спазвате. Ако не сте съгласни с тях, моля, не използвайте услугите ни.
        </p>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">2. Използване на услугите</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Qurela предоставя информация и инструменти, свързани със здравеопазването, които не заменят професионален медицински съвет. Използването на нашата платформа е изцяло на Ваш риск, а ние не носим отговорност за никакви решения, взети на базата на предоставената информация.
        </p>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">3. Права и отговорности на потребителите</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Вие се съгласявате да използвате платформата само за законни цели и да не нарушавате правата на други потребители или трети страни. Забранено е:
        </p>
        <ul className="list-disc list-inside text-lg mb-4 dark:text-d-cadet-gray">
          <li className="dark:text-d-cadet-gray">Публикуването на незаконно, обидно или вредно съдържание;</li>
          <li className="dark:text-d-cadet-gray">Опити за злоупотреба с платформата или за заобикаляне на защитни мерки;</li>
          <li className="dark:text-d-cadet-gray">Нарушаване на интелектуалната собственост на други лица.</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">4. Ограничаване на отговорността</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Всички услуги се предоставят „както са“ и Qurela не гарантира, че те ще бъдат безпроблемни или безгрешни. Ние не носим отговорност за никакви загуби или щети, произтичащи от използването на платформата.
        </p>

        <h3 className="text-2xl font-semibold mb-2 dark:text-d-cadet-gray">5. Промени в условията</h3>
        <p className="text-lg leading-relaxed mb-4 dark:text-d-cadet-gray">
          Ние си запазваме правото да променяме тези условия по всяко време. Всяка промяна ще бъде публикувана на тази страница и ще влезе в сила веднага след публикуването.
        </p>

        <p className="text-lg leading-relaxed dark:text-d-cadet-gray">
          Благодарим Ви, че използвате Qurela! {true ? '<3' : ""}
        </p>
      </section>
    </main>
  );
}
