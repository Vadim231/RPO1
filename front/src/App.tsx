import { useEffect } from "react";
import ChatList from "./shared/components/chat-list/chat-list";
import { MessageType } from "./shared/types/type";
import Avatar from "./shared/components/avatar/avatar";
import Chat from "./shared/components/chat/chat";
import Message from "./shared/components/chat/message";
import { AttachedFileProps, AttachedImageProps, AttachedGalleryProps } from "./shared/components/chat/types";
import TopMenu from "./shared/components/top-menu/top-menu";
const myFile: AttachedFileProps = {
  fileName: "document.pdf",
  fileMessage: "Отчет за прошлый месяц",
  fileSize: "2.5MB",
  fileType: "pdf",
  fileInfo: "Информация о документе",
};
const myImage: AttachedImageProps = {
  imageMessage: undefined,
  imageURL: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5c2e6820-51d1-4873-8329-dbc6646cc5e4_500x624.jpeg"
}
const myGallery: AttachedGalleryProps = {
  galleryMessage: undefined,
  galleryURLs: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkIstAkU4wn5rtgpbAOh5WD6DmeZosXkGdcg&s",
    "https://kinsta.com/wp-content/uploads/2023/04/what-is-typescript.jpeg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSh59YtVqAQLp5qgr4rz49TCOhn4-15uhNzQ&s",
    "https://i.redd.it/b70t2si6yrd61.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv9eGgMqm0NAID9Yew5RwXLA67GRc4v9QEiA&s",
    "https://i.programmerhumor.io/2022/11/programmerhumor-io-javascript-memes-frontend-memes-323663783ea4eb3.png",
    "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fi.pinimg.com%2F564x%2Fa5%2Ff5%2F3f%2Fa5f53fc0b1f7d182ea201123d4c3d750.jpg",
    "https://i.programmerhumor.io/2023/10/programmerhumor-io-javascript-memes-frontend-memes-09d6c40e599cfcd.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYzqWJtTN-ITdoKmxenjueomUwK26O4wVwzg&s",
    "https://media.licdn.com/dms/image/v2/C4D22AQGsd32rHHZmUQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1640091407324?e=2147483647&v=beta&t=Hop9lw_sk1ooGWEd1QKOWNzoUVCOqL-z54ycIhVxyrY",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQId5E5x7Hs2tLRUY1lx9iFAv4vdGpKU5ZbxA&s",
    "https://i.programmerhumor.io/2024/07/programmerhumor-io-javascript-memes-frontend-memes-6ea87de767aacc6.jpe",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcJN-yCq689fokwZN1iU9h53ofBaihOHnRVQ&s",
    "https://i.redd.it/34c9vlxo78791.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiJzMTM8NWgcCtdx9JX8VlmEyPNYX_0RRQGQ&s"
  ]
}
const chats: MessageType[] = [
  {
    message_id: 1,
    chat_id: 1,
    user_id: 1,
    message_content: "Сообщение",
    sent_at: "12.10",
    edited_at: "12.10",
  },
  {
    message_id: 2,
    chat_id: 2,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  },
  {
    message_id: 1,
    chat_id: 3,
    user_id: 1,
    message_content: "Сообщение",
    sent_at: "12.10",
    edited_at: "12.10",
  },
  {
    message_id: 2,
    chat_id: 4,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  },
  {
    message_id: 1,
    chat_id: 5,
    user_id: 1,
    message_content: "Сообщение",
    sent_at: "12.10",
    edited_at: "12.10",
  },
  {
    message_id: 2,
    chat_id: 6,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  },
  {
    message_id: 1,
    chat_id: 7,
    user_id: 1,
    message_content: "Сообщение",
    sent_at: "12.10",
    edited_at: "12.10",
  },
  {
    message_id: 2,
    chat_id: 8,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  },
  {
    message_id: 1,
    chat_id: 9,
    user_id: 1,
    message_content: "Сообщение",
    sent_at: "12.10",
    edited_at: "12.10",
  },
  {
    message_id: 2,
    chat_id: 10,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  },
  {
    message_id: 1,
    chat_id: 11,
    user_id: 1,
    message_content: "Сообщение",
    sent_at: "12.10",
    edited_at: "12.10",
  },
  {
    message_id: 2,
    chat_id: 12,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  },
  {
    message_id: 2,
    chat_id: 13,
    user_id: 2,
    message_content: "Сообщение 2",
    sent_at: "14.25",
    edited_at: "14.25",
  }
]
export default function App() {
  useEffect(() => {
    // Инициализация JS кода из FlyonUI если убрать модалки работать не будут!
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-base-300">
      {window.electronAPI ? <TopMenu /> : ""}
      <main className={`flex-1 overflow-y-hidden ${window.electronAPI ? "mt-6" : ""}`}>
        <div className="w-auto flex h-max max-h-svh flex-col">
          <div className="h-36 w-full bg-base-300 flex flex-row justify-between">
            <div className="w-1/3 bg-base overflow-y-hidden">content</div>
            <div className="w-full bg-base-200 pl-4 pr-4">content</div>
            {/* Тут возможно будут всякие кнопки как в тг */}
          </div>
          <div className="flex flex-row overflow-y-hidden">
            <div className={`bg-primary/15 w-1/3 ${window.electronAPI ? "pb-6" : "pb-14"} overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
              <ChatList chats={chats} />
            </div>
            <div className={`bg-primary/25 w-full ${window.electronAPI ? "pb-6" : "pb-14"} pl-4 pr-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
              <Chat modifier={"sender"} message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar
                    shape="circle"
                    color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="read" />
              } />
              <Chat modifier={"sender"} message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="recieved" />
              } />
              <Chat modifier="reciever" message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="sent" />
              } />
              <Chat modifier={"sender"} message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="read" />
              } />
              <Chat modifier="reciever" message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="recieved" />
              } />
              <Chat modifier="reciever" message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="recieved" />
              } />
              <Chat modifier={"sender"} message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="read" />
              } />
              <Chat modifier={"sender"} message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="recieved" />
              } />
              <Chat modifier="reciever" message={
                <Message messageText="Hello, world!" userName={"My username"} userAvatar={
                  <Avatar color="primary"
                    status="online"
                    iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png" isChat={true} />
                } timeStamp={"12:25"} messageStatus="sent" />
              } />
              <Chat modifier="sender" message={
                <Message
                  userName={""}
                  userAvatar={undefined}
                  timeStamp={"12:34"}
                  messageStatus={"read"}
                  fileAttached={myFile}
                />
              } />
              <Chat key={"uniqKey"} modifier="reciever" message={
                <Message
                  key={"uniqKey3"}
                  userName="penis"
                  userAvatar=""
                  timeStamp="1254"
                  messageStatus="recieved"
                  imageAttached={myImage}
                />
              } />
              <Chat key={"uniqKey2"} modifier="sender" message={
                <Message
                  messageId={"SuperUniqId"}
                  key={"uniqKey4"}
                  userName=""
                  userAvatar=""
                  timeStamp=""
                  messageStatus="recieved"
                  galleryAttached={myGallery}
                />
              } />
              <Chat modifier="sender" message={
                <Message
                  userName=""
                  userAvatar=""
                  timeStamp=""
                  messageStatus="recieved"
                  sticker="https://cdn-icons-png.flaticon.com/256/4288/4288932.png"
                />
              } />
              <Chat modifier="reciever" message={
                <Message
                  userName=""
                  userAvatar=""
                  timeStamp=""
                  messageStatus="recieved"
                  sticker="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRoeHJmeDNoOWU1MXdwZmh6enp0dXI4bTI2aWY4ZWM2cTlwbHZkOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VwOVl2sdbJf9dxr7O6/giphy.gif"
                />
              } />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

