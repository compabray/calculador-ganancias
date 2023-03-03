import { useState, useEffect } from "react";


function Truncated ({text, maxLines, className}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const lineHeight = parseInt(window.getComputedStyle(container).lineHeight);

        const maxLineHeight = maxLines * lineHeight;
        const textHeight = container.scrollHeight;

        if (textHeight > maxLineHeight) {
            container.style.height = `${maxLineHeight}px`;
            container.style.overflow = 'hidden';
            container.style.textOverflow = 'ellipsis';
        }

    }, [maxLines, text]);


    return (
        <p className={className ? className : ""} ref={containerRef}>
            {text}
        </p>
    );
}


export default Truncated;
