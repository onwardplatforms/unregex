import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
  language: string;
  text: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, text }) => {
  return (
    <ReactMarkdown
      components={{
        code: ({ node, inline, className, children, ...props }) => {
          return !inline ? (
            <SyntaxHighlighter style={docco} language={language}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {`\`\`\`python\n${text}\n\`\`\``}
    </ReactMarkdown>
  );
};

export { CodeBlock };
