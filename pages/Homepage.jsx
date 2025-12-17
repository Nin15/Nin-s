import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, ThumbsDown, ThumbsUp, Heart, Sparkles } from "lucide-react";
import { apiFetch } from "../src/services/api";

export default function Homepage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [editPost, setEditPost] = useState(null);

  const loadData = async () => {
    try {
      const [userRes, postRes] = await Promise.all([
        apiFetch("/auth/current-user"),
        apiFetch("/posts"),
      ]);
      setUser(userRes);
      setPosts(postRes.posts);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") setUnauthorized(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("content", postContent);
    if (postImage) fd.append("avatar", postImage);
    await apiFetch("/posts", { method: "POST", body: fd });
    setPostContent("");
    setPostImage(null);
    loadData();
  };

  const handleEditPost = async () => {
    const fd = new FormData();
    fd.append("content", editPost.content);
    if (editPost.file) fd.append("avatar", editPost.file);
    await apiFetch(`/posts/${editPost.id}`, { method: "PUT", body: fd });
    setEditPost(null);
    loadData();
  };

  const handleDeletePost = async (id) => {
    await apiFetch(`/posts/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleReaction = async (type, id) => {
    await apiFetch(`/posts/${id}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    loadData();
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/sign-in");
  };

  if (loading) {
    return (
      <div className="h-[100dvh] grid place-items-center bg-gradient-to-br from-rose-100 via-pink-100 to-lilac-100">
        <Loader className="animate-spin text-pink-400" size={64} />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="h-[100dvh] grid place-items-center text-xl bg-pink-50">
        <span>
          Please
          <span
            onClick={() => navigate("/sign-in")}
            className="mx-2 text-pink-500 underline cursor-pointer"
          >
            sign in
          </span>
          again
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-pink-50 to-lilac-100 px-6 py-10 flex flex-col items-center gap-12 font-['Playfair_Display']">
      {/* USER BAR */}
      <div className="self-end flex items-center gap-4 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(255,182,193,0.35)] border border-pink-200">
        <Link to="/Profile" className="flex items-center gap-3">
          <img
            src={user?.avatar || "/vite.svg"}
            className="rounded-full w-10 h-10 border-2 border-pink-300 ring-2 ring-rose-200"
          />
          <span className="text-sm tracking-wide text-gray-700">
            {user?.email}
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs px-4 py-1 rounded-full bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700 hover:scale-105 transition"
        >
          Log out
        </button>
      </div>

      {/* CREATE POST */}
      <form
        onSubmit={handleCreatePost}
        className="relative bg-white/80 backdrop-blur-xl p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,182,193,0.35)] flex flex-col gap-4 w-[380px] border border-pink-200"
      >
        <div className="absolute -top-3 -right-3 text-pink-300">
          <Sparkles size={20} />
        </div>
        <h2 className="text-xl text-rose-500 flex items-center gap-2">
          <Heart className="fill-rose-400 stroke-rose-400" size={18} />
          Write something sweet
        </h2>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Soft thoughts only…"
          className="rounded-[1.5rem] p-4 min-h-[150px] bg-rose-50/70 focus:outline-none focus:ring-2 focus:ring-rose-300 placeholder:text-rose-300"
        />
        <input
          type="file"
          className="text-sm text-rose-500 file:mr-3 file:rounded-full file:border-0 file:bg-rose-200 file:px-4 file:py-1 file:text-rose-800 hover:file:bg-rose-300"
          onChange={(e) => setPostImage(e.target.files[0])}
        />
        <button className="bg-gradient-to-r from-rose-400 via-pink-400 to-lilac-400 text-white py-2 rounded-full tracking-wide hover:shadow-lg hover:scale-[1.02] transition">
          Post ✿
        </button>
      </form>

      {/* POSTS */}
      <div className="flex flex-wrap gap-10 justify-center max-w-6xl">
        {posts.map((post) => (
          <div
            key={post._id}
            className="group w-[310px] bg-white/85 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_15px_40px_rgba(216,180,254,0.35)] border border-pink-200 flex flex-col gap-4 hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar || "/vite.svg"}
                className="w-9 h-9 rounded-full border border-pink-300"
              />
              <h2 className="text-sm tracking-wide text-gray-700">
                {post.author.email}
              </h2>
            </div>

            <p className="text-gray-800 leading-relaxed italic">
              “{post.content}”
            </p>

            {post.avatar && (
              <img
                src={post.avatar}
                className="w-full rounded-[1.75rem] object-cover border border-rose-200"
              />
            )}

            {user?._id === post.author._id && (
              <div className="flex gap-5 text-xs">
                <button
                  onClick={() =>
                    setEditPost({ id: post._id, content: post.content })
                  }
                  className="text-rose-400 hover:underline"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="text-red-300 hover:underline"
                >
                  delete
                </button>
              </div>
            )}

            <div className="flex justify-between text-sm pt-2">
              <button
                onClick={() => handleReaction("like", post._id)}
                className="flex items-center gap-1 text-rose-400 hover:scale-110 transition"
              >
                <ThumbsUp size={16} /> {post.reactions?.likes?.length || 0}
              </button>
              <button
                onClick={() => handleReaction("dislike", post._id)}
                className="flex items-center gap-1 text-lilac-400 hover:scale-110 transition"
              >
                <ThumbsDown size={16} /> {post.reactions?.dislikes?.length || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur grid place-items-center">
          <div className="bg-white/90 p-7 rounded-[2.5rem] flex flex-col gap-4 w-[380px] border border-pink-200 shadow-2xl">
            <textarea
              value={editPost.content}
              onChange={(e) =>
                setEditPost({ ...editPost, content: e.target.value })
              }
              className="rounded-[1.5rem] p-4 min-h-[150px] bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <input
              type="file"
              className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-rose-200 file:px-4 file:py-1 file:text-rose-800"
              onChange={(e) =>
                setEditPost({ ...editPost, file: e.target.files[0] })
              }
            />
            <button
              onClick={handleEditPost}
              className="bg-gradient-to-r from-rose-400 to-lilac-400 text-white py-2 rounded-full hover:scale-105 transition"
            >
              Save changes ♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
