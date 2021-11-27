import React from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Chip } from "primereact/chip";
import Image from "next/image";
import truncateString from "../../utils/truncateString";
import readingTime from "../../utils/readingTime";
import Link from "next/link";

function PostResultCard({
  slug,
  title,
  cover_image,
  mini_description,
  content,
  authors,
  post_tags,
  created_at,
  updated_at,
}) {
  const router = useRouter();
  return (
    <>
      <div className="postResultCard">
        <div className="postResultCard__content">
          <div className="postResultCard_tagsContainer">
            {post_tags.map((tag) => (
              <Chip
                className="postResultCard_tag"
                key={tag.id}
                label={tag.Tag_name}
              />
            ))}
          </div>
          <h2 className="postResultCard_title">
            <Link href={`/blog/${slug}`}>
              <a>{title}</a>
            </Link>
          </h2>
          <div className="postResultCard_authorsContainer">
            {authors.map((author) => (
              <div className="postResultCard__authorChip" key={author.id}>
                <Image
                  src={author.Author_image.url}
                  alt={author.Author_name}
                  className="postResultCard__authorImg"
                  width={30}
                  height={30}
                />
                <div className="postResultCard__authorName">
                  {author.Author_name}
                </div>
              </div>
            ))}
          </div>
          <p
            className="postResultCard_desc"
            onClick={() => {
              router.push(`/blog/${slug}`);
            }}
          >
            {truncateString(mini_description, 100)}
          </p>
          <div className="postResultCard_dateContainer">
            {created_at == updated_at ? (
              <span className="postResultCard_date">
                {format(new Date(created_at), "MMM dd, yyyy")}
              </span>
            ) : (
              <span className="postResultCard_date">
                {" "}
                Updated {format(new Date(updated_at), "MMM dd, yyyy")}
              </span>
            )}{" "}
            · ~{readingTime(content)} min read
          </div>
        </div>
        <div className="postResultCard__image">
          <Image
            src={cover_image}
            alt={title}
            layout="fill"
            objectFit="cover"
            onClick={() => {
              router.push(`/blog/${slug}`);
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .postResultCard {
          display: flex;
          gap: 20px;
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
        .postResultCard__image {
          flex: 2;
          position: relative;
          width: 350px;
          height: 200px;
          background-color: #555;
          cursor: pointer;
        }
        .postResultCard__content {
          flex: 3;
        }
        .postResultCard_title {
          cursor: pointer;
          font-size: min(20px, 6vw);
          color: #333333;
          margin: 10px 0;
        }
        .postResultCard_title a:focus {
          outline: none;
          text-decoration: underline;
          color: #555555;
        }
        .postResultCard_desc {
          font-size: min(16px, 4.8vw);
          margin-bottom: 10px;
          line-height: 1.5;
          color: #222222;
          cursor: pointer;
        }
        .postResultCard_tagsContainer,
        .postResultCard_authorsContainer {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-bottom: 10px;
          gap: 10px;
        }
        .postResultCard__authorChip {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: min(15px, 3.8vw);
          color: #555555;
        }
        .postResultCard__authorImg {
          border-radius: 50%;
        }
        .postResultCard_tag {
          font-size: min(12px, 3.2vw);
          border-radius: 8px;
        }
        .postResultCard_dateContainer {
          font-size: min(14px, 3.6vw);
          color: #757575;
        }
        @media only screen and (max-width: 800px) {
          .postResultCard {
            width: 90vw;
            margin: 10px auto;
            flex-direction: column-reverse;
          }
          .postResultCard__image {
            padding: 100px;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default PostResultCard;
