import React from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Chip } from "primereact/chip";
import Image from "next/image";
import readingTime from "../../utils/readingTime";
import Link from "next/link";

function PostResultCardSmall({
  slug,
  title,
  cover_image,
  content,
  authors,
  post_tags,
  created_at,
  updated_at,
}) {
  const router = useRouter();
  return (
    <>
      <div className="postResultCardSmall">
        <div className="postResultCardSmall__image">
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
        <div className="postResultCardSmall__content">
          <div className="postResultCardSmall_tagsContainer">
            {post_tags.map((tag) => (
              <Chip
                className="postResultCardSmall_tag"
                key={tag.id}
                label={tag.Tag_name}
              />
            ))}
          </div>
          <h2 className="postResultCardSmall_title">
            <Link href={`/blog/${slug}`}>
              <a>{title}</a>
            </Link>
          </h2>
          <div className="postResultCardSmall_authorsContainer">
            {authors.map((author) => (
              <div className="postResultCardSmall__authorChip" key={author.id}>
                <Image
                  src={author.Author_image.url}
                  alt={author.Author_name}
                  className="postResultCardSmall__authorImg"
                  width={30}
                  height={30}
                />
                <div className="postResultCardSmall__authorName">
                  {author.Author_name}
                </div>
              </div>
            ))}
          </div>
          <div className="postResultCardSmall_dateContainer">
            {created_at == updated_at ? (
              <span className="postResultCardSmall_date">
                {format(new Date(created_at), "MMM dd, yyyy")}
              </span>
            ) : (
              <span className="postResultCardSmall_date">
                {" "}
                Updated {format(new Date(updated_at), "MMM dd, yyyy")}
              </span>
            )}{" "}
            · ~{readingTime(content)} min read
          </div>
        </div>
      </div>

      <style jsx global>{`
        .postResultCardSmall {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          background-color: #eeeeee;
          border: 1px solid #cccccc;
          border-radius: 6px;
          margin: 0 auto;
          padding: 20px;
          white-space: break-word;
          overflow: hidden;
        }
        .postResultCardSmall__image {
          position: relative;
          height: 200px;
          padding: 100px;
          background-color: #555;
          cursor: pointer;
        }
        .postResultCardSmall_title {
          cursor: pointer;
          font-size: min(20px, 6vw);
          color: #333333;
          margin: 10px 0;
        }
        .postResultCardSmall_title a:focus {
          outline: none;
          text-decoration: underline;
          color: #555555;
        }
        .postResultCardSmall_desc {
          font-size: min(16px, 4.8vw);
          margin-bottom: 10px;
          line-height: 1.5;
          color: #222222;
          cursor: pointer;
        }
        .postResultCardSmall_tagsContainer,
        .postResultCardSmall_authorsContainer {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-bottom: 10px;
          gap: 10px;
        }
        .postResultCardSmall__authorChip {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: min(15px, 3.8vw);
          color: #555555;
        }
        .postResultCardSmall__authorImg {
          border-radius: 50%;
        }
        .postResultCardSmall_tag {
          font-size: min(12px, 3.2vw);
          border-radius: 8px;
        }
        .postResultCardSmall_dateContainer {
          font-size: min(14px, 3.6vw);
          color: #757575;
        }
      `}</style>
    </>
  );
}

export default PostResultCardSmall;
