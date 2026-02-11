import { IStaticMethods } from "flyonui/flyonui";

declare module "flyonui/plugin";

declare global {
	interface Window {
		HSStaticMethods: IStaticMethods;
	}
}
export interface MessageType {
	message_id: number;
	chat_id: number;
	user_id: number;
	message_content: string;
	sent_at: string;
	edited_at: string;
}
window.HSStaticMethods.autoInit();
