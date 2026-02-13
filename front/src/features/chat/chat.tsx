import { PropsWithChildren, ReactElement, ReactNode } from 'react';

type modifier = 'sender' | 'reciever';

interface ChatProps {
  modifier: modifier;
  message: ReactNode;
}
export default function Chat({
  modifier,
  message,
}: PropsWithChildren<ChatProps>): ReactElement {
  return (
    <>
      {modifier == 'sender' ? (
        <>
          <div key="chat-sender-box" className="chat chat-sender">
            {message}
          </div>
        </>
      ) : modifier == 'reciever' ? (
        <div key="chat-reciever-box" className="chat chat-receiver">
          {message}
        </div>
      ) : (
        'modifier is not selected!'
      )}
    </>
  );
}
