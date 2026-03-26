"use client";

import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    alert("User created");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  );
}
