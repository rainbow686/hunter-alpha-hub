"use client";

import { useState } from "react";
import { Button } from "./button";

export function EvidenceForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    nickname: "",
    evidenceUrl: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ title: "", description: "", nickname: "", evidenceUrl: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Title <span className="text-gray-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          placeholder="Brief description of the evidence"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description <span className="text-gray-500">*</span>
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
          placeholder="Provide details about this evidence"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
            Nickname <span className="text-gray-500">*</span>
          </label>
          <input
            type="text"
            id="nickname"
            required
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="Your display name"
          />
        </div>

        <div>
          <label htmlFor="evidenceUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Evidence Link
          </label>
          <input
            type="url"
            id="evidenceUrl"
            value={formData.evidenceUrl}
            onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit Evidence"}
        </Button>

        {status === "success" && (
          <span className="text-green-400 text-sm">Submitted successfully!</span>
        )}
        {status === "error" && (
          <span className="text-red-400 text-sm">Failed to submit. Please try again.</span>
        )}
      </div>
    </form>
  );
}
