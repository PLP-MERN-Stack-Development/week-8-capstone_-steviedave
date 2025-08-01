import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);

  async function createNewPost(ev) {
    ev.preventDefault();

    if (!files || files.length === 0) {
      setError('Please select an image file.');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', title);
      data.append('summary', summary);
      data.append('content', content);
      data.append('file', files[0]);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Failed to create post: ${response.status} - ${errorText}`);
        return;
      }

      setRedirect(true);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Something went wrong. Please try again.');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={ev => setFiles(ev.target.files)}
        required
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Create Post</button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
}
