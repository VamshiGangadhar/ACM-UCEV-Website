import React from "react";
import Layout from "../../components/layout/Layout";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { format } from "date-fns";
import Image from "next/image";
import readingTime from "../../utils/readingTime";
import ReactMarkdown from "react-markdown";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import ReactUtterences from "react-utterances";
import CodeBlock from "../../components/singlePostPage/CodeBlock";

export const getStaticPaths = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
        posts {
          Slug
        }
      }
    `,
  });

  const paths = data.posts.map((post) => ({
    params: { slug: post.Slug },
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
        posts(where: { Slug: "${params.slug}" }) {
          id
          Title
          Slug
          created_at
          updated_at
          Description
          authors {
            id
            Author_name
            Author_image {
              url
            }
          }
          tags {
            id
            Tag_name
          }
          Cover_image {
            url
          }
          Mini_description
        }
      }
    `,
  });
  return {
    props: {
      data: data.posts[0],
    },
  };
};

function BlogPost({ data }) {
  let router = useRouter();
  return (
    <>
      <Layout>
        <article className="blogPost">
          <Button
            label="Go Back"
            icon="pi pi-arrow-left"
            className="p-button-text blogPost__goBackButton"
            onClick={() => router.push("/blog")}
          />
          <h1 className="blogPost__title">{data.Title}</h1>
          <div className="blogPost__details">
            <div className="blogPost__authors">
              {data.authors.map((author) => (
                <div className="blogPost__authorChip" key={author.id}>
                  <Image
                    src={author.Author_image.url}
                    alt={author.Author_name}
                    objectFit="cover"
                    className="blogPost__authorImg"
                    width={30}
                    height={30}
                  />
                  <div className="blogPost__authorName">
                    {author.Author_name}
                  </div>
                </div>
              ))}
            </div>
            {data.created_at == data.updated_at ? (
              <span className="blogPost_date">
                {format(new Date(data.created_at), "MMM dd, yyyy")}
              </span>
            ) : (
              <span className="blogPost_date">
                {" "}
                Updated {format(new Date(data.updated_at), "MMM dd, yyyy")}
              </span>
            )}
            <Chip
              label={`${readingTime(data.Description)} min read`}
              icon="pi pi-clock"
              className="blogPost__readingTime"
            />
          </div>
          <div className="blogPost__tagsContainer">
            {data.tags.map((tag) => (
              <Chip
                className="blogPost__tag"
                key={tag.id}
                label={tag.Tag_name}
              />
            ))}
          </div>
          <div className="blogPost__coverImg">
            <Image src={data.Cover_image.url} layout="fill" objectFit="cover" />
          </div>
          <ReactMarkdown className="post__description" components={CodeBlock}>
            {data.Description}
          </ReactMarkdown>
        </article>
        <div className="blogPost__comments">
          <h2>Comments</h2>
          <ReactUtterences
            repo="Royal-lobster/acmucev-comments"
            type={"pathname"}
          />
        </div>
      </Layout>
      <style jsx global>
        {`
          .blogPost,
          .blogPost__comments {
            width: 100%;
            max-width: 900px;
            margin: 20px auto;
            padding: 0 20px;
          }
          .blogPost {
            margin-top: 40px;
          }
          .blogPost__goBackButton {
            margin-bottom: 20px;
            padding: 0;
          }
          .blogPost__title {
            font-size: min(35px, 8vw);
            font-weight: bold;
            margin-bottom: 10px;
          }
          .blogPost__authors {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
          }
          .blogPost__authorChip {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #3792c1;
            font-weight: 600;
          }
          .blogPost__authorImg {
            border-radius: 50%;
          }
          .blogPost__details {
            font-size: min(14px, 3.6vw);
            color: #757575;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
          }
          .blogPost__readingTime {
            font-size: 12px;
          }
          .blogPost__readingTime .p-chip-icon {
            font-size: 12px;
          }
          .blogPost__tagsContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          .blogPost__tag {
            font-size: min(12px, 3.2vw);
            border-radius: 8px;
            background-color: #3792c1;
            color: #eeeeee;
            font-weight: 600;
          }
          .blogPost__coverImg {
            width: 100%;
            position: relative;
            height: 300px;
            margin: 20px 0;
          }
          .blogPost__coverImg img {
            border-radius: 6px;
            display: block;
            margin: 0 auto;
          }
          /* post MARKDOWN STYLES START */
          .post__description {
            border-radius: 6px;
            margin-top: 20px;
            max-width: 90vw;
          }
          .post__description * {
            max-width: 100%;
          }
          .post__description p {
            font-size: min(18px, 4.8vw);
            line-height: 27px;
            margin: 10px 0;
            color: #222222;
          }
          .post__description h1,
          .post__description h2,
          .post__description h3 {
            color: #444444;
          }
          .post__description h1 {
            font-size: min(28px, 7vw);
            margin-top: 25px;
            margin-bottom: 20px;
          }
          .post__description h2 {
            font-size: min(22px, 6.5vw);
            margin-top: 15px;
            margin-bottom: 10px;
          }
          .post__description h3 {
            font-size: min(18px, 6vw);
            margin-top: 15px;
            margin-bottom: 10px;
          }
          .post__description img {
            display: block;
            margin: 0 auto;
            max-height: 500px;
            border-radius: 6px;
            overflow: hidden;
          }
          .post__description ol,
          .post__description ul {
            padding-left: 20px;
          }
          .post__description li {
            margin: 5px 0;
            font-size: 18px;
            line-height: 27px;
          }
          .post__description pre code {
            background-color: inherit;
            white-space: normal;
          }
          .post__description code {
            word-break: break-word;
            background-color: #eee;
            font-family: monospace;
            color: #f73838;
            font-size: 15px;
            padding: 2px 4px;
            border-radius: 4px;
            font-weight: 500;
          }
          /* post MARKDOWN STYLES END */
          .blogPost__comments {
            margin-top: 0;
          }
          .blogPost__comments h2 {
            font-size: min(20px, 6.5vw);
            border-top: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            padding: 20px 0;
          }
          .utterances {
            max-width: 900px;
          }
          @media only screen and (max-width: 600px) {
            .blogPost__coverImg {
              width: 100%;
              aspect-ratio: 16/9;
              height: unset;
            }
          }
        `}
      </style>
    </>
  );
}

export default BlogPost;
