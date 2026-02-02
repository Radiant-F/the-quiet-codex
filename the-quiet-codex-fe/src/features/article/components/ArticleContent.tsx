interface ArticleContentProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML article content with proper styling.
 * The HTML is sanitized on the backend using DOMPurify before storage.
 */
export function ArticleContent({ html, className = "" }: ArticleContentProps) {
  return (
    <div
      className={`article-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
