import React, { useEffect, useState } from "react";

const TypingEffect = ({ text, speed = 10 }) => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setResponse((prev) => prev + text[i]);
      i++;
      if (i >= text?.length - 1) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="text-gray-800 border border-stone-200 p-4 w-fit max-w-[60%] rounded-lg bg-slate-50">
      {response}
    </p>
  );
};

export default TypingEffect;
