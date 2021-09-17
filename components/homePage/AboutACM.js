import React from "react";

function AboutACM() {
  return (
    <>
      <div className="aboutACM">
        <h1 className="aboutACM__title">About ACM</h1>
        <p className="aboutACM__text">
          ACM, The world&apos;s largest educational and scientific computing society, delivers resources that advance
          computing as a science and profession. ACM provides the computing field&apos;s premier Digital Library and
          serves its members and the computing profession with leading-edge publications, conferences anc career
          resources.
        </p>
        <p className="aboutACM__text">
          Chapters are the &quot;local neighborhoods&quot; of ACM. Professional and Student chapters worldwide serve as
          nodes of activity for ACM members and the computing community at large, offering seminars, lectures, and the
          opportunity to meet peers and experts in many fields of interest.
        </p>
      </div>
      <style jsx>{`
        .aboutACM {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        .aboutACM__title {
          font-size: min(30px, 9vw);
          margin-bottom: 20px;
          color: #3792c1;
        }
        .aboutACM__text {
          font-size: min(18px, 4.8vw);
          color: #222222;
          line-height: 1.5;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
}

export default AboutACM;
