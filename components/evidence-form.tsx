"use client";

import { useState } from "react";
import { Button } from "./button";

interface EvidenceFormProps {
  onSubmitted?: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  nickname?: string;
  evidenceUrl?: string;
}

export function EvidenceForm({ onSubmitted }: EvidenceFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    nickname: "",
    evidenceUrl: "",
    importance: "Medium" as "High" | "Medium" | "Low",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 5) return "Title must be at least 5 characters";
        if (value.length > 100) return "Title must be less than 100 characters";
        break;
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 10) return "Description must be at least 10 characters";
        if (value.length > 500) return "Description must be less than 500 characters";
        break;
      case "nickname":
        if (!value.trim()) return "Nickname is required";
        if (value.trim().length < 2) return "Nickname must be at least 2 characters";
        if (value.length > 30) return "Nickname must be less than 30 characters";
        if (!/^[a-zA-Z0-9_\s]+$/.test(value)) return "Nickname can only contain letters, numbers, and underscores";
        break;
      case "evidenceUrl":
        if (value && !/^https?:\/\/.+$/.test(value)) return "Please enter a valid URL (https://...)";
        break;
    }
    return undefined;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ title: "", description: "", nickname: "", evidenceUrl: "", importance: "Medium" });
        setErrors({});
        onSubmitted?.();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setSubmitError(data.error || "Failed to submit evidence");
        setStatus("error");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
          Title <span className="text-gray-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-1 transition-colors ${
            errors.title
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "focus:border-violet-500 focus:ring-violet-500"
          }`}
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: errors.title ? "#ef4444" : "var(--input-border)",
            borderWidth: "1px",
            borderStyle: "solid",
            color: "var(--foreground)",
          }}
          placeholder="Brief description of the evidence"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
          Description <span className="text-gray-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          className={`w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-1 transition-colors resize-none ${
            errors.description
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "focus:border-violet-500 focus:ring-violet-500"
          }`}
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: errors.description ? "#ef4444" : "var(--input-border)",
            borderWidth: "1px",
            borderStyle: "solid",
            color: "var(--foreground)",
          }}
          placeholder="Provide details about this evidence"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Min 10 characters
          </span>
          <span className={`text-xs ${formData.description.length > 500 ? "text-red-400" : ""}`} style={{ color: "var(--muted)" }}>
            {formData.description.length}/500
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
            Nickname <span className="text-gray-500">*</span>
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            required
            value={formData.nickname}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-1 transition-colors ${
              errors.nickname
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-violet-500 focus:ring-violet-500"
            }`}
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: errors.nickname ? "#ef4444" : "var(--input-border)",
              borderWidth: "1px",
              borderStyle: "solid",
              color: "var(--foreground)",
            }}
            placeholder="Your display name"
          />
          {errors.nickname && (
            <p className="mt-1 text-sm text-red-400">{errors.nickname}</p>
          )}
        </div>

        <div>
          <label htmlFor="evidenceUrl" className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
            Evidence Link
          </label>
          <input
            type="url"
            id="evidenceUrl"
            name="evidenceUrl"
            value={formData.evidenceUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-1 transition-colors ${
              errors.evidenceUrl
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-violet-500 focus:ring-violet-500"
            }`}
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: errors.evidenceUrl ? "#ef4444" : "var(--input-border)",
              borderWidth: "1px",
              borderStyle: "solid",
              color: "var(--foreground)",
            }}
            placeholder="https://..."
          />
          {errors.evidenceUrl && (
            <p className="mt-1 text-sm text-red-400">{errors.evidenceUrl}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="importance" className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
          Importance
        </label>
        <select
          id="importance"
          name="importance"
          value={formData.importance}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:border-violet-500 focus:ring-violet-500 transition-colors"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--input-border)",
            borderWidth: "1px",
            borderStyle: "solid",
            color: "var(--foreground)",
          }}
        >
          <option value="High">High - Critical evidence</option>
          <option value="Medium">Medium - Supporting evidence</option>
          <option value="Low">Low - Minor observation</option>
        </select>
      </div>

      {submitError && (
        <div className="p-3 rounded-lg bg-red-900/30 border border-red-500 text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit Evidence"}
        </Button>

        {status === "success" && (
          <span className="text-green-400 text-sm">Submitted successfully!</span>
        )}
      </div>
    </form>
  );
}
