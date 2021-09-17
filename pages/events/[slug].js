import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Layout from "../../components/layout/Layout";
import ReactMarkdown from "react-markdown";
import { Chip } from "primereact/chip";
import { format } from "date-fns";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Image from "next/image";

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
  const [eventStatus, setEventStatus] = useState({});
  const [registerPrice, setRegisterPrice] = useState("free");
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
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
  const handleCalendarProviderClick = (provider) => {
    if (showCalendarDialog) {
      let url = `https://calndr.link/d/event/?service=${provider}&start=${format(
        new Date(data.Start_time),
        "yyyy'-'MM'-'dd p"
      )}&end=${format(new Date(data.End_time), "yyyy'-'MM'-'dd p")}&title=${data.Event_name}&description=${
        data.Mini_description
      }timezone=+05:30`;
      window.open(url, "_blank");
    }
    setShowCalendarDialog(false);
  };
  return (
    <>
      <Layout>
        <div className="event">
          <main className="event__left">
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
            <div className="event__sumUpDetails">
              <div className="event__sumUpDetailsTitleWrapper">
                <h1 className="event__sumUpDetailsTitle">Event Details</h1>
                <Message severity={eventStatus.severity} text={eventStatus.text} />
              </div>
              <ul>
                <li>
                  <b>
                    <i className="pi pi-info-circle" /> Event Name:
                  </b>
                  <br />
                  <p>{data.Event_name}</p>
                </li>
                <li>
                  <b>
                    <i className="pi pi-question-circle" /> Event Type:
                  </b>
                  <br />
                  {data?.event_tags?.map((tag, index) => (
                    <Chip className="event__cardChip" key={index} label={tag.Tag_name} />
                  ))}
                </li>
                <li>
                  <b>
                    <i className="pi pi-calendar-plus" /> Start Time:
                  </b>
                  <br />
                  {format(new Date(data.Start_time), "do MMM yyyy HH:mm bbb")}
                </li>
                <li>
                  <b>
                    <i className="pi pi-calendar-times" /> End Time:
                  </b>
                  <br />
                  {format(new Date(data.End_time), "do MMM yyyy HH:mm bbb")}
                </li>
                <li>
                  <b>
                    <i className="pi pi-chevron-circle-up" /> Registration Price:
                  </b>
                  <br />
                  {registerPrice}
                </li>
              </ul>
              {isValid && (
                <Button
                  label="Save to your Calendar"
                  icon="pi pi-calendar"
                  onClick={() => setShowCalendarDialog(true)}
                  tooltip="opens dialog to select your calendar provider"
                  tooltipOptions={{ position: "bottom" }}
                />
              )}
              <Dialog
                header="Select Calendar to Save"
                visible={showCalendarDialog}
                style={{ width: "min(350px, 90vw)" }}
                onHide={() => setShowCalendarDialog(false)}
              >
                <div className="event__selectCalendarBtns">
                  <Button
                    label="Google Calendar"
                    icon="pi pi-google"
                    onClick={() => handleCalendarProviderClick("google")}
                  />
                  <Button
                    label="Apple Calendar"
                    icon="pi pi-apple"
                    onClick={() => handleCalendarProviderClick("apple")}
                  />
                  <Button
                    label="Outlook Calendar"
                    icon="pi pi-microsoft"
                    onClick={() => handleCalendarProviderClick("outlook")}
                  />
                </div>
              </Dialog>
            </div>
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

         {
          /* EVENT MARKDOWN STYLES START */
        }
        .event__description {
          background-color: #eeeeee;
          padding: 20px;
          border-radius: 6px;
          margin-top: 20px;
        }
        .event__description p {
          line-height: 1.5;
          margin-bottom: 10px;
          color: #222222;
        }
        .event__description h1 {
          font-size: min(25px, 7vw);
          color: #444444;
        }
         {
          /* EVENT MARKDOWN STYLES END */
        }

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
        .event__selectCalendarBtns {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .event__sumUpDetails {
          padding: 20px;
          border: 1px solid #e5e5e5;
          position: sticky;
          top: 20px;
          transform: translateX(0);
          max-height: 80vh;
        }
        .event__sumUpDetailsTitleWrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .event__sumUpDetailsTitle {
          font-size: 20px;
          color: #3792c1;
        }
        .event__sumUpDetails ul {
          padding: 0;
          list-style-type: none;
          margin-bottom: 10px;
        }
        .event__sumUpDetails li {
          color: #444444;
          background-color: #eeeeee;
          padding: 10px;
          margin-top: 10px;
          border-radius: 6px;
        }
        .event__sumUpDetails ul > li > b {
          padding-bottom: 5px;
          display: inline-block;
          color: #333333;
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
