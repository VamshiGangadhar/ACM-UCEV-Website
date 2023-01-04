import React from "react";
import Layout from "../../components/layout/Layout";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import PostResultCard from "../../components/postsPage/PostResultCard";

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
  posts(sort: "createdAt:desc"){
    data{
      id
    }
    data{
      attributes{
        Title
       }
     }
    data{
      attributes{
        Slug
      }
    }
    data{
      attributes{
        createdAt
      }
    }
    data{
      attributes{
        Description
      }
    }
    data{
      attributes{
        authors{
          data{id}
          data{
            attributes{
              Author_name
            }
          }
          data{
            attributes{
              Author_image{
                data{
                  attributes{
                    url
                  }
                }
              }
            }
          }
          data{
            attributes{
              Author_bio
            }
          }
        }
      }
    }
    data{
      attributes{
        tags{
          data{id}
          data{
            attributes{
              Tag_name
            }
          }
        }
      }
    }
    data{
      attributes{
        Cover_image{
          data{
            attributes{
              url
            }
          }
        }
      }
    }
    data{
      attributes{
        Mini_description
      }
    }
    }
  }

    `,
  });
  return {
    props: {
      postsOverview: data.posts,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};
function blogIndex({ postsOverview, APPLICATION_URL }) {
  return (
    <>
      <Layout
        metaTitle="ACM UCEV Blog"
        metaDescription="find all the blog posts from JNTUK UCEV ACM Student's chapter"
        APPLICATION_URL={APPLICATION_URL}
      >
        <div className="blogIndexTitle">
          <h1 className="blogIndex__title">
            <i
              className="pi pi-th-large"
              style={{ fontSize: "22px", marginRight: "10px" }}
            />
            Blog Posts
          </h1>
        </div>
        <div className="blogIndex">
          {postsOverview.map((post) => (
            <PostResultCard
              key={post.id}
              slug={post.Slug}
              title={post.Title}
              cover_image={post.Cover_image.url}
              content={post.Description}
              mini_description={post.Mini_description}
              authors={post.authors}
              post_tags={post.tags}
              created_at={post.created_at}
              updated_at={post.updated_at}
            />
          ))}
        </div>
      </Layout>
      <style jsx>
        {`
          .blogIndex {
            max-width: 1200px;
            margin: 0px auto 20px auto;
          }

          .blogIndexTitle {
            background-color: #3792c1;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%231f678c' fill-opacity='0.4' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
            position: relative;
            padding: 60px;
            margin-bottom: 20px;
          }
          .blogIndex__title {
            font-size: min(30px, 8vw);
            margin: 20px auto;
            color: #ffffff;
            text-align: center;
          }
          .blogIndexTitle::before,
          .blogIndexTitle::after {
            border-bottom: 5px solid rgb(255, 255, 255);
          }
          .blogIndexTitle::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 10px;
            background-size: 20px 40px;
            background-image: radial-gradient(
              circle at 10px -15px,
              transparent 20px,
              rgb(255, 255, 255) 21px
            );
          }
          .blogIndexTitle::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 15px;
            background-size: 40px 40px;
            background-image: radial-gradient(
              circle at 10px 26px,
              rgb(255, 255, 255) 20px,
              transparent 21px
            );
          }
        `}
      </style>
    </>
  );
}

export default blogIndex;
