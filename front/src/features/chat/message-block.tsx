import Chat from './chat';
import Message from './message';
import MessageArea from '../message-area/message-area';
import { PropsWithChildren, ReactElement } from 'react';
import { myFile, myImage, myGallery } from '../../App';
import Avatar from '../../shared/components/avatar/avatar';
import PinnedMessage from '../pinned-message/pinned-message';

interface MessageBlockProps {
  chat_selected: boolean;
  chat_selected_id?: number;
}

export default function MessageBlock({
  chat_selected,
}: PropsWithChildren<MessageBlockProps>): ReactElement {
  return (
    <div
      className={`${chat_selected ? 'flex' : 'hidden'} sm:flex flex-col justify-between w-full bg-primary/25`}
    >
      {chat_selected ? (
        <>
          <PinnedMessage
            message={'Привет это сообщение закреплено!'}
            onUnpin={() => {}}
          />
          <div
            className={`h-full ${window.electronAPI ? 'pb-18' : 'pb-14'} pl-4 pr-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          >
            <Chat
              modifier={'sender'}
              message={
                <Message
                  messageText="Hello, world!"
                  userName={'My username'}
                  userAvatar={
                    <Avatar
                      shape="circle"
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  userAvatar={
                    <Avatar
                      color="primary"
                      status="online"
                      iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png"
                      isChat={true}
                    />
                  }
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
                  sticker="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRoeHJmeDNoOWU1MXdwZmh6enp0dXI4bTI2aWY4ZWM2cTlwbHZkOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VwOVl2sdbJf9dxr7O6/giphy.gif"
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
          <span className="bg-base-300 rounded-3xl p-2 w-fit">
            Выберите, кому хотели бы написать
          </span>
        </div>
      )}
    </div>
  );
}
