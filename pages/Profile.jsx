import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Profile() {
  const [getUser, setGetUser] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function getData() {
    try {
      const res = await fetch("https://node-hw12.vercel.app/auth/current-user", {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      });
      if (res.status === 200) {
        const data1 = await res.json();
        setGetUser(data1);
        console.log("User data:", data1);
      } else {
        navigate("/Sign-in");
      }
    } catch (er) {
      console.log(er.message);
      navigate("/Sign-in");
    }
  }
  useEffect(() => {
    getData();
  }, []);

  const handleAvatarUpload = async (e) => {
    setLoading(true)
    const files = e.target.files;
    const formData = new FormData();
    formData.append("avatar", files[0]);
    try {
      const res = await fetch("https://node-hw12.vercel.app/users", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
        body: formData,
      });
      if (res.status === 200) {
        getData();
        console.log("updated ");
        setLoading(false)
      } else {
        console.log("error", files);

      }
    } catch (er) {
      console.log(er.message);
    }
  };
  return (
    <div className="p-4">
      <Link to={"/Homepage"}>Back to Home</Link>
      <h1>Profile</h1>
      <h1>
        Email <span className="font-bold">{getUser?.email}</span>
      </h1>
      <h1>
        fullName <span className="font-bold">{getUser?.fullName}</span>
      </h1>
      <div>
        <img className="w-[140px] h-[140px]" src={getUser?.avatar} alt="user" />
      </div>
      <div className="mt-4">
        <label className="text-gray-400" htmlFor="avatar">{loading ? "Loading..." : "Upload Image"}</label>
        <input
          onChange={handleAvatarUpload}
          type="file"
          id="avatar"
          className="hidden"
          placeholder="Upload Image"
        />
      </div>
    </div>
  );
}
