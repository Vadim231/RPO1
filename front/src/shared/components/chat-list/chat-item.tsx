import { PropsWithChildren, ReactElement } from "react"
import Avatar from "../avatar/avatar";
import { MessageType } from "../../types/type";
interface ChatItemProps {
    onClick?: () => void;
    chat: MessageType | undefined;
    isActive: boolean | false;
    unreadmsg: number;
}
export default function ChatItem({ chat, isActive, onClick, unreadmsg }: PropsWithChildren<ChatItemProps>): ReactElement {
    return (
        <ul className={`
        *:p-3
        hover:bg-accent/25
        select-none
        ${isActive ? 'bg-neutral/25 hover:bg-neutral/25' : ""}`}
            onClick={() => { onClick?.(); }}
        >
            <li className="flex justify-center sm:items-start md:items-start lg:items-start select-none cursor-pointer">
                <div className="flex w-13 me-3 justify-center md:flex lg:flex">
                    <Avatar badge="bottom" status="none" size="10" iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png" isChat={false} />
                </div>
                <div className="sm:flex md:flex lg:flex grow flex-col items-start justify-between sm:flex-row ">
                    <div className="">
                        <h6 className="text-base text-base-content">{chat?.user_id}</h6>
                        <small className="text-base-content/50 text-sm">{chat!.message_content!.length > 25 ? chat?.message_content.substring(0, 25) + '...' : chat?.message_content}</small>
                    </div>
                    <div className="flex sm:flex md:flex lg:flex flex-col items-end gap-x-2 gap-y-4">
                        <span className="text-base-content/50 text-xs">{chat?.sent_at.toString()}</span>
                        {unreadmsg > 0 ? (
                            <span className="badge badge-success badge-xs rounded-full">10</span>
                        ) : ""
                        }

                    </div>
                </div>
            </li>
        </ul>
    )
}