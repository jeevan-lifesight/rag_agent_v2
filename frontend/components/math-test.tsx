import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MathTest() {
  const content = `
This is inline math $E=mc^2$ and block math:

$$
\\text{iFactor} = \\frac{\\text{iConversions}}{\\text{pConversions}}
$$
  `;
  return (
    <div style={{ padding: 24 }}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 