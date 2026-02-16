import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import {
  AttachedImageProps,
  AttachedGalleryProps,
  AttachedFileProps,
} from './types';
import Modal from '@/shared/components/modal/modal';

import { motion, Variants } from 'framer-motion';
import Avatar from '@/shared/components/avatar/avatar';
import { messageStatus } from '@/shared/types/type';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.9, rotate: -2 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};
type modifier = 'sender' | 'receiver';
interface MessageProps {
  messageId?: number | string;
  messageText?: string;
  userName: string;
  userAvatar?: string;
  timeStamp: string; // чуть позже изменить на dayjs()
  message_status: messageStatus;
  imageAttached?: AttachedImageProps;
  galleryAttached?: AttachedGalleryProps;
  fileAttached?: AttachedFileProps;
  sticker?: string;
  modifier: modifier;
}

export default function Message({
  messageText,
  userName,
  userAvatar,
  timeStamp,
  message_status,
  imageAttached,
  galleryAttached,
  fileAttached,
  sticker,
  messageId,
  modifier,
}: PropsWithChildren<MessageProps>): ReactElement {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    // Инициализация JS кода из FlyonUI если убрать модалки работать не будут!
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  if (imageAttached) {
    return (
      <div key={`chat-${modifier}-box`} className={`chat chat-${modifier}`}>
        <div className="chat-bubble">
          <div className="flex flex-col gap-4">
            {imageAttached.imageMessage}
            <button
              key={`gallery_${messageId}`}
              className="border-base-content/30 overflow-hidden rounded-md border"
              aria-label="Image Button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls={`image_item_${messageId}`}
              data-overlay={`#image_item_${messageId}`}
            >
              <img
                key={`image_${messageId}`}
                className="h-auto w-auto"
                src={`${imageAttached.imageURL}`}
                alt="Image"
              />
            </button>
          </div>
        </div>
        <Modal
          id={`image_item_${messageId}`}
          modalTitle={`${imageAttached.imageMessage || ''}`}
          modalBody={<img src={`${imageAttached.imageURL}`} />}
        />
      </div>
    );
  } else if (galleryAttached) {
    const galleryURLsLength = galleryAttached.galleryURLs.length;
    const toggleClass = () => {
      setIsActive(!isActive);
    };
    return (
      <div key={`chat-${modifier}-box`} className={`chat chat-${modifier}`}>
        <div id={`${messageId}`} className={`chat-bubble`}>
          {galleryAttached.galleryMessage}
          <motion.div
            layout
            transition={{
              layout: { duration: 0.3, type: 'spring', bounce: 0.2 },
            }}
            key={isActive ? 'active' : 'inactive'}
            variants={containerVariants}
            initial="hidden"
            animate={['visible']}
            className={`${galleryAttached.galleryMessage && 'mt-4'} flex flex-wrap gap-2 w-auto max-w-sm`}
          >
            {!isActive &&
              galleryAttached.galleryURLs.slice(0, 2).map((img, index) => {
                return (
                  <motion.div
                    layout
                    variants={itemVariants}
                    key={`thumb_${messageId}_${index}`}
                  >
                    {/* Устанавливаем ширину элементов flexbox через классы */}
                    <button
                      className="border-base-content/30 overflow-hidden rounded-md border w-24 h-24 sm:w-28 sm:h-28"
                      aria-label="Image Button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls={`gallery_item_${messageId}_${index}`}
                      data-overlay={`#gallery_item_${messageId}_${index}`}
                    >
                      <img
                        className="h-full w-full object-cover"
                        src={`${img}`}
                        alt="Image"
                      />
                    </button>
                    <Modal
                      id={`gallery_item_${messageId}_${index}`}
                      modalTitle={`${galleryAttached.galleryMessage || ''}`}
                      modalBody={
                        <img
                          src={`${galleryAttached.galleryURLs[index]}`}
                          alt="image"
                        />
                      }
                    />
                  </motion.div>
                );
              })}
            {galleryURLsLength > 2 && !isActive && (
              <motion.div
                layout
                variants={itemVariants}
                className="border-base-content/30 relative overflow-hidden rounded-md border w-24 h-24 sm:w-28 sm:h-28"
              >
                <button
                  className="bg-base-content/60 absolute flex size-full items-center justify-center"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls={`${timeStamp}`}
                  data-overlay={`#${timeStamp}`}
                  onClick={toggleClass}
                >
                  <span className="text-base-100 text-sm font-semibold">
                    +{galleryURLsLength - 2}
                  </span>
                </button>
                <img
                  src={galleryAttached.galleryURLs[galleryURLsLength - 2]}
                  className="h-full w-full object-cover"
                  alt="Image"
                />
              </motion.div>
            )}
            {/* Развернутое сообщение */}
            {isActive &&
              galleryAttached.galleryURLs.map((img, index) => {
                return (
                  <motion.div
                    layout
                    variants={itemVariants}
                    key={`full_${messageId}_${index}`}
                  >
                    <button
                      className="border-base-content/30 overflow-hidden rounded-md border w-24 h-24 sm:w-28 sm:h-28"
                      aria-label="Image Button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls={`gallery_item_${messageId}_${index}`}
                      data-overlay={`#gallery_item_${messageId}_${index}`}
                      onClick={() => {}}
                    >
                      <img
                        className="h-full w-full object-cover"
                        src={`${img}`}
                        alt="Image"
                      />
                    </button>
                    <Modal
                      id={`gallery_item_${messageId}_${index}`}
                      modalTitle={`${galleryAttached.galleryMessage || ''}`}
                      modalBody={
                        <img
                          src={`${galleryAttached.galleryURLs[index]}`}
                          alt="image"
                        />
                      }
                    />
                  </motion.div>
                );
              })}
            {galleryURLsLength > 2 && isActive && (
              <motion.div
                layout
                variants={itemVariants}
                className="border-base-content/30 relative overflow-hidden rounded-md border w-24 h-24 sm:w-28 sm:h-28"
              >
                <button
                  className="bg-base-content/60 absolute flex size-full items-center justify-center"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls={`${timeStamp}`}
                  data-overlay={`#${timeStamp}`}
                  onClick={toggleClass}
                >
                  <span className="text-base-100 text-sm font-semibold">
                    Закрыть
                  </span>
                </button>
                {/* <img src={galleryAttached.galleryURLs[galleryURLsLength - 2]} className="h-full w-full object-cover" alt="Image" /> */}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  } else if (fileAttached) {
    return (
      <div key={`chat-${modifier}-box`} className={`chat chat-${modifier}`}>
        <div className="chat-bubble">
          <div className="flex flex-col gap-4">
            {fileAttached.fileMessage}
            <div className="bg-base-100 rounded-md">
              <button className="flex items-center gap-2 px-3 py-2 max-sm:w-11/12">
                <div className="flex flex-col gap-2 max-sm:w-5/6">
                  <div className="flex items-center">
                    <span className="icon-[tabler--file-type-pdf] text-error me-2 size-5"></span>
                    <span className="text-base-content/80 truncate font-medium">
                      {fileAttached.fileName}
                    </span>
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
      </div>
    );
  } else if (sticker) {
    return (
      <img
        src={sticker}
        alt="sticker"
        draggable="false"
        className="w-auto h-auto max-w-45 max-h-45"
      />
    );
  } else {
    return (
      <div key={`chat-${modifier}-box`} className={`chat chat-${modifier}`}>
        <Avatar
          color="primary"
          status="online"
          iconUrl={userAvatar}
          isChat={true}
        />
        <div className="chat-header text-base-content">
          {userName}
          <time className="text-base-content/50"> • {timeStamp}</time>
        </div>
        <div className="chat-bubble">{messageText}</div>
        <div className="chat-footer text-base-content/50">
          <div>
            {message_status == 'sent' ? (
              <span className="text-base-content/50">✓</span>
            ) : message_status == 'received' ? (
              <span className="text-info">✓</span>
            ) : message_status == 'read' ? (
              <span className="text-success">✓✓</span>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}
