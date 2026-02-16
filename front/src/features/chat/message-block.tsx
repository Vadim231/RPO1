import Message from './message';
import MessageArea from '../message-area/message-area';
import { PropsWithChildren, ReactElement } from 'react';

import PinnedMessage from '../pinned-message/pinned-message';
import { dialogs } from '@/shared/types/datas';

interface MessageBlockProps {
  chat_selected: boolean;
  chat_selected_id?: number;
  select_chat_id?: React.Dispatch<React.SetStateAction<number>>;
}

export default function MessageBlock({
  chat_selected,
  chat_selected_id,
}: PropsWithChildren<MessageBlockProps>): ReactElement {
  const filtereddialogs = dialogs.filter(
    (message) => message.chat_id === chat_selected_id
  );
  return (
    <div
      className={`bg-neutral-content ${chat_selected ? 'flex' : 'hidden'} sm:flex flex-col justify-between w-full `}
    >
      {chat_selected ? (
        <>
          <PinnedMessage
            // isPinned={true}
            message={'Привет это сообщение закреплено!'}
            onUnpin={() => {}}
          />
          <div
            className={`h-screen ${window.electronAPI ? '' : 'pb-14'} pl-4 pr-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          >
            {filtereddialogs.length === 0 ? (
              <div className="flex flex-col justify-center h-full text-center self-center">
                Кажется у вас пока что нет сообщений в этом чате!
                <br /> Начните диалог →
              </div>
            ) : (
              filtereddialogs.map((message) => {
                return (
                  <Message
                    key={message.id}
                    messageId={message.message_id.toString()}
                    userName={message.user_name}
                    userAvatar={message.user_avatar}
                    timeStamp={message.sent_at}
                    message_status={message.message_status}
                    messageText={message.message_content}
                    modifier={message.modifier}
                  />
                );
              })
            )}
          </div>
          <MessageArea />
        </>
      ) : (
        <div
          className={`${!chat_selected ? 'hidden' : 'flex'} select-none sm:flex md:flex lg:flex text-center justify-center items-center flex-col h-full bg-base-100`}
        >
          <span className="bg-base-300/80 text-accent-content rounded-3xl p-2 w-fit">
            Выберите, кому хотели бы написать
          </span>
        </div>
      )}
    </div>
  );
}
