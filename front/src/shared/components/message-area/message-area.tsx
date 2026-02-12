import { FaPaperclip, FaTelegramPlane } from "react-icons/fa";
import Button from "../button/button";
import Textarea from "../textarea/textarea";

export default function MessageArea() {
    return (
        <div className={`w-full min-h-14 h-auto max-h-42 ${window.electronAPI ? "mb-6" : ""} bg-base-100 pt-1 pb-1 text-base-100 pl-4 pr-4 flex justify-between items-center`}>
            <div className="mr-2">
                <Button onClick={() => { }} icon={<FaPaperclip />} color="transparent" modifier="circle" style="soft" />
            </div>
            <div className="w-full h-full max-h-42 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Textarea placeholder="Введите сообщение..." />
            </div>
            <div className="mr-2">
                <Button onClick={() => { }} icon={<FaTelegramPlane />} color="primary" modifier="circle" style="soft" />
            </div>
        </div>
    )
}