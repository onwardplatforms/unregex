import * as React from 'react';
import { useState } from 'react';
import { Check, CopyIcon } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { cn } from '@/lib/utils';

// Define props interface, making 'language' optional
export interface CopyBoxProps {
  text: string;
  language?: string;
  className?: string;
}

// Use the defined props interface in the component signature
const Copybox: React.FC<CopyBoxProps> = ({ text, language, className }) => {
  const [showCopy, setShowCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  const boxClasses = cn(
    'relative font-light justify-start items-center text-sm flex break-all border mr-2 mt-2 py-2 px-4 pr-8 cursor-pointer rounded-lg border-border dark:hover:border-gray-200 hover:border-gray-500 transition-all min-h-[40px]',
    className
  );

  return (
    <div className="flex justify-start items-center">
      <div
        onMouseEnter={() => setShowCopy(true)}
        onMouseLeave={() => setShowCopy(false)}
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
        }}
        className={boxClasses}
      >
        {showCopy && (
          <div className="absolute justify-center right-2">
            {copied ? <Check width={16} /> : <CopyIcon width={16} />}
          </div>
        )}
        <span className="flex-1 whitespace-pre-wrap">
          {language ? (
            // <SyntaxHighlighter language={language} style={docco}>
            //   {text}
            // </SyntaxHighlighter>
            text
          ) : (
            text || '\u00A0'
          )}
        </span>
      </div>
    </div>
  );
};

Copybox.displayName = 'Copybox';

export { Copybox };
