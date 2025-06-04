import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [SignUp, setSignUp] = useState(false);
  const [data, setData] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (userInfo) => {
    try {
      const res = await fetch("https://node-hw12.vercel.app/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      console.log(userInfo);
      const data1 = await res.json();
      setData(data1);
      setSignUp(true);
    } catch (er) {
      console.log(er.message);
    }
  };
  return (
    <div className="w-[100%] gap-[40px] flex flex-col items-center justify-center ">
      {" "}
      {SignUp === false ? (
        <div className="w-[100%] gap-[40px] flex flex-col items-center justify-center ">
          <section className="mt-[20px]"> </section>
          <section>
            <h1 className="font-bold text-[30px]">Create Account</h1>
            <p>
              Already signed up?{" "}
              <span
                className="cursor-pointer "
                onClick={() => {
                  navigate("/Sign-in");
                }}
              >
                Login
              </span>
            </p>
          </section>
          <form
            className="flex gap-[40px] flex-col items-center justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-[5px]">
              <section className="flex flex-col">
                <input
                  className="w-[450px] h-[48px] placeholder:text-[16px] px-[20px] py-0 text-[16px] focus:outline-none bg-white border-1 rounded-2xl"
                  {...register("fullName", { required: true })}
                  placeholder="FullName"
                />{" "}
                {errors.fullName && (
                  <span className="text-[16px] text-red-500  ">
                    This field is required
                  </span>
                )}
              </section>
            </div>
            <div className="flex flex-col">
              <input
                className="w-[450px] h-[48px] placeholder:text-[16px] px-[20px] py-0 text-[16px] focus:outline-none bg-white border-1 rounded-2xl"
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-[16px] text-red-500  ">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                className="w-[450px] h-[48px] placeholder:text-[16px] px-[20px] py-0 text-[16px] focus:outline-none bg-white border-1 rounded-2xl"
                {...register("password", { required: true })}
                placeholder="Password"
                type="password"
              />{" "}
              {errors.password && (
                <span className="text-[16px] text-red-500  ">
                  This field is required
                </span>
              )}
            </div>

            <button
              className="rounded-2xl text-white h-[52px] bg-black w-[450px]"
              type="submit"
            >
              Create Account
            </button>
          </form>{" "}
          <section className="flex justify-center gap-[5px] items-center ">
            <hr className="w-[205px] border-solid" /> <p>or</p>{" "}
            <hr className="w-[205px] border-solid" />
          </section>
          <section className="flex flex-col gap-[10px]">
            <button className="w-[450px] h-[48px] text-[16px] bg-white border-1 rounded-1.5xl">
              Continue With Google
            </button>
            <button className="w-[450px] h-[48px] text-[16px] bg-white  border-1 rounded-1.5xl">
              Continue with Apple
            </button>
          </section>
        </div>
      ) : (
        <div className="h-[100dvh] gap-[20px] flex flex-col justify-center items-center">
          <img src="/check-circle.png" alt="CHECKED!" />
          <h1 className="font-bold text-[30px]"> Sign Up successfully</h1>
          <button
            className="rounded-2xl cursor-pointer text-white h-[52px] bg-black w-[450px]"
            type="submit"
            onClick={() => {
              navigate("/Sign-in");
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
