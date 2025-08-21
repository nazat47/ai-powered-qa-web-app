"use client";
import { login } from "@/services/api";
import { useUserStore } from "@/store/user-store";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const { setUser } = useUserStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data?.user);
      router.push("/");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-200">
      <form className="min-w-[300px] w-[500px] max-w-md p-8 bg-white rounded-lg shadow-lg border ">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="underline text-blue-600">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
