import { FaMagnifyingGlass, FaRegMessage } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import { TbBrandTelegram } from "react-icons/tb";
import Button from "../button/button";
import Input from "../input/input";

export default function ChatsHeader() {
    return (
        <div className="flex flex-row justify-between h-18 w-full bg-base-300 ">
            <div className="hidden sm:flex md:flex lg:flex w-1/3 bg-base flex-col justify-center">
                <div className="flex flex-row justify-between">
                    <div className="mr-1 ml-2 flex flex-col justify-center">
                        <Button style="soft" icon={
                            <MdMoreVert size={24} />
                        } color="transparent" modifier="circle" onClick={() => { }} />
                    </div>
                    <div className="mr-2 ml-1 w-full">
                        <Input modifier="unfocus" shape="circled" placeholder="Поиск" />
                    </div>
                </div>
            </div>
            <div className="w-full h-full pt-1 pb-1 bg-base-200 flex justify-between">
                <div className="flex flex-col justify-center ml-4 mt-1 mb-1 mr-2">
                    <span className="">chatname | username</span>
                    <small className="text-base-content/40">last seen at... | X subs</small>
                </div>
                <div className="flex flex-col justify-center ml-4 mt-1 mb-1 mr-2">
                    <div className="flex flex-row justify-between w-full">
                        <div className="mr-1.5"><Button style="soft" icon={<FaMagnifyingGlass />} color="transparent" modifier="circle" onClick={() => { }} /></div>
                        <div className="mr-1.5"><Button style="soft" icon={<FaRegMessage />} color="transparent" modifier="circle" onClick={() => { }} /></div>
                        <div className="mr-1.5"><Button style="soft" icon={<TbBrandTelegram />} color="transparent" modifier="circle" onClick={() => { }} /></div>
                        <div className="mr-0.0"><Button style="soft" icon={<MdMoreVert size={20} />} color="transparent" modifier="circle" onClick={() => { }} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}