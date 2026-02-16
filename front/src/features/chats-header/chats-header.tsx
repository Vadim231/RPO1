import { FaMagnifyingGlass, FaRegMessage } from 'react-icons/fa6';
import { MdMoreVert } from 'react-icons/md';
import { TbBrandTelegram } from 'react-icons/tb';
import Button from '../../shared/components/button/button';
// import Input from "../input/input";
import { PropsWithChildren, ReactElement } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Settings from '../settings/settings';
interface HeaderProps {
  chat_selected: boolean;
  chat_selected_id?: number;
  select_chat: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveId: React.Dispatch<React.SetStateAction<number | null>>;
  isAuthorized: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ChatsHeader({
  chat_selected,
  select_chat,
  setActiveId,
  isAuthorized,
  setIsAuthorized
}: PropsWithChildren<HeaderProps>): ReactElement {
  return (
    <>
      <Settings 
        isAuthorized={isAuthorized}
        setIsAuthorized={setIsAuthorized}
        select_chat={select_chat}
        setActiveId={setActiveId}
      />
      <div className={`flex flex-row h-14 w-full justify-between bg-base-300`}>
        <div
          className={`h-full w-full sm:w-1/2 bg-base-100 flex flex-col ${chat_selected ? 'hidden sm:flex' : 'flex'}`}
        >
          {/* Контейнер верхней панели */}
          <div className="flex items-center gap-2 px-3 py-2">
            {/* Кнопка-бургер (Menu) */}
            <button
              type="button"
              className="btn btn-soft bg-transparent btn-circle text-base-content/60 hover:bg-base-content/5"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="overlay-custom-backdrop-2"
              data-overlay="#overlay-custom-backdrop-2"
              data-overlay-options='{ "backdropClasses": "transition duration-300 fixed inset-0 bg-neutral-content/40 overlay-backdrop" }'
            >
              <span className="icon-[tabler--menu-2] size-6"></span>
              {/* Или ваша иконка MdMenu */}
            </button>

            {/* Поле поиска с аватарками внутри */}
            <div className="relative grow">
              {/* Иконка лупы (опционально, в ТГ появляется при фокусе) */}
              <input
                type="text"
                className="input input-sm w-full bg-base-200 no-focus border-none rounded-full py-5 px-4 text-sm text-base-content placeholder:text-base-content/50 focus:outline-none focus:ring-0"
                placeholder="Поиск"
              />

              {/* Стак аватарок в правой части инпута */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                  <div className="avatar size-7 border-2 border-base-100">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png"
                      alt="av1"
                    />
                  </div>
                  <div className="avatar size-7 border-2 border-base-100">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png"
                      alt="av2"
                    />
                  </div>
                  <div className="avatar size-7 border-2 border-base-100">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png"
                      alt="av3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`h-full w-full sm:w-full pt-1 pb-1 flex ${chat_selected ? 'bg-base-100' : 'bg-base-100 hidden sm:flex'}  justify-between`}
        >
          {chat_selected ? (
            <>
              <div className={`flex flex-row justify-start items-center ml-2`}>
                <div className={`flex sm:hidden`}>
                  {/* sm:hidden */}
                  <Button
                    style="soft"
                    icon={<FaArrowLeft />}
                    color="transparent"
                    modifier="circle"
                    onClick={() => {
                      select_chat(false);
                      setActiveId(null);
                    }}
                  />
                </div>
                <div
                  className={`flex flex-col justify-center ml-4 mt-1 mb-1 mr-2 ${chat_selected ? 'flex' : 'hidden'}`}
                >
                  <span className="">chatname | username</span>
                  <small className="text-base-content/40">
                    last seen at... | X subs
                  </small>
                </div>
              </div>
              <div
                className={`flex flex-col justify-center ml-4 mt-1 mb-1 mr-2 ${chat_selected ? 'flex' : 'hidden'}`}
              >
                <div className="flex flex-row justify-between w-full">
                  <div className="mr-1.5">
                    <Button
                      style="soft"
                      icon={<FaMagnifyingGlass />}
                      color="transparent"
                      modifier="circle"
                      onClick={() => { }}
                    />
                  </div>
                  <div className="hidden sm:block mr-1.5">
                    <Button
                      style="soft"
                      icon={<FaRegMessage />}
                      color="transparent"
                      modifier="circle"
                      onClick={() => { }}
                    />
                  </div>
                  <div className="mr-1.5">
                    <Button
                      style="soft"
                      icon={<TbBrandTelegram />}
                      color="transparent"
                      modifier="circle"
                      onClick={() => { }}
                    />
                  </div>
                  <div className="mr-0.0">
                    <Button
                      style="soft"
                      icon={<MdMoreVert size={20} />}
                      color="transparent"
                      modifier="circle"
                      onClick={() => { }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
}
