import React from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { format } from "date-fns";
import { Chip } from "primereact/chip";
import { useRouter } from "next/router";

function UpcommingEvents({ events }) {
  const router = useRouter();
  const customizedContent = (item) => {
    return (
      <Card
        className="upcommingEvents__eventCard"
        title={item.Event_name}
        subTitle={
          "Starts at " +
          format(new Date(item.Start_time), "do MMM yyyy HH:mm bbb")
        }
      >
        {item.event_tags.map((tag, index) => (
          <Chip
            className="upcommingEvents__cardChip"
            key={index}
            label={tag.Tag_name}
          />
        ))}

        <p className="upcommingEvents__eventDescription">
          {item.Mini_description.trim()}
        </p>
        <Button
          label="Read more"
          icon="pi pi-arrow-circle-right"
          onClick={() => {
            router.push(`/events/${item.Slug}`);
          }}
        ></Button>
      </Card>
    );
  };

  return (
    <>
      <div className="upcommingEvents">
        <div className="upcommingEvents__content">
          <h1 className="upcommingEvents__title">Upcomming Events</h1>
          <p className="upcommingEvents__desc">
            Upcomming Events from JNTUK UCEV ACM Student Chapter. Click on read
            more to learn more about the event and to participate !
          </p>
          <img
            className="upcommingEvents__img"
            src="/imgs/upcomming-events.svg"
            alt="upcomming events"
          />
        </div>
        <Timeline
          value={events.filter(
            (event) => Date.now() < new Date(event.Start_time)
          )}
          align="left"
          className="upcommingEvents__timeline"
          content={customizedContent}
        />
      </div>

      <style jsx global>
        {`
          .upcommingEvents {
            max-width: 1200px;
            margin: 20px auto;
            display: flex;
            gap: 20px;
            margin-top: 40px;
          }
          .upcommingEvents__title {
            font-size: min(30px, 9vw);
            color: #3792c8;
            margin-bottom: 20px;
          }
          .upcommingEvents__img {
            width: 100%;
            padding: 40px;
          }
          .upcommingEvents__desc {
            font-size: min(18px, 4.8vw);
            color: #222222;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          .upcommingEvents__content {
            flex: 2;
          }
          .upcommingEvents__timeline {
            flex: 3;
            margin: 20px auto;
          }
          .upcommingEvents__eventCard {
            margin: 10px 0;
            background-color: #f5f5f5 !important;
            border: 1px solid #e0e0e0 !important;
            box-shadow: none;
          }
          .upcommingEvents__eventCard .p-card-title {
            font-size: min(25px, 6.5vw) !important;
          }
          .upcommingEvents__eventCard .p-card-content {
            padding: 0;
          }
          .upcommingEvents__cardChip {
            margin-bottom: 10px;
            font-size: min(14px, 3vw);
          }
          .upcommingEvents__eventDescription {
            font-size: min(16px, 4vw);
            color: #222222;
            padding-bottom: 20px;
            line-height: 1.5;
          }
          .p-timeline-event-opposite {
            flex: unset;
            padding: 0 !important;
          }
          @media only screen and (max-width: 650px) {
            .upcommingEvents {
              flex-direction: column;
            }
            .upcommingEvents__img {
              padding: 40px;
            }
          }
          @media only screen and (max-width: 400px) {
            .upcommingEvents {
              flex-direction: column;
            }
            .upcommingEvents__img {
              padding: 10px;
            }
          }
        `}
      </style>
    </>
  );
}

export default UpcommingEvents;
