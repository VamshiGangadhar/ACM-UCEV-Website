import React from "react";
import Footer from "./Footer";
import MetaTags from "./MetaTags";
import Navbar from "./Navbar";

function Layout({
  children,
  metaTitle,
  metaDescription,
  metaImage,
  metaKeywords,
  metaAuthor,
  APPLICATION_URL,
}) {
  return (
    <>
      <MetaTags
        title={metaTitle}
        description={metaDescription}
        image={metaImage}
        keywords={metaKeywords}
        author={metaAuthor}
        APPLICATION_URL={APPLICATION_URL}
      />
      <div className="layout">
        <Navbar />
        {children}
        <Footer className="footer" />
      </div>
      <style jsx global>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .footer {
          margin-top: auto;
        }
      `}</style>
    </>
  );
}
Layout.defaultProps = {
  metaTitle: "ACM UCEV",
  metaDescription:
    "ACM, The world's largest educational and scientific computing society, delivers resources that advance computing as a science and profession.",
  metaImage: "https://i.imgur.com/YAkFbRA.png",
};
export default Layout;
