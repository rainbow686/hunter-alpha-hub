import React from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { BlogPost, getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BreadcrumbListSchema } from "@/components/structured-data";

const allPosts = getAllPosts();

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const foundPost = getPostBySlug(slug);
    if (foundPost) {
      setPost(foundPost);
      setRelatedPosts(getRelatedPosts(slug, 3));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Post not found</h1>
        <Link href="/blog" className="text-violet-400 hover:text-violet-300">
          ← Back to blog
        </Link>
      </div>
    );
  }

  const baseUrl = "https://www.hunteralphahub.com";

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/blog"
                className="text-xs px-3 py-1 rounded-full bg-violet-900/30 text-violet-400 border border-violet-800 hover:bg-violet-900/50 transition-colors"
              >
                ← Back to blog
              </Link>
              <span className="text-xs px-3 py-1 rounded-full bg-violet-900/30 text-violet-400 border border-violet-800">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
              <span>{post.author}</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime} min read</span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-invert prose-violet max-w-none mb-12"
            style={{
              color: "var(--foreground)",
              lineHeight: "1.8",
            }}
          >
            <BlogContent content={post.content} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t pt-8" style={{ borderColor: "var(--card-border)" }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card className="p-4 hover:border-violet-500/50 transition-colors">
                    <div className="text-xs px-2 py-1 rounded-full bg-violet-900/30 text-violet-400 border border-violet-800 inline-block mb-2">
                      {relatedPost.category}
                    </div>
                    <h3 className="font-medium mb-2 hover:text-violet-400 transition-colors" style={{ color: "var(--foreground)" }}>
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {relatedPost.excerpt}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
        ]}
      />
    </>
  );
}

// Simple markdown-like renderer for blog content
function BlogContent({ content }: { content: string }) {
  // Split by lines and process each line
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Handle tables
    if (trimmedLine.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
        tableHeaders = [];
      }

      const cells = trimmedLine.split('|').filter(cell => cell.trim()).map(cell => cell.trim());

      if (tableHeaders.length === 0 && !trimmedLine.includes('---')) {
        tableHeaders = cells;
      } else if (!trimmedLine.includes('---')) {
        tableRows.push(cells);
      }

      // Check if table ends
      if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
        // Render table
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  {tableHeaders.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left border-b border-gray-700"
                      style={{ color: "var(--foreground)" }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-2 border-b border-gray-800"
                        style={{ color: "var(--muted)" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
      }
      continue;
    }

    // Handle headers
    if (trimmedLine.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>{trimmedLine.slice(2)}</h1>);
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>{trimmedLine.slice(3)}</h2>);
    } else if (trimmedLine.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-bold mt-6 mb-3" style={{ color: "var(--foreground)" }}>{trimmedLine.slice(4)}</h3>);
    } else if (trimmedLine.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-lg font-bold mt-4 mb-2" style={{ color: "var(--foreground)" }}>{trimmedLine.slice(5)}</h4>);
    }
    // Handle bold text and paragraphs
    else if (trimmedLine.startsWith('- **')) {
      const match = trimmedLine.match(/- \*\*(.+?)\*\*: (.+)/);
      if (match) {
        elements.push(
          <div key={i} className="flex items-start gap-2 my-2">
            <span className="text-violet-400">•</span>
            <span>
              <strong style={{ color: "var(--foreground)" }}>{match[1]}</strong>
              <span style={{ color: "var(--muted)" }}> {match[2]}</span>
            </span>
          </div>
        );
      }
    }
    // Handle list items
    else if (trimmedLine.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="text-violet-400">•</span>
          <span style={{ color: "var(--foreground)" }}>{trimmedLine.slice(2)}</span>
        </div>
      );
    }
    // Handle horizontal rule
    else if (trimmedLine.startsWith('---')) {
      elements.push(<hr key={i} className="my-8 border-gray-700" />);
    }
    // Handle empty lines
    else if (trimmedLine === '') {
      // Skip empty lines
    }
    // Handle regular paragraphs
    else {
      // Process inline formatting
      const processedLine = processInlineFormatting(trimmedLine);
      elements.push(<p key={i} className="my-4" style={{ color: "var(--foreground)" }}>{processedLine}</p>);
    }
  }

  return <>{elements}</>;
}

function processInlineFormatting(text: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  let currentIndex = 0;

  // Handle bold text
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;
  let lastIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<strong key={`bold-${match.index}`} style={{ color: "var(--foreground)" }}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key="default">{text}</span>];
}
