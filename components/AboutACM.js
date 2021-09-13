import React from "react";

function AboutACM() {
  return (
    <>
      <div className="aboutACM">
        <h1 className="aboutACM__title">About ACM</h1>
        <p className="aboutACM__text">
          ACM, The world's largest educational and scientific computing society, delivers resources that advance
          computing as a science and profession. ACM provides the computing field's premier Digital Library and serves
          its members and the computing profession with leading-edge publications, conferences anc career resources.
        </p>
        <p className="aboutACM__text">
          Chapters are the "local neighborhoods" of ACM. Professional and Student chapters worldwide serve as nodes of
          activity for ACM members and the computing community at large, offering seminars, lectures, and the
          opportunity to meet peers and experts in many fields of interest.
        </p>
      </div>
      <style jsx>{`
        .aboutACM {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .aboutACM__title {
          font-size: 30px;
          margin-bottom: 20px;
          color: #3792c1;
        }
        .aboutACM__text {
          font-size: clamp(18px, 14px, 12px);
          color: #222222;
          line-height: 1.5;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
}

export default AboutACM;
