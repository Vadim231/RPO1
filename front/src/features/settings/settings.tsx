import Avatar from '@/shared/components/avatar/avatar';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';

interface SettingsProps {
  isAuthorized?: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  select_chat: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function Settings({
  setIsAuthorized,
  select_chat,
  setActiveId,
}: PropsWithChildren<SettingsProps>): ReactElement {
  type Theme = 'perplexity' | 'vscode' | 'light' | 'dark';
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'perplexity'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'perplexity' ? 'dark' : 'perplexity'));
  };
  return (
    <>
      <aside
        id="overlay-custom-backdrop-2"
        className="overlay overlay-open:translate-x-0 drawer drawer-start hidden max-w-72 bg-base-200 text-base-content"
        tabIndex={-1}
      >
        {/* Верхняя часть с профилем */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <Avatar
              size="16"
              isChat={false}
              iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png"
            />
            {/* Кнопка закрытия (опционально, в ТГ ее нет, но для UI полезна) */}
            <button
              type="button"
              className="btn btn-text btn-circle btn-sm text-base-content/50"
              data-overlay="#overlay-custom-backdrop-2"
            >
              <span className="icon-[tabler--x] size-5"></span>
            </button>
          </div>

          <div className="flex justify-between items-center group cursor-pointer">
            <div>
              <div className="flex items-center gap-1 font-semibold">
                UserName
                <span className="bg-blue-600 text-white text-[10px] px-1 rounded-sm flex items-center h-4">
                  TS
                </span>
              </div>
              <div className="text-sm text-blue-400">Сменить эмодзи-статус</div>
            </div>
            <span className="icon-[tabler--chevron-down] size-5 text-base-content/50"></span>
          </div>
        </div>

        {/* Список меню */}
        <div className="drawer-body p-0 custom-scrollbar">
          <ul className="menu w-full p-0 [&_li>a]:py-3 [&_li>a]:px-4 [&_li>a]:rounded-none [&_li>a]:gap-6">
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--user-circle] size-6 text-base-content/50"></span>
                Мой профиль
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--wallet] size-6 text-base-content/50"></span>
                Кошелёк
              </a>
            </li>

            <div className="h-px bg-neutral/20 my-1"></div>

            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--users] size-6 text-base-content/50"></span>
                Создать группу
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--speakerphone] size-6 text-base-content/50"></span>
                Создать канал
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--user] size-6 text-base-content/50"></span>
                Контакты
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--phone] size-6 text-base-content/50"></span>
                Звонки
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--bookmark] size-6 text-base-content/50"></span>
                Избранное
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-base/5 active:bg-base/10">
                <span className="icon-[tabler--settings] size-6 text-base-content/50"></span>
                Настройки
              </a>
            </li>
            {/* Ночной режим с переключателем */}
            <li>
              <div className="flex justify-between items-center py-3 px-4 hover:bg-base/5 cursor-pointer">
                <div className="flex gap-6 items-center">
                  <span className="icon-[tabler--moon] size-6 text-base-content/50"></span>
                  Ночной режим
                </div>
                <input
                  type="checkbox"
                  className="switch switch-primary"
                  defaultChecked={theme === 'dark'}
                  onChange={toggleTheme}
                />
              </div>
            </li>
            <div className="h-px bg-neutral/20 my-1"></div>
            <li>
              <button
                type="button"
                className="btn btn-text btn-block btn-sm text-error hover:bg-error/5 active:bg-error/10 p-4 rounded-none"
                data-overlay="#overlay-custom-backdrop-2"
                onClick={() => {
                  setTimeout(() => {
                    setIsAuthorized(false);
                    select_chat(false);
                    setActiveId(null);
                  }, 330);
                }}
              >
                <span className="icon-[tabler--logout] size-5"></span>
                Выйти
              </button>
            </li>
          </ul>
        </div>
        {/* Футер */}
        <div className="p-4 mt-auto">
          <div className="text-xs text-base-content/60">
            ElectronMessenger Desktop <br />
            Версия 0.0.1 x64
            {/*  — O программе */}
          </div>
        </div>
      </aside>
    </>
  );
}
