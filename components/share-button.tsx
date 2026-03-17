"use client";

import { useState } from "react";

interface ShareButtonProps {
  evidenceId: string;
  title: string;
  description: string;
}

export function ShareButton({ evidenceId, title, description }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/evidence?id=${evidenceId}`
    : `https://www.hunteralphahub.com/evidence?id=${evidenceId}`;

  const shareText = encodeURIComponent(`${title} - ${description}`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleshare = (platform: string) => {
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
        break;
      case "reddit":
        url = `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareText}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowMenu(false);
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 transition-colors hover:text-teal-400"
        style={{ color: "var(--muted)" }}
        title="Share this evidence"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div
            className="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-50 border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)"
            }}
          >
            <button
              onClick={() => handleshare("twitter")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-3"
              style={{ color: "var(--foreground)" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on Twitter
            </button>

            <button
              onClick={() => handleshare("reddit")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-3"
              style={{ color: "var(--foreground)" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              Share on Reddit
            </button>

            <div className="border-t my-2" style={{ borderColor: "var(--card-border)" }} />

            <button
              onClick={() => handleshare("copy")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-3"
              style={{ color: copied ? "var(--success)" : "var(--foreground)" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={copied
                    ? "M5 13l4 4L19 7"
                    : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  }
                />
              </svg>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
