import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Layout from "../../components/layout/Layout";
import ReactMarkdown from "react-markdown";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import Image from "next/image";
import { useRouter } from "next/router";
import EventDetails from "../../components/singleEventPage/EventDetails";

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
    },
  };
};

function Event({ data }) {
  const router = useRouter();
  const [eventStatus, setEventStatus] = useState({});
  const [registerPrice, setRegisterPrice] = useState("free");
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    if (Date.now() < new Date(data.Start_time)) {
      setEventStatus({ severity: "info", text: "Upcomming" });
    } else if (new Date(data.Start_time) <= Date.now() && Date.now() <= new Date(data.End_time)) {
      setEventStatus({ severity: "warn", text: "Ongoing" });
    } else if (Date.now() > new Date(data.End_time)) {
      setEventStatus({ severity: "error", text: "Completed" });
      setIsValid(false);
    }
    setRegisterPrice(data.Registration_price == 0 ? "free" : "Rs. " + data.Registration_price);
  }, [data]);

  const handleRegisterClick = () => {
    window.open(data.Registration_link, "_blank");
  };

  return (
    <>
      <Layout>
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
              <Chip className="event__cardChip" key={index} label={tag.Tag_name} />
            ))}
            <div className="event__coverImage">
              <Image src={data.Cover_image?.url} alt="Event Cover" objectFit="cover" layout="fill" />
            </div>
            <ReactMarkdown className="event__description">{data.Description}</ReactMarkdown>
            {isValid && (
              <section className="event__registerSection">
                <h1>Register to This Event</h1>
                <p>
                  To register to this event to participate, Press the Register button below. You will be taken to
                  external site for additional details. The registration fees for this event is {registerPrice}
                </p>
                <Button
                  label="Register"
                  icon="pi pi-external-link"
                  onClick={handleRegisterClick}
                  tooltip="opens registration form in new tab"
                  tooltipOptions={{ position: "bottom" }}
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
          line-height: 1.5;
          margin-bottom: 10px;
          color: #222222;
        }
        .event__description h1,
        .event__description h2,
        .event__description h3 {
          color: #444444;
        }
        .event__description h1 {
          font-size: min(25px, 7vw);
          margin: 10px 0;
        }
        .event__description h2 {
          font-size: min(20px, 6.5vw);
          margin: 8px 0;
        }
        .event__description h3 {
          font-size: min(18px, 6vw);
          margin: 5px 0;
        }
        .event__description img {
          border-radius: 6px;
          overflow: hidden;
        }
        .event__description ol,
        .event__description ul {
          padding-left: 20px;
        }
        .event__description pre {
          background-color: #222222;
          color: #eeeeee;
          padding: 10px;
          border-radius: 6px;
          line-height: 1.5;
          font-family: "Courier New", Courier, monospace;
          white-space: break-spaces;
        }
        /* EVENT MARKDOWN STYLES END */
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
