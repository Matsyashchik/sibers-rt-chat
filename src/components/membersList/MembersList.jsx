import "./membersList.css";
import {db} from "../../lib/firebase";
import {doc, onSnapshot} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useChatStore} from "../../lib/chatStore";
import Member from "./Member";

const MembersList = () => {
    const {chat, participants, resetChat, getMembers} = useChatStore();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "channels", chat.id), () => {
            setMembers(getMembers);
        });
        return () => {
            unsub();
        };
    }, [participants]);

    return <div className={"wrapper"}>
        <section className={"member-list"}>
            <h3>Участники</h3>
            {members.map((member) => <Member member={member}/>)}
        </section>
        <button style={{marginTop: "auto"}} onClick={resetChat}>Вернуться</button>
    </div>
}

export default MembersList;