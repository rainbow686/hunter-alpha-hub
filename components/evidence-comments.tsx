"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/card";

interface Comment {
  id: string;
  evidence_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

interface EvidenceCommentsProps {
  evidenceId: string;
}

export function EvidenceComments({ evidenceId }: EvidenceCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [evidenceId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, content }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setNickname("");
        setContent("");
        setShowForm(false);
      } else {
        alert("Failed to submit comment. Please try again.");
      }
    } catch (error) {
      console.error("Comment submit error:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Comments ({comments.length})
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          {showForm ? "Cancel" : "Add Comment"}
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--muted)" }}>
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-violet-500"
              style={{ color: "var(--foreground)" }}
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--muted)" }}>
              Comment
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-violet-500 resize-none"
              style={{ color: "var(--foreground)" }}
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: "var(--muted)" }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded bg-gray-800/50 border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-teal-400">
                  @{comment.nickname}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  · {timeAgo(comment.created_at)}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
