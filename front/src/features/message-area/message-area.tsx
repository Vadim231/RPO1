import { FaPaperclip, FaTelegramPlane } from 'react-icons/fa';
import Button from '../../shared/components/button/button';
import Textarea from '../../shared/components/textarea/textarea';

export default function MessageArea() {
  return (
    <div
      className={`w-full min-h-14 h-auto max-h-42 ${window.electronAPI ? 'mb-6' : ''} 
      bg-neutral-content/50 pt-2 pb-2 pl-4 pr-4 flex flex-row items-center`}
    >
      <div className="mr-2">
        <Button
          onClick={() => {}}
          icon={<FaPaperclip />}
          color="transparent"
          modifier="circle"
          style="soft"
        />
      </div>
      <div
        className="mr-2 items-center w-full h-full max-h-42 overflow-y-scroll 
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <Textarea placeholder="Введите сообщение..." />
      </div>
      <div className="mr-2 items-center">
        <Button
          onClick={() => {}}
          icon={<FaTelegramPlane />}
          color="info"
          modifier="circle"
          style="soft"
        />
      </div>
    </div>
  );
}
