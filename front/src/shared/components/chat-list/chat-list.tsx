import { PropsWithChildren, ReactElement, useState } from "react";
import { MessageType } from "../../types/type";
import ChatItem from "./chat-item";

interface ChatListProps {
    chats: MessageType[] | undefined;
}
export default function ChatList({
    chats,
}: PropsWithChildren<ChatListProps>): ReactElement {
    const [activeId, setActiveId] = useState<number>();
    return (
        <>
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
                                onClick={() => { setActiveId(chat.chat_id); } } 
                                unreadmsg={0}
                            />
                        )
                    })
                )}
        </>
    )
}