import React from "react";
import { Galleria } from "primereact/galleria";

function aboutChapter() {
  let itemTemplate = (item) => {
    return (
      <img
        src={item?.src}
        alt={item?.alt}
        className="aboutChapter__galleryImage"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
    );
  };
  return (
    <>
      <div className="aboutChapter">
        <div className="aboutChapter__gallery">
          <Galleria
            value={[
              { src: "https://source.unsplash.com/random/1600x900", alt: "alt tag" },
              { src: "https://source.unsplash.com/random/1601x900", alt: "alt tag" },
              { src: "https://source.unsplash.com/random/1602x900", alt: "alt tag" },
              { src: "https://source.unsplash.com/random/1603x900", alt: "alt tag" },
              { src: "https://source.unsplash.com/random/1604x900", alt: "alt tag" },
            ]}
            showItemNavigators
            showThumbnails={false}
            item={itemTemplate}
            numVisible={5}
            circular
            autoPlay
            transitionInterval={2000}
          />
        </div>
        <div className="aboutChapter__content">
          <h1 className="aboutChapter__title">About our Chapter</h1>
          <p className="aboutChapter__text">
            ACM Student Chapter, JNTUK UCEV is an official student body inaugurated in 2021 under the University Collage
            JNTUK UCEV. The chapter will conduct events including programming contests, talks by renowned speakers,
            workshops etc.which give the students an exposure to the competitive computing world as well as allow them
            to understand the advancements going on in the computing sphere worldwide.
          </p>
        </div>
      </div>
      <style jsx global>{`
        .aboutChapter {
          display: flex;
          max-width: 1200px;
          margin: 20px auto;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          margin-top: 50px;
        }
        .aboutChapter__gallery {
          flex: 4;
        }
        .p-galleria,
        .p-galleria-content,
        .p-galleria-item-wrapper,
        .p-galleria-item-container,
        .aboutChapter__galleryImage {
          height: 100%;
        }
        .p-galleria-item-nav {
          top: 40%;
        }
        .aboutChapter__galleryImage {
          min-width: min(300px, 80vw);
          min-height: 100%;
          background-color: #ccc;
        }
        .aboutChapter__content {
          flex: 3;
          padding: 60px;
          background-color: #eee;
        }
        .aboutChapter__title {
          font-size: 30px;
          margin-bottom: 20px;
          color: #3792c1;
        }
        .aboutChapter__text {
          font-size: min(18px, 5vw);
          color: #222222;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        @media only screen and (max-width: 700px) {
          .aboutChapter {
            flex-direction: column;
          }
          .aboutChapter__content {
            padding: 30px;
          }
          .aboutChapter__galleryImage {
            min-height: 300px;
          }
        }
      `}</style>
    </>
  );
}

export default aboutChapter;
