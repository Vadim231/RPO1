import { IStaticMethods } from "flyonui/flyonui";

declare module "flyonui/plugin";

declare global {
	interface Window {
		HSStaticMethods: IStaticMethods;
	}
}

window.HSStaticMethods.autoInit();
