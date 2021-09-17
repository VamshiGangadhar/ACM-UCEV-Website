import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
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

export default Layout;
