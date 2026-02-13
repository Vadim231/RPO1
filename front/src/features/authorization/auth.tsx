import Button from "@/shared/components/button/button";
import Input from "@/shared/components/input/input";
import { PropsWithChildren, ReactElement } from "react";
interface AuthProps {
  isAuthorized?: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Authorization({
  setIsAuthorized
}: PropsWithChildren<AuthProps>): ReactElement {
  return (
    <div className="flex flex-col justify-center overflow-y-hidden h-screen w-screen">
      <div className="self-center
        min-h-10/12
        w-10/12 h-fit
        sm:w-1/2 sm:h-fit sm:min-h-1/2
        md:w-1/3 md:h-fit md:min-h-1/3
        lg:w-1/4 lg:h-fit lg:min-h-1/3
        xl:w-1/4 xl:h-fit xl:min-h-1/3
        2xl:w-1/4 2xl:h-fit 2xl:min-h-1/4
        bg-base-200 rounded-2xl 
        flex flex-col justify-center
        ">
        <div className="flex flex-row justify-center w-full p-4">
          <div className="flex flex-col justify-center w-full">
            <div className="mb-6 text-center"><span className=" text-2xl" >Авторизация</span></div>
            <div className="mb-3"><Input label="Имя" component="floating" modifier="unfocus" shape="circled" placeholder="Ivan" /></div>
            <div className="mb-3"><Input label="Фамилия" component="floating" modifier="unfocus" shape="circled" placeholder="Ivanov" /></div>
            <div className="mb-3"><Input label="Имя пользователя" component="floating" modifier="unfocus" shape="circled" placeholder="@username" /></div>
            <div className="mb-3"><Input label="Номер телефона" component="floating" modifier="unfocus" shape="circled" placeholder="+79134567890" /></div>
            <div className="mb-3"><Button modifier="rounded_block" label="Войти" onClick={() => { setIsAuthorized(true) }} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}