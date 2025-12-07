import React from "react";
import { Button } from "reactstrap";

const LessonPlanDisplay = ({ response, courses, onCourseClick }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Convert markdown links to clickable HTML links
  const renderMarkdownLinks = (text) => {
    if (!text) return null;

    const parts = [];
    let lastIndex = 0;

    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add the link
      const linkText = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#00B894", textDecoration: "underline" }}
        >
          {linkText}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Split by lines and render each line with link parsing
  const renderContent = () => {
    const lines = response.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {renderMarkdownLinks(line)}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Convert markdown links to HTML for printing
    const htmlContent = response.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lesson Plan</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #000;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 1cm;
            }
            h1, h2, h3 { color: #000; margin-top: 1em; }
            a { color: #00B894; text-decoration: underline; }
            @media print {
              body { margin: 1cm; }
              a { color: #000; }
            }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: inherit;">${htmlContent}</pre>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="lesson-plan-output">
      <div className="lesson-plan-section p-4 bg-white border rounded shadow-sm">
        <div className="d-flex justify-content-end align-items-start mb-3 gap-2">
          <Button
            size="sm"
            outline
            color="secondary"
            onClick={handlePrint}
            title="Print lesson plan"
          >
            <span className="me-1">🖨️</span>
            Print
          </Button>
          <Button
            size="sm"
            color={copied ? "success" : "primary"}
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <span className="me-1">✓</span>
                Copied!
              </>
            ) : (
              <>
                <span className="me-1">📋</span>
                Copy
              </>
            )}
          </Button>
        </div>
        <div
          className="lesson-plan-content"
          style={{ fontSize: "1rem", lineHeight: "1.6" }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanDisplay;
