import { PropsWithChildren, ReactElement, useState } from 'react';
import Signup from './components/signup';
import Signin from './components/signin';
interface AuthProps {
  isAuthorized?: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Authorization({
  setIsAuthorized,
}: PropsWithChildren<AuthProps>): ReactElement {
  type AuthState = 'signin' | 'signup';
  const [authState, setAuthState] = useState<AuthState>('signin');
  const changeAuthState = () => {
    setAuthState((authState) => (authState === 'signup' ? 'signin' : 'signup'));
  };
  return (
    <div className="flex flex-col justify-center overflow-y-hidden h-screen w-screen">
      <div
        className="self-center
        min-h-10/12
        w-10/12 h-fit
        sm:w-1/2 sm:h-fit sm:min-h-1/2
        md:w-1/3 md:h-fit md:min-h-1/3
        lg:w-1/4 lg:h-fit lg:min-h-1/3
        xl:w-1/4 xl:h-fit xl:min-h-1/3
        2xl:w-1/4 2xl:h-fit 2xl:min-h-1/4
        bg-base-200 rounded-2xl 
        flex flex-col justify-center
        "
      >
        <div className="flex flex-row justify-center w-full p-4">
          <div className="flex flex-col justify-center w-full">
            <div className="mb-6 text-center">
              <span className=" text-2xl">
                {authState == 'signup' ? 'Регистрация' : 'Авторизация'}
              </span>
            </div>
            {authState === 'signup' ? (
              <Signup setIsAuthorized={setIsAuthorized} />
            ) : (
              <Signin setIsAuthorized={setIsAuthorized} />
            )}
            <span
              className="text-sm text-center text-base-content/50 hover:text-base-content/60 active:text-base-content/70"
              onClick={() => {
                changeAuthState();
              }}
            >
              {authState == 'signup'
                ? 'Есть аккаунт? Войти →'
                : 'Нет аккаунта? Создать →'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
