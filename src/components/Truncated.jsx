import { useRef, useEffect } from 'react';

function Truncated({ text, maxLines, className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const textNode = container.querySelector('.text-node');
    const lineHeight = parseInt(getComputedStyle(textNode).lineHeight);

    const observer = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect;
      const numLines = Math.round(height / lineHeight);

      if (numLines > maxLines) {
        textNode.style.webkitLineClamp = `${maxLines}`;
        textNode.style.overflow = 'hidden';
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [text, maxLines]);

  return (
    <div ref={containerRef} className={className + "truncate"}>
      <p className="text-node">{text}</p>
    </div>
  );
}


export default Truncated;
