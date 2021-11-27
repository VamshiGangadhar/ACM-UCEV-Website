import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import Layout from "../../components/layout/Layout";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
        events(sort: "Start_time:asc") {
          Event_name
          Start_time
          End_time
        }
      }
    `,
  });
  let allEvents = [];
  data.events.map((event) => {
    allEvents.push({
      title: event.Event_name,
      start: event.Start_time,
      end: event.End_time,
    });
  });
  return {
    props: {
      events: allEvents,
    },
  };
};
function eventCalendar({ events }) {
  return (
    <>
      <Layout>
        <div className="eventCalendar">
          <Calendar
            localizer={localizer}
            events={events.map((event) => {
              event.start = new Date(event.start);
              event.end = new Date(event.end);
              return event;
            })}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </Layout>
      <style jsx global>{`
        .eventCalendar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 50px 20px;
        }
        .rbc-calendar {
          width: min(90vw, 900px);
        }
      `}</style>
    </>
  );
}

export default eventCalendar;
