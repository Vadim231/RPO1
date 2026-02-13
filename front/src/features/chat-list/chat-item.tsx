import { PropsWithChildren, ReactElement } from 'react';
import Avatar from '../../shared/components/avatar/avatar';
import { MessageType } from '../../shared/types/type';
interface ChatItemProps {
  onClick?: () => void;
  chat: MessageType | undefined;
  isActive: boolean | false;
  unreadmsg: number;
}
export default function ChatItem({
  chat,
  isActive,
  onClick,
  unreadmsg,
}: PropsWithChildren<ChatItemProps>): ReactElement {
  return (
    <ul
      className={`
    flex items-center px-3 py-2 cursor-pointer transition-colors select-none
    ${isActive ? 'bg-base-100/50' : 'bg-base-200 hover:bg-base-100/50'}
  `}
      onClick={() => onClick?.()}
    >
      <li className="flex w-full items-center gap-3">
        {/* Аватар */}
        <div className="relative flex-shrink-0">
          <Avatar
            size="10"
            iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png"
            isChat={false}
          />
          {/* Если есть онлайн-статус, он будет здесь */}
        </div>

        {/* Контент чата */}
        <div className="flex flex-col grow min-w-0 overflow-hidden">
          {/* Первая строка: Имя и Время */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-1 min-w-0">
              <h6 className="text-[15px] font-semibold text-base-content truncate">
                {chat?.user_id}
              </h6>
              {/* Иконка мегафона/группы если нужно */}
              <span className="icon-[tabler--volume] size-3.5 text-base-content/40"></span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Иконка галочек (прочитано) */}
              <span className="icon-[tabler--checks] size-4 text-blue-400"></span>
              <span className="text-[13px] text-base-content/40">
                {/* Форматирование времени: 11:41 или Вт */}
                {chat?.sent_at.toString()}
              </span>
            </div>
          </div>

          {/* Вторая строка: Сообщение и Счетчики */}
          <div className="flex justify-between items-start gap-2 mt-0.5">
            <p className="text-[14px] text-base-content/80 line-clamp-1 break-all">
              {/* Если есть префикс автора в группе */}
              <span className="text-blue-400 mr-1">Username:</span>
              {chat?.message_content}
            </p>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Иконка закрепленного чата (pin) */}
              <span className="icon-[tabler--pin] size-4 text-base-content/90 rotate-45"></span>
              {unreadmsg > 0 && (
                <span className="badge badge-soft badge-info rounded-full text-[11px] px-1.5 h-5 min-w-5 border-none bg-[#419fd9] text-base-content">
                  {unreadmsg}
                </span>
              )}
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}
