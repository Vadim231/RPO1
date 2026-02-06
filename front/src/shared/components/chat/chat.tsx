import { PropsWithChildren, ReactElement, ReactNode } from "react";

type modifier = "sender" | "reciever"

interface ChatProps {
	modifier: modifier;
	message: ReactNode;
}
export default function Chat({ modifier, message }: PropsWithChildren<ChatProps>): ReactElement {
	return (
		<>
			{
				modifier == "sender" ?
					(
						<>
							<div className="chat chat-sender">
								{message}
							</div>
						</>

					)
					:
					modifier == "reciever" ?
						(
							<div className="chat chat-receiver">
								{message}
							</div>
						)
						: "modifier is not selected!"
			}
		</>
	)
}