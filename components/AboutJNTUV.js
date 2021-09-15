import React from "react";

function AboutJNTUV() {
  return (
    <>
      <div className="aboutJNTUV">
        <h1 className="aboutJNTUV__title">About JNTUK UCEV</h1>
        <p className="aboutJNTUV__text">
          The JNTUK University College of Engineering Vizianagaram has been established during September 2007 with five
          Under Graduate Engineering Courses Viz., B.Tech. In EEE, ECE, CSE, ME, and IT as a constituent college of
          erstwhile JNTU, Hyderabad. Infrastructure development works Phase I was sanctioned by Govt. to a tune of 28.10
          Crores and commenced the construction work in March, 2008 at Dwarapudi, Vizianagaram with an Academic Block,
          Boys Hostel and Girls Hostel. In the year 2008 (20.08.2008) JNTU Kakinada has been established as a separate
          University with this campus as constituent college and shifted to own campus at Dwarapudi, Vizianagaram during
          June,2009.
        </p>
      </div>
      <style jsx>{`
        .aboutJNTUV {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .aboutJNTUV__title {
          font-size: 30px;
          margin-bottom: 20px;
          color: #3792c1;
        }
        .aboutJNTUV__text {
          font-size: min(18px, 5vw);
          color: #222222;
          line-height: 1.5;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
}

export default AboutJNTUV;
