import React, { useEffect, useState } from "react";
import "./styles.css";

export default function TypeText({ texts }: { texts: string[] }) {
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[wordIndex];

      if (!isDeleting) {
        setDisplayedText(currentText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        setDisplayedText(currentText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }

      if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 500);
      }

      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % texts.length);
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? 40 : 50);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, texts]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <h1 className="text-center inter-tight-bold">
        {displayedText}
        <span className="text-primary">|</span>
      </h1>
    </div>
  );
}
