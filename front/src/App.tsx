import { useEffect, useState } from 'react';
import { MessageType } from './shared/types/type';
import { chats } from './shared/types/datas';
import TopMenu from './features/top-menu/top-menu';
import ChatsHeader from './features/chats-header/chats-header';
import MessageBlock from './features/chat/message-block';
import ChatList from './features/chat-list/chat-list';
import Authorization from './features/authorization/auth';

export default function App() {
  const [chat_selected, select_chat] = useState<boolean>(false);
  const [chat_selected_id, select_chat_id] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(0);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [searchresults, setSearchResults] = useState<MessageType[]>([]);
  useEffect(() => {
    // Инициализация JS кода из FlyonUI если убрать модалки работать не будут!
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [isAuthorized, activeId, chat_selected]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-base-300 select-none">
      {window.electronAPI ? <TopMenu /> : ''}
      <main
        className={`flex flex-col overflow-y-hidden ${window.electronAPI && isAuthorized ? 'mt-6' : ''}`}
      >
        {!isAuthorized ? (
          <Authorization setIsAuthorized={setIsAuthorized} />
        ) : (
          <div className="h-screen w-auto flex max-h-svh flex-col">
            <ChatsHeader
              setIsAuthorized={setIsAuthorized}
              isAuthorized={isAuthorized}
              chat_selected={chat_selected}
              select_chat={select_chat}
              setActiveId={setActiveId}
              searchresults={searchresults}
              setSearchResults={setSearchResults}
            />
            <div className="flex flex-row justify-between overflow-y-hidden ">
              <ChatList
                activeId={activeId}
                setActiveId={setActiveId}
                chats={chats}
                chat_selected={chat_selected}
                select_chat={select_chat}
                searchresults={searchresults}
                setSearchResults={setSearchResults}
                select_chat_id={select_chat_id}
                chat_selected_id={chat_selected_id}
              />
              <MessageBlock
                chat_selected={chat_selected}
                select_chat_id={select_chat_id}
                chat_selected_id={chat_selected_id}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
