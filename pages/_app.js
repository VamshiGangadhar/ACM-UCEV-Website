import "../styles/globals.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import NProgress from "nprogress";
import Head from "next/head";
import Router from "next/router";
Router.events.on("routeChangeStart", (url) => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" type="text/css" href="/styles/nprogress.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
