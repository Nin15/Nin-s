import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [content, setContent] = useState(null);

  const getUserData = async () => {
    try {
      const res = await fetch("https://node-hw12.vercel.app/users", {
        headers: {
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      });
      const data = await res.json();
      setUserData(data);
    } catch (er) {
      console.log(er.message);
    }
  };

  const getData = async () => {
    try {
      const res = await fetch("https://node-hw12.vercel.app/posts", {
        headers: {
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      });
      const data = await res.json();
      setData(data);
    } catch (er) {
      console.log(er.message);
    }
  };

  useEffect(() => {
    getUserData();
    getData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    try {
      const res = await fetch("https://node-hw12.vercel.app/posts", {
        method: "POST",
        headers: {
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
        body: formData,
      });

      await res.json();
      await getData();
    } catch (er) {
      console.log(er.message);
    }
  };

  const handleEdit = async (id, content) => {
    const formData = new FormData();
    formData.append("content", content);
    if (selectedFile && selectedFile.length > 0) {
      formData.append("avatar", selectedFile[0]);
    }

    try {
      const res = await fetch(`https://node-hw12.vercel.app/posts/${id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
        body: formData,
      });

      await res.json();
      await getData();
      setSelectedFile(null);
    } catch (er) {
      console.log(er.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://node-hw12.vercel.app/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      });

      await res.json();
      await getData();
    } catch (er) {
      console.log(er.message);
    }
  };

  const handleLogOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col justify-center gap-[20px] items-center shadow-md">
      <div className="w-full flex items-end flex-col p-2">
        <div className="flex flex-col items-center gap-4">
          <Link to={"/Profile"} className="flex flex-col items-center">
            <img
              src={`${userData?.avatar || "/vite.svg"}`}
              alt="userimg"
              className="rounded-full"
              width={40}
              height={40}
            />
            <h2>{userData?.email}</h2>
          </Link>
          <button
            onClick={handleLogOut}
            className="bg-red-700 w-20 text-white rounded-2xl cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      <form
        className="flex bg-white gap-[20px] flex-col border-black border-1 p-[20px] rounded-4xl items-center justify-center"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col justify-center">
          <textarea
            placeholder="Today I did..."
            onChange={(e) => setContent(e.target.value)}
            className="focus:outline-0 border-1 min-h-[150px] p-[20px] text-[16px] rounded-2xl w-[350px] border-gray-400"
          />
        </div>
        <label className="text-gray-400 cursor-pointer" htmlFor="avatar">
          {upload ? "Image Uploaded" : "Upload Image"}
        </label>
        <input
          onChange={(e) => {
            setUpload(true);
            setAvatar(e.target.files[0]);
            setTimeout(() => {
              setUpload(false);
            }, 2000);
          }}
          type="file"
          id="avatar"
          className="hidden"
        />
        <button
          className="rounded-2xl text-white h-[52px] bg-black w-[100px]"
          type="submit"
        >
          Post
        </button>
      </form>

      {edit && (
        <div className="fixed top-0 left-0 w-full h-[100dvh] flex justify-center items-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-0"></div>
          <form
            className="relative z-10 flex bg-white gap-[20px] flex-col border-black border-1 p-[20px] rounded-4xl items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit(editId, editContent);
              setEdit(false);
            }}
          >
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="focus:outline-0 border-1 min-h-[150px] p-[20px] text-[16px] rounded-2xl w-[350px] border-gray-400"
            />
            <label className="text-gray-400 cursor-pointer" htmlFor="edit-img">
              {upload ? "Image Uploaded" : "Upload Image"}
            </label>
            <input
              type="file"
              id="edit-img"
              className="hidden"
              onChange={(e) => {
                setSelectedFile(e.target.files);

                setUpload(true);
                setTimeout(() => {
                  setUpload(false);
                }, 2000);
              }}
            />
            <button
              type="submit"
              className="rounded-2xl text-white h-[52px] bg-black w-[100px]"
            >
              Save
            </button>
          </form>
        </div>
      )}

      {data && (
        <div className="flex gap-[20px] justify-center items-center w-full flex-wrap">
          {data.posts.map((el, i) => (
            <div
              key={i}
              className="w-[300px] flex flex-col items-center p-2 shadow-xl gap-[20px] rounded-4xl"
            >
              <h1 className="font-bold text-[17px]">{el.author.email}</h1>
              <p className="text-[30px]">{el.content}</p>
              {el.avatar && (
                <img
                  className="object-cover w-[150px]"
                  src={`${el.avatar}?t=${Date.now()}`}
                  alt=""
                />
              )}
              <section className="flex gap-[20px]">
                <button
                  onClick={() => {
                    setEditId(el._id);
                    setEditContent(el.content);
                    setEdit(true);
                  }}
                  className="w-[100px] h-[40px] rounded-2xl bg-gray-200"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDelete(el._id)}
                  className="w-[100px] h-[40px] rounded-2xl bg-gray-200"
                >
                  delete
                </button>
              </section>
              <p>{el.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
