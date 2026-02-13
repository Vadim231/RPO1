export default function Settings() {
  return (
    <>
      {/* <div id="overlay-custom-backdrop-2" className="overlay overlay-open:translate-x-0 drawer drawer-start hidden" role="dialog" tabIndex={-1}>
				<div className="drawer-header">
					<h3 className="drawer-title">Настройки</h3>
					<button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay="#overlay-custom-backdrop-2">
						<span className="icon-[tabler--x] size-5"></span>
					</button>
				</div>
				<div className="drawer-body">
					<p>
						Заготовка для настроек, которые будут отображаться в виде сайдера. Важно, чтобы код из FlyonUI был инициализирован, иначе модалки работать не будут!
					</p>
				</div>
			</div> */}
      {/* <aside id="overlay-custom-backdrop-2" className="overlay overlay-open:translate-x-0 drawer drawer-start hidden max-w-72" tabIndex={-1} aria-labelledby="drawer-label">
				<div className="drawer-header">
					<h3 className="drawer-title">Настройки</h3>
					<button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay="#overlay-custom-backdrop-2" >
						<span className="icon-[tabler--x] size-4"></span>
					</button>
				</div>
				<div className="drawer-body justify-start pb-6">
					<ul className="menu space-y-0.5 p-0">
						<li>
							<a href="#">
								<span className="icon-[tabler--home] size-5"></span>
								Dashboard
							</a>
						</li>
						<li className="space-x-0.5">
							<a className="collapse-toggle collapse-open:bg-base-content/10" id="layout-collapse" data-collapse="#layout-collapse-menu" >
								<span className="icon-[tabler--layout-navbar] size-5"></span>
								Layouts
								<span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
							</a>
							<ul id="layout-collapse-menu" className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby="layout-collapse" >
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Content Navbar
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Horizontal
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Without Menu
									</a>
								</li>
							</ul>
						</li>
						<li className="space-y-0.5">
							<a className="collapse-toggle collapse-open:bg-base-content/10" id="front-page-collapse" data-collapse="#front-page-collapse-menu" >
								<span className="icon-[tabler--box-multiple] size-5"></span>
								Front Pages
								<span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
							</a>
							<ul id="front-page-collapse-menu" className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby="front-page-collapse" >
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Landing Page
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Pricing Page
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Checkout Page
									</a>
								</li>
							</ul>
						</li>
						<div className="divider text-base-content/50 py-6 after:border-0">Apps & Pages</div>
						<li>
							<a href="#">
								<span className="icon-[tabler--message-chatbot] size-5"></span>
								Chat
							</a>
						</li>
						<li>
							<a href="#">
								<span className="icon-[tabler--mail] size-5"></span>
								Email
							</a>
						</li>
						<li>
							<a href="#">
								<span className="icon-[tabler--calendar] size-5"></span>
								Calendar
							</a>
						</li>
						<li className="space-x-0.5">
							<a className="collapse-toggle collapse-open:bg-base-content/10" id="ecommerce-collapse" data-collapse="#ecommerce-collapse-menu" >
								<span className="icon-[tabler--shopping-cart] size-5"></span>
								Ecommerce
								<span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
							</a>
							<ul id="ecommerce-collapse-menu" className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby="ecommerce-collapse" >
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Products
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Categories
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Shipping & Delivery
									</a>
								</li>
								<li>
									<a href="#">
										<span className="icon-[tabler--point] size-5"></span>
										Location
									</a>
								</li>
							</ul>
						</li>
						<div className="divider text-base-content/50 py-6 after:border-0">Account</div>
						<li>
							<a href="#">
								<span className="icon-[tabler--login] size-5"></span>
								Sign In
							</a>
						</li>
						<li>
							<a href="#">
								<span className="icon-[tabler--logout-2] size-5"></span>
								Sign Out
							</a>
						</li>
						<div className="divider text-base-content/50 py-6 after:border-0">Miscellaneous</div>
						<li>
							<a href="#">
								<span className="icon-[tabler--users-group] size-5"></span>
								Support
							</a>
						</li>
						<li>
							<a href="#">
								<span className="icon-[tabler--files] size-5"></span>
								Documentation
							</a>
						</li>
					</ul>
				</div>
			</aside> */}
      <aside
        id="overlay-custom-backdrop-2"
        className="overlay overlay-open:translate-x-0 drawer drawer-start hidden max-w-72 bg-[#17212b] text-white "
        tabIndex={-1}
      >
        {/* Верхняя часть с профилем */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TypeScript_ESLint_logo.svg/330px-TypeScript_ESLint_logo.svg.png"
                  alt="avatar"
                />
              </div>
            </div>
            {/* Кнопка закрытия (опционально, в ТГ ее нет, но для UI полезна) */}
            <button
              type="button"
              className="btn btn-text btn-circle btn-sm text-white/50"
              data-overlay="#overlay-custom-backdrop-2"
            >
              <span className="icon-[tabler--x] size-5"></span>
            </button>
          </div>

          <div className="flex justify-between items-center group cursor-pointer">
            <div>
              <div className="flex items-center gap-1 font-semibold">
                саша{' '}
                <span className="bg-yellow-400 text-black text-[10px] px-1 rounded-sm flex items-center h-4">
                  JS
                </span>
              </div>
              <div className="text-sm text-blue-400">Сменить эмодзи-статус</div>
            </div>
            <span className="icon-[tabler--chevron-down] size-5 text-white/50"></span>
          </div>
        </div>

        {/* Список меню */}
        <div className="drawer-body p-0 custom-scrollbar">
          <ul className="menu w-full p-0 [&_li>a]:py-3 [&_li>a]:px-4 [&_li>a]:rounded-none [&_li>a]:gap-6">
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--user-circle] size-6 text-white/50"></span>
                Мой профиль
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--wallet] size-6 text-white/50"></span>
                Кошелёк
              </a>
            </li>

            <div className="h-px bg-black/20 my-1"></div>

            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--users] size-6 text-white/50"></span>
                Создать группу
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--speakerphone] size-6 text-white/50"></span>
                Создать канал
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--user] size-6 text-white/50"></span>
                Контакты
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--phone] size-6 text-white/50"></span>
                Звонки
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--bookmark] size-6 text-white/50"></span>
                Избранное
              </a>
            </li>
            <li>
              <a href="#" className="hover:bg-white/5 active:bg-white/10">
                <span className="icon-[tabler--settings] size-6 text-white/50"></span>
                Настройки
              </a>
            </li>

            {/* Ночной режим с переключателем */}
            <li>
              <div className="flex justify-between items-center py-3 px-4 hover:bg-white/5 cursor-pointer">
                <div className="flex gap-6 items-center">
                  <span className="icon-[tabler--moon] size-6 text-white/50"></span>
                  Ночной режим
                </div>
                <input
                  type="checkbox"
                  className="switch switch-primary"
                  defaultChecked
                />
              </div>
            </li>
          </ul>
        </div>

        {/* Футер */}
        <div className="p-4 mt-auto">
          <div className="text-xs text-white/30">
            Telegram Desktop <br />
            Версия 6.5.1 x64 — О программе
          </div>
        </div>
      </aside>
    </>
  );
}
