import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

function MetaTags({
  title,
  description,
  image,
  keywords,
  author,
  APPLICATION_URL,
}) {
  let router = useRouter();
  return (
    <Head>
      {/* <!-- HTML Meta Tags --> */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}
      {keywords && <meta name="keywords" content={keywords.join(",")} />}

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content={APPLICATION_URL + router.asPath} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? title : "ACM UCEV"} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={APPLICATION_URL} />
      <meta property="twitter:url" content={APPLICATION_URL + router.asPath} />
      <meta name="twitter:title" content={title ? title : "ACM UCEV"} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
MetaTags.defaultProps = {
  title: "ACM UCEV",
  description:
    "ACM, The world's largest educational and scientific computing society, delivers resources that advance computing as a science and profession.",
  image: "https://i.imgur.com/YAkFbRA.png",
};
export default MetaTags;
