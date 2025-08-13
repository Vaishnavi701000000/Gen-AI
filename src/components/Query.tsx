// import React, { useState, useEffect, useRef } from "react";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
// import { HiOutlineClipboard, HiOutlineClipboardCheck } from "react-icons/hi";

// interface Props {
//   query: {
//     humanQuery: string;
//     sqlQuery: string;
//   };
// }

// const Query: React.FC<Props> = ({ query }) => {
//   const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
//   const intervalIdRef = useRef<number | null>(null);
//   const [copied, setCopied] = useState(false);
//   const copyToClipboard = () => {
//     const el = document.createElement("textarea");
//     el.value = currentWords.join(" ");
//     document.body.appendChild(el);
//     el.select();
//     document.execCommand("copy");
//     document.body.removeChild(el);
//     setCopied(true);
//   };

//   useEffect(() => {
//     setCurrentWordIndex(0);
//   }, [query.sqlQuery]);

//   useEffect(() => {
//     // Clear the interval if it exists when the component is unmounted or when the SQL query changes.
//     return () => {
//       if (intervalIdRef.current) {
//         clearInterval(intervalIdRef.current);
//         intervalIdRef.current = null;
//       }
//     };
//   }, [query.sqlQuery]);

//   useEffect(() => {
//     setCopied(false);
//     if (currentWordIndex < query.sqlQuery.split(" ").length) {
//       // Set up the interval if it doesn't exist yet.
//       window.scrollTo(0, document.body.scrollHeight);
//       if (!intervalIdRef.current) {
//         intervalIdRef.current = window.setInterval(() => {
//           setCurrentWordIndex((currentWordIndex) => currentWordIndex + 1);
//         }, 100);
//       }
//     } else {
//       // Clear the interval when we reach the end of the SQL query.
//       if (intervalIdRef.current) {
//         clearInterval(intervalIdRef.current);
//         intervalIdRef.current = null;
//       }
//     }
//   }, [currentWordIndex, query.sqlQuery]);

//   const words = query.sqlQuery.split(" ");
//   const currentWords = words.slice(0, currentWordIndex);

//   return (
//     <div
//       id="scroller"
//       className="flex flex-col items-center justify-center w-full h-full pt-5 lg:p-5"
//     >
//       <div
//         id="query"
//         className="
//         text-left
//         bg-black
//         rounded-lg
//         shadow-lg
//         w-full
//         sm:w-3/4 md:w-3/4 lg:w-3/4
//         p-5
//         text-gray-200
//         relative
//         "
//       >
//         <SyntaxHighlighter
//           language="sql"
//           style={dracula}
//           wrapLines={true}
//           customStyle={{
//             maxHeight: "none",
//             height: "auto",
//             overflow: "visible",
//             wordWrap: "break-word",
//             color: "inherit",
//             backgroundColor: "black",
//           }}
//           lineProps={{ style: { whiteSpace: "pre-wrap" } }}
//         >
//           {currentWords.join(" ")}
//         </SyntaxHighlighter>
//         {/* Copy Icon */}
//         <div className="absolute top-0 right-0 p-2" onClick={copyToClipboard}>
//           {
//             // If the current word index is equal to the total number of words, then we've reached the end of the SQL query.
//             query.sqlQuery !== "Generating Query..." &&
//               currentWordIndex === words.length &&
//               (copied ? (
//                 <HiOutlineClipboardCheck className="text-2xl text-green-500 cursor-pointer" />
//               ) : (
//                 <HiOutlineClipboard className="text-2xl text-gray-500 cursor-pointer" />
//               ))
//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Query;
import React, { useState, useEffect, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { HiOutlineClipboard, HiOutlineClipboardCheck } from "react-icons/hi";

interface Props {
  query: {
    humanQuery: string;
    sqlQuery: string;
    result?: any;
  };
}

const Query: React.FC<Props> = ({ query }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const intervalIdRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = currentWords.join(" ");
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  };

  useEffect(() => {
    setCurrentWordIndex(0);
  }, [query.sqlQuery]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [query.sqlQuery]);

  useEffect(() => {
    setCopied(false);
    if (currentWordIndex < query.sqlQuery.split(" ").length) {
      window.scrollTo(0, document.body.scrollHeight);
      if (!intervalIdRef.current) {
        intervalIdRef.current = window.setInterval(() => {
          setCurrentWordIndex((currentWordIndex) => currentWordIndex + 1);
        }, 100);
      }
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
  }, [currentWordIndex, query.sqlQuery]);

  const words = query.sqlQuery.split(" ");
  const currentWords = words.slice(0, currentWordIndex);

  return (
    <div
      id="scroller"
      className="flex flex-col items-center justify-center w-full h-full pt-5 lg:p-5"
    >
      <div
        id="query"
        className="
        text-left
        bg-black
        rounded-lg
        shadow-lg
        w-full
        sm:w-3/4 md:w-3/4 lg:w-3/4
        p-5
        text-gray-200
        relative
        "
      >
        <SyntaxHighlighter
          language="sql"
          style={dracula}
          wrapLines={true}
          customStyle={{
            maxHeight: "none",
            height: "auto",
            overflow: "visible",
            wordWrap: "break-word",
            color: "inherit",
            backgroundColor: "black",
          }}
          lineProps={{ style: { whiteSpace: "pre-wrap" } }}
        >
          {currentWords.join(" ")}
        </SyntaxHighlighter>

        {/* Copy Icon */}
        <div className="absolute top-0 right-0 p-2" onClick={copyToClipboard}>
          {query.sqlQuery !== "Generating Query..." &&
            currentWordIndex === words.length &&
            (copied ? (
              <HiOutlineClipboardCheck className="text-2xl text-green-500 cursor-pointer" />
            ) : (
              <HiOutlineClipboard className="text-2xl text-gray-500 cursor-pointer" />
            ))}
        </div>

        {/* SQL Result */}
        {query.result && (
          <div className="mt-4">
            <span className="text-green-400 font-semibold">Result:</span>
            <pre className="text-white whitespace-pre-wrap break-words">
              {typeof query.result === "string"
                ? query.result
                : JSON.stringify(query.result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
