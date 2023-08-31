import * as React from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    // Use the inner ref if a forwarded ref is not provided
    const textareaRef = forwardedRef || innerRef;

    useEffect(() => {
      const textarea = (textareaRef as React.RefObject<HTMLTextAreaElement>).current;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on the scrollHeight
      }
    }, [props.value, textareaRef]);

    return (
      <textarea
        ref={textareaRef as React.Ref<HTMLTextAreaElement>} // Cast the ref to be sure it is compatible
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
