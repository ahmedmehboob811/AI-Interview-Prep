import React, { useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const FALLBACK_MESSAGE = `
### 📌 Default Guidance

It seems the AI couldn't generate an explanation at the moment — but here's how you can approach this question:

1. **Start with a strong introduction:** Briefly share who you are, your background, and your career path.
2. **Highlight key experiences:** Focus on your most relevant roles, achievements, and skills.
3. **Show alignment:** Explain why your experience makes you a great fit for the role.
4. **Keep it short and confident:** Aim for 1–2 minutes if spoken, or 3–5 sentences if written.

💡 **Example:**
"I'm Alex, a software developer with 3 years of experience building web apps with React and Node.js. I've led projects that boosted user engagement by 40% and optimized backend performance. My strong problem-solving skills and focus on scalable solutions make me excited to contribute to your team."
`;

const AIResponsePreview = ({ content }) => {
  if (!content) return null;

  // 🪄 Detect error message and replace with fallback
  const finalContent =
    content?.toLowerCase().includes("an error occurred") ||
    content?.trim() === ""
      ? FALLBACK_MESSAGE
      : content;

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            return !inline ? (
              <CodeBlock
                code={String(children).replace(/\n$/, "")}
                language={language}
              />
            ) : (
              <code
                className="px-1 py-0.5 bg-gray-100 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-4 leading-6 text-gray-800">{children}</p>;
          },
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc pl-6 space-y-2 my-4 text-gray-800">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal pl-6 space-y-2 my-4 text-gray-800">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg font-bold mt-5 mb-2 text-gray-900">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-base font-bold mt-4 mb-2 text-gray-900">
                {children}
              </h4>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-200">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-50">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-gray-200">{children}</tbody>;
          },
          tr({ children }) {
            return <tr>{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                {children}
              </td>
            );
          },
          hr() {
            return <hr className="my-6 border-gray-200" />;
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt || "Image"}
                className="my-4 max-w-full rounded"
              />
            );
          },
        }}
      >
        {finalContent}
      </ReactMarkdown>
    </div>
  );
};

// ✅ Clean CodeBlock with copy feature
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <LuCode size={16} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {language || "Code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="text-gray-500 hover:text-gray-700 focus:outline-none relative group"
          aria-label="Copy Code"
        >
          {copied ? (
            <LuCheck size={16} className="text-green-600" />
          ) : (
            <LuCopy size={16} />
          )}
          {copied && (
            <span className="absolute -top-8 right-0 bg-black text-white text-xs rounded-md px-2 py-1 opacity-80 group-hover:opacity-100 transition">
              Copied!
            </span>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 12.5,
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AIResponsePreview;
