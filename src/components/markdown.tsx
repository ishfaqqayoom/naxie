import React, { FC, useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import HoverCardText from './link-card';
import { visit } from 'unist-util-visit';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';

interface MarkdownComponentProps {
  content: string;
  refs?: any;
  isStreaming?: boolean;
}

const MarkdownComponent: FC<MarkdownComponentProps> = ({
  content,
  refs,
  isStreaming = false
}) => {
  const [copiedButtons, setCopiedButtons] = useState<{
    [key: string]: boolean;
  }>({});

  // Unique key generator for code blocks
  const getUniqueKey = useMemo(() => {
    const cache = new WeakMap();
    return (node: any) => {
      if (!cache.has(node)) {
        cache.set(node, JSON.stringify(node.position) || crypto.randomUUID());
      }
      return cache.get(node);
    };
  }, []);

  // 1️⃣ Format raw input
  const formattedContent = useMemo(() => {
    if (!content || content.length === 0) return '';
    return content
      .trim()
      .replace(/^"(.*)"$/, '$1') // remove wrapping quotes if present
      .replace(/\\n/g, '\n'); // replace literal "\n" with real line breaks
  }, [content]);

  // 2️⃣ Enhanced processing for streaming content
  const processedContent = useMemo(() => {
    if (!formattedContent) return '';

    let processed = formattedContent;

    // First, handle complete thinking blocks
    const completeThinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/g;
    processed = processed.replace(completeThinkingRegex, (_match, inner) => {
      return `:::thinking\n${inner.trim()}\n:::\n\n`;
    });

    // Handle incomplete thinking blocks
    const openThinkingMatch = processed.match(
      /<thinking>(?![\s\S]*?<\/thinking>)/
    );
    if (openThinkingMatch) {
      const thinkingIndex = processed.indexOf('<thinking>');
      const beforeThinking = processed.substring(0, thinkingIndex);
      const thinkingContent = processed.substring(thinkingIndex + 10); // +10 for '<thinking>'

      const directiveType = 'thinking-streaming';
      processed =
        beforeThinking +
        `:::${directiveType}\n${thinkingContent.trim()}\n:::\n\n`;
    }

    return processed;
  }, [formattedContent, isStreaming]);

  // Clipboard copy
  const copyToClipboard = useCallback((text: string, uniqueKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedButtons((prev) => ({ ...prev, [uniqueKey]: true }));
    setTimeout(() => {
      setCopiedButtons((prev) => ({ ...prev, [uniqueKey]: false }));
    }, 2000);
  }, []);

  // Custom remark plugin for thinking blocks
  function remarkThinking() {
    return (tree: any) => {
      visit(tree, (node: any) => {
        if (node.type === 'containerDirective' && node.name === 'thinking') {
          node.data = {
            hName: 'div',
            hProperties: {
              className: 'thinking-block'
            }
          };
        }
        if (
          node.type === 'containerDirective' &&
          node.name === 'thinking-streaming'
        ) {
          node.data = {
            hName: 'div',
            hProperties: {
              className: 'thinking-block thinking-streaming'
            }
          };
        }
      });
    };
  }

  // Markdown custom renderers
  const components = useMemo(
    () => ({
      div: ({ node, className, children, ...props }: any) => {
        if (className?.includes('thinking-block')) {
          const isStreamingBlock = className?.includes('thinking-streaming');
          const [isOpen, setIsOpen] = React.useState(true);

          return (
            <div
              className={`bg-gray-100 text-gray-600 p-4 rounded-lg my-4 border border-gray-300 font-mono text-sm leading-relaxed`}
              style={{
                borderLeft: '4px solid #6b7280',
                backgroundColor: '#f9fafb'
              }}
            >
              {/* Header with toggle */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  💭 {isStreamingBlock ? 'Thinking (streaming...)' : 'Thinking Process'}
                </span>
                <button
                  className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  {isOpen ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Collapsible content */}
              {isOpen && (
                <div className="mt-2 whitespace-pre-wrap">{children}</div>
              )}
            </div>
          );
        }

        return (
          <div className={className} {...props}>
            {children}
          </div>
        );
      },
      code({ node, className, children, ...props }: any) {
        const match = className?.match(/language-(\w+)/);
        const codeText = String(children).trim();
        const uniqueKey = getUniqueKey(node);

        return match ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => copyToClipboard(codeText, uniqueKey)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '10px',
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #444',
                cursor: 'pointer',
                background: '#2d3748',
                color: '#e2e8f0',
                borderRadius: '4px',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4a5568';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2d3748';
              }}
            >
              {copiedButtons[uniqueKey] ? '✓ copied' : 'copy'}
            </button>
            <SyntaxHighlighter
              style={dracula}
              language={match[1] || 'plaintext'}
              PreTag="div"
              {...(props as React.ComponentProps<typeof SyntaxHighlighter>)}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code
            className={`bg-gray-100 px-1 py-0.5 rounded text-sm ${
              className || ''
            }`}
            {...props}
          >
            {children}
          </code>
        );
      },
      a: ({ href = '', children, ...props }: any) =>
        refs?.web_search ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
            className="p-2 border-none rounded-sm hover:text-blue-600 hover:bg-blue-50 mx-1 font-medium text-blue-500 transition-all duration-200"
          >
            {children}
          </a>
        ) : (
          refs?.refs && <HoverCardText children={children} refs={refs?.refs} />
        ),
      table: ({ children }: any) => (
        <table className="min-w-full border-collapse border border-gray-300 my-4 rounded-lg overflow-hidden">
          {children}
        </table>
      ),
      thead: ({ children }: any) => (
        <thead className="bg-gray-50 text-left">{children}</thead>
      ),
      tbody: ({ children }: any) => <tbody>{children}</tbody>,
      tr: ({ children }: any) => (
        <tr className="border-b border-gray-200 hover:bg-gray-50">{children}</tr>
      ),
      th: ({ children }: any) => (
        <th className="border-r border-gray-300 px-4 py-3 font-semibold text-gray-700">
          {children}
        </th>
      ),
      td: ({ children }: any) => (
        <td className="border-r border-gray-300 px-4 py-3 text-gray-600">
          {children}
        </td>
      )
    }),
    [refs, copiedButtons, getUniqueKey, copyToClipboard]
  );

  // Plugins
  const remarkPlugins = useMemo(
    () => [remarkMath, remarkGfm, remarkDirective, remarkThinking],
    [remarkThinking]
  );
  const rehypePlugins = useMemo(() => [rehypeKatex, rehypeRaw], []);

  return (
    <div>
      <div className="markdown-content prose prose-gray max-w-none">
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default React.memo(MarkdownComponent);
