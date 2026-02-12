import { FaMagnifyingGlass, FaRegMessage } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import { TbBrandTelegram } from "react-icons/tb";
import Button from "../button/button";
import Input from "../input/input";
import { PropsWithChildren, ReactElement } from "react";
import { FaArrowLeft } from "react-icons/fa";
interface HeaderProps {
	chat_selected: boolean;
	chat_selected_id?: number;
	select_chat: React.Dispatch<React.SetStateAction<boolean>>;
	setActiveId: React.Dispatch<React.SetStateAction<number | null>>;
}
export default function ChatsHeader({ chat_selected, select_chat, setActiveId }: PropsWithChildren<HeaderProps>): ReactElement {
	return (
		<>
			<div className={`flex flex-row h-14 w-full justify-between bg-base-300`}>
				<div className={`h-full w-full sm:w-1/2 sm:flex md:flex lg:flex bg-base flex-col ${chat_selected ? "hidden sm:flex" : "flex"}`}>
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
				<div className={`h-full w-full sm:w-full pt-1 pb-1 flex ${chat_selected ? "bg-base-200" : "bg-base-100 hidden sm:flex"}  justify-between`}>
					{chat_selected ? (
						<>
							<div className={`flex flex-row justify-start items-center ml-2`}>
								<div className={`flex sm:hidden`}>{/* sm:hidden */}
									<Button style="soft" icon={<FaArrowLeft />} color="transparent" modifier="circle" onClick={() => {
										select_chat(false); setActiveId(null)
									}} />
								</div>
								<div className={`flex flex-col justify-center ml-4 mt-1 mb-1 mr-2 ${chat_selected ? "flex" : "hidden"}`}>
									<span className="">chatname | username</span>
									<small className="text-base-content/40">last seen at... | X subs</small>
								</div>
							</div>
							<div className={`flex flex-col justify-center ml-4 mt-1 mb-1 mr-2 ${chat_selected ? "flex" : "hidden"}`}>
								<div className="flex flex-row justify-between w-full">
									<div className="mr-1.5"><Button style="soft" icon={<FaMagnifyingGlass />} color="transparent" modifier="circle" onClick={() => { }} /></div>
									<div className="hidden sm:block mr-1.5"><Button style="soft" icon={<FaRegMessage />} color="transparent" modifier="circle" onClick={() => { }} /></div>
									<div className="mr-1.5"><Button style="soft" icon={<TbBrandTelegram />} color="transparent" modifier="circle" onClick={() => { }} /></div>
									<div className="mr-0.0"><Button style="soft" icon={<MdMoreVert size={20} />} color="transparent" modifier="circle" onClick={() => { }} /></div>
								</div>
							</div>
						</>
					) : ""}
				</div>
			</div >
		</>
	)
}