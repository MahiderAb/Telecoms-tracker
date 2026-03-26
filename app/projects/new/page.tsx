"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ name, description }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/projects"); // redirect after create
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
          }}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
