import "./chat.css";
import {db} from "../../lib/firebase";
import {arrayUnion, doc, onSnapshot, updateDoc} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";

const Chat = () => {
    const {currentUser} = useUserStore();
    const {chat, participants} = useChatStore();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const massageInput = useRef();
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chat.chatId), (res) => {
            const messages = res.data().messages;
            formatMessages(messages)
            setMessages(messages);
        });
        return () => {
            unSub();
        };
    }, [chat]);

    const formatMessages = (messages) => {
        messages.map(message => message.username = getUsername(message.senderId));
    }

    const getUsername = (senderId) => {
        const user = participants.find(user => user.id === senderId);
        return user ? user.username : "Удалённый пользователь";
    }

    const checkTime = (timestamp) => {
        // Умножаем время на тысячб 1000 чтобы получить время в секундах, а не миллисекунадх
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        return hours + ':' + minutes.slice(-2, 3);
    }

    const handleSendMessage = async () => {
        const message = massageInput.current.value.trim();
        if (message === "") return;
        setLoading(true);
        try {
            await updateDoc(doc(db, "chats", chat.chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text: message,
                    createdAt: new Date()
                }),
            });
            setLoading(false);
            massageInput.current.value = "";
        } catch (error) {
            console.log(error);
        }
    }

    return <main className={"main-wrapper"}>
        <section className={"message-list"}>
            {messages.map((message) => <div className={currentUser.id === message.senderId ?
                "massage-wrapper sender" : "massage-wrapper"}>
                <b className={"massage-sender"}>{message.username}</b>
                <p className={"massage-text"}>{message.text}
                    <span className={"massage-time"}>{checkTime(message.createdAt).toString()}</span>
                </p>

            </div>)}
            <div ref={endRef}></div>
        </section>
        <div className={"send-message-form"}>
            <input type={"text"}
                   name={"input-message"}
                   placeholder={"Напишите сообщение"}
                   onKeyDown={(e) => {if (e.key === "Enter") handleSendMessage()}}
                   className={"input-message"}
                   ref={massageInput}
                   disabled={loading}
            />
            <button className={"send-btn"} disabled={loading} onClick={handleSendMessage}>⬆</button>
        </div>
    </main>
}

export default Chat;