import React from "react";
import Head from "next/head";

function MetaTags({
  title,
  description,
  image,
  path,
  keywords,
  author,
  APPLICATION_URL,
}) {
  return (
    <Head>
      {/* <!-- HTML Meta Tags --> */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}
      {keywords && <meta name="keywords" content={keywords.join(",")} />}

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content={APPLICATION_URL + path} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? title : "ACM UCEV"} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={APPLICATION_URL} />
      <meta property="twitter:url" content={APPLICATION_URL + path} />
      <meta name="twitter:title" content={title ? title : "ACM UCEV"} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}

export default MetaTags;
