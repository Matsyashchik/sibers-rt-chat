import "./chat.css";
import {db} from "../../lib/firebase";
import {arrayUnion, doc, onSnapshot, updateDoc} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";
import image from "../media/emoji-img.png"
import EmojiPicker from "emoji-picker-react"
import Message from "./Message";


const Chat = () => {
    const {currentUser} = useUserStore();
    const {chat} = useChatStore();
    const [messages, setMessages] = useState([]);
    const [pickerOpen, setPickerOpen] = useState(false);
    const massageInput = useRef();
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chat.chatId), (res) => {
            setMessages(res.data().messages);
        });
        return () => {
            unSub();
        };
    }, [chat]);

    const handleSendMessage = async () => {
        const message = massageInput.current.value.trim();
        if (message === "") return;
        try {
            massageInput.current.value = "";
            await updateDoc(doc(db, "chats", chat.chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text: message,
                    createdAt: new Date()
                }),
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleEmojiPick = (e) => {
        massageInput.current.value += e.emoji;
        setPickerOpen(false);
    }

    return <main className={"main-wrapper"}>
        <section className={"message-list"}>
            {messages.map((message) => <Message message={message}/>)}
            <div ref={endRef}></div>
        </section>
        <div className={"send-message-form"}>
            <input type={"text"}
                   name={"input-message"}
                   placeholder={"Напишите сообщение"}
                   onKeyDown={(e) => {if (e.key === "Enter") handleSendMessage()}}
                   className={"input-message"}
                   ref={massageInput}
            />
            <div className={"emoji-picker"}>
                <img alt={"emoji"} src={image} onClick={() => setPickerOpen(!pickerOpen)}/>
                <div className={"emoji-wrapper"}>
                    <EmojiPicker lazyLoadEmojis={true} open={pickerOpen} onEmojiClick={handleEmojiPick} />

                </div>
            </div>
            <button className={"send-btn"} onClick={handleSendMessage}>⬆</button>
        </div>
    </main>
}

export default Chat;