import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const login = async (username, password) => {
  const respone = await fetch("https://hrms.wu.ac.th/index.php?r=api/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const userAuth = await respone.json();

  if (userAuth.status !== "success") {
    return { success: false, error: "Invalid username or password" };
  }

  const token = jwt.sign(userAuth.data, SECRET_KEY, { expiresIn: "2h" });

  const cookie = serialize("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7200,
  });

  return { success: true, message: "Login successful", token, cookie };
};

const logout = async () => {
  const cookie = serialize("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return { success: true, message: "Logout successful" };
};

const user = async () => {
  try {
    const response = await fetch("/api/auth", { method: "GET" });
    const data = await response.json();

    if (!data.success) {
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default {
  login,
  logout,
  user,
};
