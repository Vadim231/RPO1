import { useEffect } from "react";
import ChatList from "./shared/components/chat-list/chat-list";
import { MessageType } from "./shared/types/type";
import { AttachedFileProps, AttachedImageProps, AttachedGalleryProps } from "./shared/components/chat/types";
import TopMenu from "./shared/components/top-menu/top-menu";
import ChatsHeader from "./shared/components/chats-header/chats-header";
import PinnedMessage from "./shared/components/pinned-message/pinned-message";
import MessageArea from "./shared/components/message-area/message-area";
import ChatBlock from "./shared/components/chat-list/chat-block";

// eslint-disable-next-line react-refresh/only-export-components
export const myFile: AttachedFileProps = {
  fileName: "document.pdf",
  fileMessage: "Отчет за прошлый месяц",
  fileSize: "2.5MB",
  fileType: "pdf",
  fileInfo: "Информация о документе",
};
// eslint-disable-next-line react-refresh/only-export-components
export const myImage: AttachedImageProps = {
  imageMessage: undefined,
  imageURL: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5c2e6820-51d1-4873-8329-dbc6646cc5e4_500x624.jpeg"
}
// eslint-disable-next-line react-refresh/only-export-components
export const myGallery: AttachedGalleryProps = {
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
      <main className={`flex flex-col overflow-y-hidden ${window.electronAPI ? "mt-6" : ""}`}>
        <div className="w-auto flex h-max max-h-svh flex-col">
          <ChatsHeader />
          <div className="flex flex-row justify-between overflow-y-hidden">
            <ChatList chats={chats} />
            <div className={`flex flex-col justify-between w-full bg-primary/25`}>
              <PinnedMessage />
              <ChatBlock />
              <MessageArea />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

