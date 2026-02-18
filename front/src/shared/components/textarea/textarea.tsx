import { PropsWithChildren, ReactElement } from 'react';
interface Textareaprops {
  placeholder?: string;
}
export default function Textarea({
  placeholder = '',
}: PropsWithChildren<Textareaprops>): ReactElement {
  return (
    <textarea
      rows={1}
      onChange={(e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      className="textarea
      textarea-primary
      w-full h-auto max-h-28
      text-start 
      min-h-10
      resize-none leading-tight
      no-focus border-0
      rouded-lg
      overflow-y-scroll
      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      placeholder={placeholder}
    />
  );
}
