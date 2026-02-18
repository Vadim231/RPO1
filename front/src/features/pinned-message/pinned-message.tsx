import { LuPinOff } from 'react-icons/lu';
import Button from '../../shared/components/button/button';
import { PropsWithChildren, ReactElement } from 'react';
interface PinnedMessageProps {
  message: string;
  isPinned?: boolean;
  onUnpin: () => void;
}
export default function PinnedMessage({
  message = 'текст закрепа',
  onUnpin,
  isPinned = false,
}: PropsWithChildren<PinnedMessageProps>): ReactElement {
  return (
    <div
      className={`${!isPinned && 'hidden'} 
    w-full 
    h-14 
    pt-1 pb-1 pl-4 pr-4
    bg-base-100
    flex justify-between
    `}
    >
      <div className="flex flex-col justify-center border-l-2 border-primary pl-3">
        <span className="text-primary text-sm font-medium">
          Закрепленное сообщение
        </span>
        <small className="text-base-content/40">{message}</small>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-between w-full">
          <div className="mr-0.0">
            <Button
              style="soft"
              icon={<LuPinOff />}
              color="transparent"
              modifier="circle"
              onClick={() => {
                onUnpin;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
