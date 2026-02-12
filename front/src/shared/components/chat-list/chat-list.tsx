import { PropsWithChildren, ReactElement, useState } from "react";
import { MessageType } from "../../types/type";
import ChatItem from "./chat-item";

interface ChatListProps {
    chats: MessageType[] | undefined;
    chat_selected: boolean;
    select_chat: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ChatList({
    chats,
    chat_selected,
    select_chat
}: PropsWithChildren<ChatListProps>): ReactElement {
    const [activeId, setActiveId] = useState<number>();
    return (
        <div className={`w-full sm:w-1/2 bg-primary/15 
            ${chat_selected ? "hidden" : "sm:block"}
            sm:block
            ${window.electronAPI ? "pb-6" : "pb-14"} 
            overflow-y-scroll [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none] [scrollbar-width:none]`}>
            {chats == undefined || chats?.length == 0 ?
                <div className="flex flex-col justify-center h-full text-center self-center">
                    Кажется у вас пока что нет чатов!
                    <br /> Начните новый →
                </div>
                :
                (
                    chats?.map((chat) => {
                        return (
                            <ChatItem
                                key={chat.chat_id}
                                chat={chat}
                                isActive={String(activeId) === String(chat.chat_id)}
                                onClick={() => { setActiveId(chat.chat_id); select_chat(true); console.log(chat_selected) }}
                                unreadmsg={0}
                            />
                        )
                    })
                )}
        </div>
    )
}