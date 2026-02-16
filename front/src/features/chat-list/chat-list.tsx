import { PropsWithChildren, ReactElement } from 'react';
import ChatItem from './chat-item';
import { ChatType, MessageType } from '../../shared/types/type';

interface ChatListProps {
  chats: ChatType[] | undefined;
  chat_selected: boolean;
  select_chat: React.Dispatch<React.SetStateAction<boolean>>;
  activeId: number | null;
  setActiveId: React.Dispatch<React.SetStateAction<number | null>>;
  searchresults: MessageType[] | undefined;
  setSearchResults: React.Dispatch<React.SetStateAction<MessageType[]>>;
  chat_selected_id: number;
  select_chat_id: React.Dispatch<React.SetStateAction<number>>;
}
export default function ChatList({
  chats,
  chat_selected,
  select_chat,
  activeId,
  setActiveId,
  searchresults,
  select_chat_id,
}: PropsWithChildren<ChatListProps>): ReactElement {
  return (
    <div
      className={`w-full sm:w-1/2
            ${chat_selected ? 'hidden' : 'sm:block'}
            sm:block
            ${window.electronAPI ? 'pb-6' : ''} 
            overflow-y-scroll [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none] [scrollbar-width:none]`}
    >
      {chats == undefined || chats?.length == 0 ? (
        <div className="flex flex-col justify-center h-full text-center self-center">
          Кажется у вас пока что нет чатов!
          <br /> Начните новый →
        </div>
      ) : (
        searchresults?.map((chat, index) => {
          return (
            <ChatItem
              key={index}
              chat={chat}
              isActive={String(activeId) === String(chat.chat_id)}
              onClick={() => {
                setActiveId(chat.chat_id);
                select_chat(true);
                select_chat_id(chat.chat_id);
                console.log(chat.chat_id);
              }}
              unreadmsg={0}
            />
          );
        })
      )}
    </div>
  );
}
