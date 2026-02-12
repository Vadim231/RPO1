import { LuPinOff } from "react-icons/lu";
import Button from "../button/button";

export default function PinnedMessage() {
    return (
        <div className="w-full h-14 pt-1 pb-1 bg-base-200/80 pl-4 pr-4 flex justify-between">
            <div className="flex flex-col justify-center">
                <span className="">Закрепленное сообщение</span>
                <small className="text-base-content/40">Текст сообщения</small>
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex flex-row justify-between w-full">
                    <div className="mr-0.0">
                        <Button style="soft" icon={<LuPinOff />} color="transparent" modifier="circle" onClick={() => { }} />
                    </div>
                </div>
            </div>
        </div>
    )
}