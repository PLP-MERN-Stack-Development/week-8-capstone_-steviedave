import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`)
      .then(response => response.json())
      .then(data => {
        if (!data.author) {
          setError("Author no longer exists.");
        }
        setPostInfo(data);
      })
      .catch(err => {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post.");
      });
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!postInfo) return <div>Loading...</div>;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <div className="image">
        <img src={`${process.env.REACT_APP_API_URL}/${postInfo.cover}`} alt="" />
      </div>
      <time>
        published: {format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}
      </time>

      {postInfo.author && (
        <div className="author">by @{postInfo.author.username}</div>
      )}

      {userInfo && postInfo.author && userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit Post
          </Link>
        </div>
      )}

      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
  );
}
