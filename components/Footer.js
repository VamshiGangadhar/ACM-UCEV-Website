import React from "react";
import { Button } from "primereact/button";
function Footer() {
  return (
    <>
      <div className="footer">
        <div className="footer__colContainer">
          <div className="footer__contact">
            <h3 className="footer__colContentTitle">Contact</h3>
            <p>
              IT Dept - JNTU Vizainagaram AB2 Block <br /> Vizainagaram, AP - 201313, India
            </p>
            <p>Email: hod.it@jntukucev.ac.in</p>
          </div>
          <div className="footer__about">
            <h3 className="footer__colContentTitle">About</h3>
            <p>
              ACM, The world&apos;s largest educational and scientific computing society, delivers resources that
              advance computing as a science and profession.
            </p>
          </div>
          <div className="footer__social">
            <h3 className="footer__colContentTitle">Social</h3>
            <div className="footer__socialBtns">
              <Button className="footer__socialBtn p-button-outlined" label="Youtube" icon="pi pi-youtube" />
              <Button className="footer__socialBtn p-button-outlined" label="Facebook" icon="pi pi-facebook" />
              <Button className="footer__socialBtn p-button-outlined" label="Twitter" icon="pi pi-twitter" />
              <Button className="footer__socialBtn p-button-outlined" label="Instagram" icon="pi pi-info-circle" />
            </div>
          </div>
        </div>
        <div className="footer__topper">
          Copyright ©{new Date().getFullYear()}, JNTUK UCEV ACM Student Chapter. Designed by Srujan
        </div>
      </div>
      <style jsx global>{`
        .footer {
          background-color: #495057;
          color: #eeeeee;
        }
        .footer__topper {
          padding: 20px;
          background-color: #424649;
          text-align: center;
          color: #b1b1b1;
        }
        .footer__colContainer {
          display: flex;
          justify-content: space-around;
          padding: 30px 20px 10px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer__colContentTitle {
          margin-bottom: 10px;
          font-size: 19px;
          color: #eeeeee;
        }
        .footer__about,
        .footer__contact,
        .footer__social {
          flex: 1;
        }
        .footer__contact p,
        .footer__about p {
          line-height: 1.2;
          color: #bbbbbb;
        }
        .footer__socialBtns {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          height: 100px;
          gap: 5px;
        }
        .footer__socialBtn {
          color: #bbbbbb !important;
        }
        @media only screen and (max-width: 400px) {
          .footer__colContainer {
            flex-direction: column;
            gap: 15px;
          }
          .footer__colContentTitle {
            font-size: 17px;
            text-align: center;
          }
          .footer__contact p,
          .footer__about p {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
