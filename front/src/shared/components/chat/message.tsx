import { PropsWithChildren, ReactElement, ReactNode } from "react";
import { AttachedImageProps, AttachedGalleryProps, AttachedFileProps } from "./types";
import Modal from "../modal/modal";
import Carousel from "../carousel/carousel";
type messageStatus = "sent" | "recieved" | "read"

interface MessageProps {
	messageText?: string;
	userName: string;
	userAvatar: ReactNode;
	timeStamp: string; // чуть позже изменить на dayjs()
	messageStatus: messageStatus;
	imageAttached?: AttachedImageProps;
	galleryAttached?: AttachedGalleryProps;
	fileAttached?: AttachedFileProps;
	sticker?: string;
}

export default function Message({
	messageText,
	userName,
	userAvatar,
	timeStamp,
	messageStatus,
	imageAttached,
	galleryAttached,
	fileAttached,
	sticker,
}: PropsWithChildren<MessageProps>): ReactElement {

	if (imageAttached) {
		return (
			<>
				<div className="chat-bubble">
					<div className="flex flex-col gap-4">
						{imageAttached.imageMessage}
						<button type="button" className="border-base-content/30 w-52 overflow-hidden rounded-md border" aria-label="Image Button" aria-haspopup="dialog" aria-expanded="false" aria-controls={`${timeStamp}`} data-overlay={`#${timeStamp}`}>
							<img className="w-full h-full" src={`${imageAttached.imageURL}`} alt="Watch Image" />
						</button>
					</div>
				</div>
				<Modal id={timeStamp} modalTitle={`${imageAttached.imageMessage || ""}`} modalBody={
					<Carousel carouselItems={[imageAttached.imageURL]} />
				} />
			</>
		)
	} else if (galleryAttached) {
		const galleryURLsLength = galleryAttached.galleryURLs.length
		return (
			<>
				<div className="chat-bubble">
					{galleryAttached.galleryMessage}
					<div className={`${galleryAttached.galleryMessage && "mt-4"} grid h-36 w-56 grid-cols-2 gap-2 max-sm:w-52`}>
						{
							galleryAttached.galleryURLs.map((img, index) => {
								while (index < 3) {
									console.log(index)
									return (
										<button key={`gallery_${index}`} className="border-base-content/30 overflow-hidden rounded-md border" aria-label="Image Button">
											<img className="h-full w-full" src={`${img}`} alt="Image" />
										</button>
									)
								}
							})
						}
						{
							galleryURLsLength > 3 &&
							<div className="border-base-content/30 relative overflow-hidden rounded-md border" aria-label="More Images Button">
								<button className="bg-base-content/60 absolute flex size-full items-center justify-center" aria-haspopup="dialog" aria-expanded="false" aria-controls={`${timeStamp}`} data-overlay={`#${timeStamp}`}>
									<span className="text-base-100 text-sm font-semibold">+{galleryURLsLength - 3}</span>
								</button>
								<img src={galleryAttached.galleryURLs[galleryURLsLength - 3]} className="h-full w-full" alt="Image" />
							</div>
						}
						<Modal id={timeStamp} modalTitle={`${galleryAttached.galleryMessage || ""}`} modalBody={
							<Carousel carouselItems={galleryAttached.galleryURLs} />
						} />
					</div>
				</div>
			</>
		)
	} else if (fileAttached) {
		return (
			<>
				<div className="chat-bubble">
					<div className="flex flex-col gap-4">
						{fileAttached.fileMessage}
						<div className="bg-base-100 rounded-md">
							<button className="flex items-center gap-2 px-3 py-2 max-sm:w-11/12">
								<div className="flex flex-col gap-2 max-sm:w-5/6">
									<div className="flex items-center">
										<span className="icon-[tabler--file-type-pdf] text-error me-2 size-5"></span>
										<span className="text-base-content/80 truncate font-medium">{fileAttached.fileName}</span>
									</div>
									<div className="text-base-content flex items-center gap-1 text-xs max-sm:hidden">
										{fileAttached.fileInfo}
										<span className="icon-[tabler--circle-filled] mt-0.5 size-1.5"></span>
										{fileAttached.fileSize}
										<span className="icon-[tabler--circle-filled] mt-0.5 size-1.5"></span>
										{fileAttached.fileType}
									</div>
								</div>
								<span className="btn btn-text btn-circle">
									<span className="icon-[tabler--download] size-5"></span>
								</span>
							</button>
						</div>
					</div>
				</div>
			</>
		)
	} else if (sticker) {
		return (
			<img src={sticker} alt="sticker" draggable="false" className="w-auto h-auto max-w-45 max-h-45" />
		)
	} else {
		return (
			<>
				{userAvatar}
				<div className="chat-header text-base-content">
					{userName}
					<time className="text-base-content/50"> • {timeStamp}</time>
				</div>
				<div className="chat-bubble">{messageText}</div>
				<div className="chat-footer text-base-content/50">
					<div>					{
						messageStatus == "sent" ? "+" :
							messageStatus == "recieved" ? "++" :
								messageStatus == "read" ? (<span className="icon-[tabler--checks] text-success align-bottom"></span>) : ""
					}
					</div>
				</div>
			</>
		)
	}
}