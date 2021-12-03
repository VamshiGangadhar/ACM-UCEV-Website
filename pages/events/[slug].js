import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Layout from "../../components/layout/Layout";
import ReactMarkdown from "react-markdown";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import Image from "next/image";
import { useRouter } from "next/router";
import EventDetails from "../../components/singleEventPage/EventDetails";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Lottie from "react-lottie";
import animationData from "../../public/lottie-files/registration-success.json";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import RegistrationScreen from "../../components/singleEventPage/RegistrationScreen";

const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={materialOceanic}
        language={match[1]}
        showLineNumbers
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};
export const getStaticPaths = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
        events {
          Slug
        }
      }
    `,
  });

  const paths = data.events.map((event) => ({
    params: { slug: event.Slug },
  }));

  return {
    paths,
    fallback: false,
  };
};
export const getStaticProps = async ({ params }) => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      {
        events(where: { Slug: "${params.slug}" }) {
          id
          Event_name
          Cover_image {
            url
          }
          Mini_description
          Description
          Start_time
          End_time
          Registration_link
          Registration_price
          event_tags {
            Tag_name
          }
        }
      }
    `,
  });
  return {
    props: {
      data: data.events[0],
      APPLICATION_URL: process.env.APPLICATION_URL,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    },
  };
};

function Event({ data, APPLICATION_URL, RAZORPAY_KEY_ID }) {
  const router = useRouter();
  let toast = React.useRef(null);
  const [openRegistrationScreen, setOpenRegistrationScreen] = useState(false);
  const [registrationSuccessModal, setRegistrationSuccessModal] =
    useState(false);
  const [eventStatus, setEventStatus] = useState({});
  const [registerPrice, setRegisterPrice] = useState("free");
  const [isValid, setIsValid] = useState(true);

  // SET EVENT STATUS BASED ON CURRENT TIME AND FETCHES REGISTRATION PRICE
  useEffect(() => {
    if (Date.now() < new Date(data.Start_time)) {
      setEventStatus({ severity: "info", text: "Upcomming" });
    } else if (
      new Date(data.Start_time) <= Date.now() &&
      Date.now() <= new Date(data.End_time)
    ) {
      setEventStatus({ severity: "warn", text: "Ongoing" });
    } else if (Date.now() > new Date(data.End_time)) {
      setEventStatus({ severity: "error", text: "Completed" });
      setIsValid(false);
    }
    setRegisterPrice(
      data.Registration_price == 0 ? "free" : "Rs. " + data.Registration_price
    );
  }, [data]);

  return (
    <>
      {/* REGISTRATION FORM MODAL */}
      <RegistrationScreen
        setOpenRegistrationScreen={setOpenRegistrationScreen}
        openRegistrationScreen={openRegistrationScreen}
        toast={toast}
        event_name={data.Event_name}
        event_tags={data.event_tags}
        event_id={data.id}
        event_description={data.Mini_description}
        start_time={data.Start_time}
        end_time={data.End_time}
        event_price={data.Registration_price}
        APPLICATION_URL={APPLICATION_URL}
        RAZORPAY_KEY_ID={RAZORPAY_KEY_ID}
        setRegistrationSuccessModal={setRegistrationSuccessModal}
      />
      {/* PAYMENT SUCCESS ANIMATION */}
      <Dialog
        visible={registrationSuccessModal}
        style={{ width: "min(400px, 90%)" }}
        draggable={false}
        onHide={() => setRegistrationSuccessModal(false)}
      >
        <div
          style={{
            width: "90%",
            margin: "0 auto",
            marginBottom: "30px",
          }}
        >
          <Lottie
            style={{ width: "min(150px, 70%)", zIndex: "999" }}
            isClickToPauseDisabled={true}
            options={{
              loop: false,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
          />
          <h1 style={{ fontSize: 30, textAlign: "center" }}>
            Registration Successful
          </h1>
          <p
            style={{
              fontSize: 17,
              textAlign: "center",
              marginTop: 10,
              lineHeight: "1.5",
            }}
          >
            You will get emails for further updates about the event. Hope you
            will have a good time learning with us !
          </p>
        </div>
      </Dialog>
      <Toast ref={toast} />
      <Layout
        metaTitle={data.Event_name}
        metaDescription={data.Mini_description}
        metaImage={data.Cover_image?.url}
        APPLICATION_URL={APPLICATION_URL}
      >
        <div className="event">
          <main className="event__left">
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              className="p-button-text event__goBackButton"
              onClick={() => router.push("/events")}
            />
            <h1 className="event__title">{data.Event_name}</h1>
            {data?.event_tags?.map((tag, index) => (
              <Chip
                className="event__cardChip"
                key={index}
                label={tag.Tag_name}
              />
            ))}
            <div className="event__coverImage">
              <Image
                src={data.Cover_image?.url}
                alt="Event Cover"
                objectFit="cover"
                layout="fill"
              />
            </div>
            <ReactMarkdown
              components={CodeBlock}
              className="event__description"
            >
              {data.Description}
            </ReactMarkdown>
            {isValid && (
              <section className="event__registerSection">
                <h1>Register to This Event</h1>
                <p>
                  To register to this event to participate, Press the Register
                  button below. You will be shown a form for additional details.
                  The registration fees for this event is {registerPrice}
                </p>
                <Button
                  label="Register"
                  icon="pi pi-ticket"
                  onClick={() => setOpenRegistrationScreen(true)}
                  tooltip="opens a form on this same page"
                />
              </section>
            )}
          </main>
          <aside className="event__right">
            <EventDetails
              event_status={eventStatus}
              event_name={data.Event_name}
              event_tags={data.event_tags}
              event_description={data.Mini_description}
              start_time={data.Start_time}
              end_time={data.End_time}
              isValid={isValid}
              registerPrice={registerPrice}
            />
          </aside>
        </div>
      </Layout>

      <style jsx global>{`
        .event {
          padding: 20px;
          max-width: 1200px;
          margin: 40px auto;
          gap: 20px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          height: auto;
        }
        .event__left {
          flex: 2;
        }
        .event__right {
          flex: 1;
        }
        .event__goBackButton {
          margin-bottom: 20px;
          padding: 0;
        }
        .event__title {
          font-size: min(35px, 8vw);
          font-weight: bold;
          margin-bottom: 10px;
        }
        .event__cardChip {
          font-size: min(14px, 3vw);
        }
        .event__coverImage {
          width: 100%;
          height: 300px;
          position: relative;
          margin-top: 20px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #cccccc;
        }
        /* EVENT MARKDOWN STYLES START */
        .event__description {
          background-color: #eeeeee;
          padding: 20px;
          border-radius: 6px;
          margin-top: 20px;
          max-width: 90vw;
        }
        .event__description * {
          max-width: 100%;
        }
        .event__description p {
          font-size: min(16px, 4.5vw);
          line-height: 27px;
          margin: 10px 0;
          color: #222222;
        }
        .event__description h1,
        .event__description h2,
        .event__description h3 {
          color: #444444;
        }
        .event__description h1 {
          font-size: min(28px, 7vw);
          margin-top: 25px;
          margin-bottom: 20px;
        }
        .event__description h2 {
          font-size: min(22px, 6.5vw);
          margin-top: 15px;
          margin-bottom: 10px;
        }
        .event__description h3 {
          font-size: min(18px, 6vw);
          margin-top: 15px;
          margin-bottom: 10px;
        }
        .event__description img {
          display: block;
          margin: 0 auto;
          max-height: 500px;
          border-radius: 6px;
          overflow: hidden;
        }
        .event__description ol,
        .event__description ul {
          padding-left: 20px;
        }
        .event__description li {
          margin: 5px 0;
          font-size: min(16px, 4.5vw);
          line-height: 27px;
        }
        .event__description pre {
          font-size: min(15px, 3.8vw);
        }
        .event__description pre code {
          background-color: inherit;
          white-space: normal;
        }
        .event__description code {
          word-break: break-word;
          background-color: #eee;
          font-family: monospace;
          font-size: min(15px, 3.8vw);
          color: #f73838;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
        }
        /* event MARKDOWN STYLES END */
        .event__registerSection {
          margin: 20px 0;
        }
        .event__registerSection h1 {
          font-size: 20px;
          color: #222222;
          margin-bottom: 10px;
        }
        .event__registerSection p {
          font-size: 16px;
          color: #444444;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        @media only screen and (max-width: 750px) {
          .event {
            flex-direction: column;
            padding: 18px;
          }
          .event__right {
            position: static;
          }
        }
      `}</style>
    </>
  );
}

export default Event;
