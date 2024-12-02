import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Home = ({ username, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      const postsWithComments = response.data.map(post => ({ ...post, commentText: '' }));
      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('http://localhost:5000/api/posts', {
        ...newPost,
        author: user.id
      });
      setPosts([...posts, { ...response.data, commentText: '' }]);
      setNewPost({ title: '', content: '', imageUrl: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/posts/${id}`, editingPost);
      setPosts(posts.map(post => (post._id === id ? { ...response.data, commentText: post.commentText } : post)));
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikePost = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(`http://localhost:5000/api/posts/${id}/like`, { userId: user.id });
      setPosts(posts.map(post => (post._id === id ? { ...response.data, commentText: post.commentText } : post)));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentTextChange = (id, text) => {
    setPosts(posts.map(post => (post._id === id ? { ...post, commentText: text } : post)));
  };

  const handleCommentPost = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const post = posts.find(post => post._id === id);
      const response = await axios.post(`http://localhost:5000/api/posts/${id}/comment`, { userId: user.id, text: post.commentText });
      setPosts(posts.map(post => (post._id === id ? { ...response.data, commentText: '' } : post)));
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-red-200 p-6 flex flex-col items-center">
      <header className="w-full max-w-screen-xl flex justify-between items-center bg-blue shadow-md p-6 rounded-lg">
        <h1 className="text-3xl font-extrabold text-blue-800">Hello, {username}!</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition transform hover:-translate-y-1"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>
      <main className="w-full max-w-screen-xl mt-8"> 
        <div className="mb-6 p-4 bg-white shadow-lg rounded-lg"> 
          <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newPost.imageUrl}
            onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleCreatePost}
          >
            Create Post
          </button>
        </div>
        
        <div style={{ height: '500px', overflowY: 'scroll' }} className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post._id} className="bg-white shadow-lg p-6 rounded-lg transform hover:scale-105 transition">
              {editingPost && editingPost._id === post._id ? (
                <>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editingPost.imageUrl}
                    onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                  />
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    onClick={() => handleUpdatePost(post._id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full mb-4 rounded-lg" />
                  )}
                  <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                  <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }} className="text-gray-600 mt-3">{post.content}</p>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={() => handleLikePost(post._id)}
                    >
                      Like ({post.likes.length})
                    </button>
                    {post.author === JSON.parse(localStorage.getItem('user')).id && (
                      <>
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                          onClick={() => setEditingPost(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold">Comments</h3>
                    {post.comments.map(comment => (
                      <div key={comment._id} className="bg-gray-100 p-2 rounded-lg mb-2">
                        <p className="text-gray-800">{comment.text}</p>
                        <p className="text-gray-600 text-sm">- {comment.user.name}, {moment(comment.createdAt).format('LLL')}</p>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add a comment"
                      value={post.commentText}
                      onChange={(e) => handleCommentTextChange(post._id, e.target.value)}
                      className="w-full mb-2 px-4 py-2 border rounded-lg"
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={() => handleCommentPost(post._id)}
                    >
                      Comment
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
