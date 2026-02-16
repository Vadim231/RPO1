import Chat from './chat';
import Message from './message';
import MessageArea from '../message-area/message-area';
import { PropsWithChildren, ReactElement } from 'react';
import { myFile, myImage, myGallery } from '../../App';
import PinnedMessage from '../pinned-message/pinned-message';

interface MessageBlockProps {
  chat_selected: boolean;
  chat_selected_id?: number;
  select_chat_id?: React.Dispatch<React.SetStateAction<number>>;
}

export default function MessageBlock({
  chat_selected,
}: PropsWithChildren<MessageBlockProps>): ReactElement {
  return (
    <div
      className={`bg-neutral-content ${chat_selected ? 'flex' : 'hidden'} sm:flex flex-col justify-between w-full `}
    >
      {chat_selected ? (
        <>
          <PinnedMessage
            // isPinned={true}
            message={'Привет это сообщение закреплено!'}
            onUnpin={() => {}}
          />
          <div
            className={`h-full ${window.electronAPI ? '' : 'pb-14'} pl-4 pr-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          >
            <Chat
              modifier={'sender'}
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="read"
                />
              }
            />
            <Chat
              modifier={'sender'}
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="recieved"
                />
              }
            />
            <Chat
              modifier="reciever"
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="sent"
                />
              }
            />
            <Chat
              modifier={'sender'}
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="read"
                />
              }
            />
            <Chat
              modifier="reciever"
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="recieved"
                />
              }
            />
            <Chat
              modifier="reciever"
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="recieved"
                />
              }
            />
            <Chat
              modifier={'sender'}
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="read"
                />
              }
            />
            <Chat
              modifier={'sender'}
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="recieved"
                />
              }
            />
            <Chat
              modifier="reciever"
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  timeStamp={'12:25'}
                  messageStatus="sent"
                />
              }
            />
            <Chat
              modifier="sender"
              message={
                <Message
                  userName={''}
                  userAvatar={undefined}
                  timeStamp={'12:34'}
                  messageStatus={'read'}
                  fileAttached={myFile}
                />
              }
            />
            <Chat
              key={'uniqKey'}
              modifier="reciever"
              message={
                <Message
                  key={'uniqKey3'}
                  userName="penis"
                  userAvatar=""
                  timeStamp="1254"
                  messageStatus="recieved"
                  imageAttached={myImage}
                />
              }
            />
            <Chat
              key={'uniqKey2'}
              modifier="sender"
              message={
                <Message
                  messageId={'SuperUniqId'}
                  key={'uniqKey4'}
                  userName=""
                  userAvatar=""
                  timeStamp=""
                  messageStatus="recieved"
                  galleryAttached={myGallery}
                />
              }
            />
            <Chat
              modifier="sender"
              message={
                <Message
                  userName=""
                  userAvatar=""
                  timeStamp=""
                  messageStatus="recieved"
                  sticker="https://cdn-icons-png.flaticon.com/256/4288/4288932.png"
                />
              }
            />
            <Chat
              modifier="reciever"
              message={
                <Message
                  userName=""
                  userAvatar=""
                  timeStamp=""
                  messageStatus="recieved"
                  sticker="\src\assets\mona-hifive.gif"
                />
              }
            />
          </div>
          <MessageArea />
        </>
      ) : (
        <div
          className={`${!chat_selected ? 'hidden' : 'flex'} select-none sm:flex md:flex lg:flex text-center justify-center items-center flex-col h-full bg-base-100`}
        >
          <span className="bg-base-300/80 text-accent-content rounded-3xl p-2 w-fit">
            Выберите, кому хотели бы написать
          </span>
        </div>
      )}
    </div>
  );
}
