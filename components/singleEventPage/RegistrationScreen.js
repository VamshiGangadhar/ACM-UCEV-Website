import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import loadScript from "../../utils/loadScript";
import { ProgressSpinner } from "primereact/progressspinner";

function RegistrationScreen({
  setOpenRegistrationScreen,
  openRegistrationScreen,
  event_id,
  event_description,
  event_price,
  event_name,
  event_tags,
  start_time,
  end_time,
  APPLICATION_URL,
  RAZORPAY_KEY_ID,
  setRegistrationSuccessModal,
}) {
  // FORM DATA STATE
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collageName, setCollageName] = useState("");
  const [className, setClassName] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);

  // LOAD RAZORPAY SCRIPT IF EVENT HAS PRICE AT STARTUP
  useEffect(() => {
    async function loadRazorpayScript() {
      if (event_price != 0) {
        {
          // LOAD THE RAZOR PAY SCRIPT
          const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
          );
          if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
          }
        }
      }
    }
    loadRazorpayScript();
  }, []);

  // WHEN REGISTER BTN CLICKED
  const handleRegisterClick = async () => {
    setLoading(true);
    if (event_price == 0) {
      // TODO: SEND DATA TO SERVER

      // SET THE REGISTRATION SUCCESS MODAL TO TRUE
      setRegistrationSuccessModal(true);
      setLoading(false);
      setOpenRegistrationScreen(false);
    } else {
      // CREATE A NEW ORDER BY REQUESTING THE SERVER
      const result = await fetch(`${APPLICATION_URL}/api/payment`, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          event_id: event_id,
          amount: event_price * 100,
          currency: "INR",
        }),
      });
      if (!result) {
        alert("Server error. Are you online?");
        return;
      }
      const order = await result.json();
      const { amount, id: order_id, currency } = order;
      // CREATE A NEW INSTANCE OF RAZOR PAY OBJECT WITH THE ORDER_ID CREATED BEFORE
      const paymentObject = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: event_name,
        description: event_description,
        order_id: order_id,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        notes: {
          event_id: event_id,
          event_name: event_name,
          name: fullName,
          email: email,
          phone: phone,
          collageName: collageName,
          className: className,
          branch: branch,
        },
        theme: {
          color: "#3792C1",
        },
        // CALLBACK FUNCTION TO BE CALLED WHEN THE PAYMENT IS SUCCESSFUL
        handler: async function (response) {
          // SEND THE DATA TO THE SERVER FOR VERIFICATION
          const result = await fetch(`${APPLICATION_URL}/api/verification`, {
            method: "POST",
            headers: {},
            body: JSON.stringify({
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          let resultData = await result.json();
          // IF VERIFICATION DONE, SHOW SUCCESS MODAL
          if (result.status == 200) {
            setRegistrationSuccessModal(true);
            setOpenRegistrationScreen(false);
          } else {
            // IF VERIFICATION FAILED, SHOW ERROR MODAL
            toast.current.show({
              severity: "error",
              summary: "Registration Failed",
              detail: `${resultData.msg}. Please contact event managers for any queries about this payment.`,
            });
          }
        },
      });

      // OPEN THE PAYMENT WINDOW
      setLoading(false);
      paymentObject.open();
    }
  };

  return (
    <>
      <Dialog
        className="registrationScreenDialog"
        visible={openRegistrationScreen}
        breakpoints={({ "960px": "75vw" }, { "400px": "90vw" })}
        style={{ width: "40vw" }}
        header={
          <Image
            className="nav__acmLogo"
            src="/imgs/acm-logo.svg"
            width={200}
            height={75}
            alt="ACM logo"
          />
        }
        draggable={false}
        maximized
        onHide={() => setOpenRegistrationScreen(false)}
      >
        <div className="registrationScreen">
          <div className="registrationScreen__left">
            <h1 className="registrationScreen__title">Registration</h1>
            <h2 className="registrationScreen__EventTitle">{event_name}</h2>
            <div className="registrationScreen__eventType">
              <h3 className="registrationScreen__eventTypeTitle">Event Type</h3>
              <p className="registrationScreen__eventTypeDetail">
                {event_tags?.map((tag, index) => (
                  <Chip
                    className="eventDetails_eventType"
                    key={index}
                    label={tag.Tag_name}
                  />
                ))}
              </p>
            </div>
            <div className="registrationScreen__timings">
              <h3 className="registrationScreen__timingsTitle">
                Event Duration
              </h3>
              <div className="registrationScreen__timingsWrapper">
                <div className="registrationScreen__startTime">
                  <b>Starts at</b>
                  <p>{format(new Date(start_time), "do MMM yy - HH:mm")}</p>
                </div>
                <div className="registrationScreen__endTime">
                  <b>Ends at</b>
                  <p>{format(new Date(end_time), "do MMM yy - HH:mm")}</p>
                </div>
              </div>
            </div>
          </div>
          <form
            className="registrationScreen__right"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegisterClick();
            }}
          >
            {loading && (
              <>
                <div className="registrationScreen__overlay" />
                <ProgressSpinner
                  className="registrationScreen__loader"
                  style={{ width: "50px", height: "50px" }}
                  strokeWidth="8"
                  fill="var(--surface-ground)"
                  animationDuration=".5s"
                />
              </>
            )}
            <div className="registrationScreen__field">
              <label htmlFor="fullName" className="registrationScreen__label">
                Full Name
              </label>
              <InputText
                required
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="enter your full name"
                className="registrationScreen__input"
                type="text"
              />
            </div>
            <div className="registrationScreen__field">
              <label htmlFor="email" className="registrationScreen__label">
                Email
              </label>
              <InputText
                placeholder="enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="registrationScreen__input"
                type="email"
              />
            </div>
            <div className="registrationScreen__field">
              <label htmlFor="phone" className="registrationScreen__label">
                Phone
              </label>
              <InputText
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="enter your phone number"
                id="phone"
                className="registrationScreen__input"
                type="tel"
              />
            </div>
            <div className="registrationScreen__field">
              <label
                htmlFor="collageName"
                className="registrationScreen__label"
              >
                Collage Name
              </label>
              <InputText
                required
                value={collageName}
                onChange={(e) => setCollageName(e.target.value)}
                id="collageName"
                className="registrationScreen__input"
                type="text"
              />
            </div>
            <div className="registrationScreen__fieldFlexWrapper">
              <div className="registrationScreen__field">
                <label
                  htmlFor="className"
                  className="registrationScreen__label"
                >
                  Class Name
                </label>
                <InputText
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  id="collageName"
                  placeholder="eg: B.Tech/Degree/PG"
                  className="registrationScreen__input"
                  type="text"
                />
              </div>
              <div className="registrationScreen__field">
                <label htmlFor="branch" className="registrationScreen__label">
                  Branch
                </label>
                <InputText
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="eg: IT/CSE/ECE/EEE"
                  id="branch"
                  className="registrationScreen__input"
                  type="text"
                />
              </div>
            </div>
            <div className="registrationScreen__field">
              <Button
                label={
                  event_price == 0 ? "Register" : "Pay" + " ₹" + event_price
                }
                className="registrationScreen__RegisterButton"
                type="submit"
              />
            </div>
          </form>
        </div>
      </Dialog>

      <style jsx global>{`
        .registrationScreen {
          display: flex;
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .registrationScreen__left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .registrationScreen__title {
          font-size: 30px;
          color: #3792c1;
          margin-bottom: 20px;
          font-weight: 200;
        }
        .registrationScreen__EventTitle {
          font-size: 40px;
        }
        .registrationScreen__timingsTitle,
        .registrationScreen__eventTypeTitle {
          font-size: 20px;
          margin-top: 20px;
          margin-bottom: 10px;
          font-weight: 400;
        }
        .registrationScreen__timingsWrapper {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .registrationScreen__startTime,
        .registrationScreen__endTime {
          padding: 10px;
          border-radius: 5px;
          background-color: #98dcfd;
        }
        .registrationScreen__endTime {
          background-color: #d8bc71;
        }
        .registrationScreen__right {
          flex: 3;
          background-color: #eeeeee;
          padding: 30px 20px;
          border-radius: 12px;
          border: 1px solid #cccccc;
        }
        .registrationScreen__right,
        .registrationScreen__field {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 500px;
        }
        .registrationScreen__right {
          position: relative;
        }
        .registrationScreen__overlay {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 8px;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .registrationScreen__loader {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .registrationScreen__field {
          width: 100%;
        }
        .registrationScreen__fieldFlexWrapper {
          display: flex;
          gap: 10px;
        }
        .registrationScreen__RegisterButton {
          margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
          .registrationScreen {
            flex-direction: column;
          }
          .p-component-overlay {
            background-color: ${openRegistrationScreen && "#ffffff !important"};
          }
          .p-dialog {
            box-shadow: ${openRegistrationScreen && "none"};
          }
          .p-dialog-header {
            padding-bottom: ${openRegistrationScreen && "0"};
          }
          .registrationScreen__fieldFlexWrapper {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default RegistrationScreen;
