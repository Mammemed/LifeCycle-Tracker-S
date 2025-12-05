"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>
          Access your account or create a new one
        </p>

        <button
          style={{ ...styles.btn, backgroundColor: "#2563eb" }}
          onClick={() => router.push("/signup")}
        >
          Create Account
        </button>

        <button
          style={{ ...styles.btn, backgroundColor: "#16a34a" }}
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

const styles: {
  container: React.CSSProperties;
  card: React.CSSProperties;
  title: React.CSSProperties;
  subtitle: React.CSSProperties;
  btn: React.CSSProperties;
} = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #1e3a8a, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#ffffff",
    padding: "50px 40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "16px",
    marginBottom: "30px",
    color: "#555",
  },

  btn: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};