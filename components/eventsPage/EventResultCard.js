import React from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Chip } from "primereact/chip";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

function EventResultCard({
  slug,
  event_status,
  event_name,
  event_tags,
  mini_description,
  start_time,
  end_time,
}) {
  const router = useRouter();
  return (
    <>
      <div className="eventResultCard">
        <Message severity={event_status.severity} text={event_status.text} />
        <h2 className="eventResultCard_title">{event_name}</h2>
        {event_tags.map((tag, index) => (
          <Chip
            className="eventResultCard_tag"
            key={index}
            label={tag.Tag_name}
          />
        ))}
        <p className="eventResultCard_desc">{mini_description}</p>
        <p className="eventResultCard_eventTimings">
          <span className="eventResultCard_startTime">
            {format(new Date(start_time), "do MMM yyyy HH:mm bbb")}
          </span>
          <i className="pi pi-arrow-circle-right" />
          <span className="eventResultCard_endTime">
            {format(new Date(end_time), "do MMM yyyy HH:mm bbb")}
          </span>
        </p>
        <Button
          label="Read more"
          icon="pi pi-arrow-circle-right"
          onClick={() => {
            window.location = `/events/${slug}`;
          }}
        ></Button>
      </div>

      <style jsx>{`
        .eventResultCard {
          background-color: #eeeeee;
          border-radius: 6px;
          border: 1px solid #cccccc;
          margin: 0 auto;
          padding: 20px;
          max-width: min(90vw, 700px);
          white-space: break-word;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .eventResultCard_title {
          font-size: min(20px, 6vw);
          color: #333333;
          margin: 10px 0;
        }
        .eventResultCard_desc {
          font-size: min(16px, 4.8vw);
          margin: 10px 0;
          line-height: 1.5;
          color: #222222;
        }
        .eventResultCard_tag {
          margin-bottom: 10px;
        }
        .eventResultCard_eventTimings {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
        }
        .eventResultCard_startTime,
        .eventResultCard_endTime {
          border: 1px solid #c4c4c4;
          padding: 5px;
          border-radius: 3px;
          background-color: #ddd;
          font-size: min(14px, 4vw);
          color: #444444;
          display: block;
        }
        @media only screen and (max-width: 800px) {
          .eventResultCard {
            width: 90vw;
            margin: 10px auto;
          }
        }
      `}</style>
    </>
  );
}

export default EventResultCard;
