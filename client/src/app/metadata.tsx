import Head from "next/head";

export default function Metadata() {
  return (
    <Head>
      {/* Basic Metadata */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Qurela</title>
      <meta name="description" content="Welcome to Qurela!" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content="Qurela" />
      <meta property="og:description" content="Проверена медицинска информация на едно място." />
      <meta property="og:image" content="https://www.qurela.com/people.jpg" />
      <meta property="og:url" content="https://www.qurela.com/" />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Qurela" />
      <meta name="twitter:description" content="Проверена медицинска информация на едно място." />
      <meta name="twitter:image" content="https://www.qurela.com/people.jpg" />
      <meta name="twitter:url" content="https://www.qurela.com/" />
    </Head>
  );
}
