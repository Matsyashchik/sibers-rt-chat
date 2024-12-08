import "./membersList.css";
import {db} from "../../lib/firebase";
import {doc, arrayRemove, updateDoc, onSnapshot, arrayUnion} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";

const MembersList = () => {
    const {currentUser} = useUserStore();
    const {chat, participants, resetChat, getMembers} = useChatStore();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "channels", chat.id), () => {
            setMembers(getMembers);
        });
        return () => {
            unsub();
        };
    }, [chat]);

    const handleRemoveUser = async (user) => {
        try {
            const channelRef = doc(db, "channels", chat.id);
            await updateDoc(channelRef, {
                participants: arrayRemove(user.id)
            });

            setMembers(participants.filter(u => u.id !== user.id));
        } catch (e) {
            console.log(e)
        }
    }

    return <div className={"main-wrapper"}>
        <section className={"member-list"}>
            <h2>Участники</h2>
            {members.map((member) =>
                <div key={member.id} className={"member-info"}>
                    <span className={"member-name"}>
                        {member.username}
                    </span>
                    {member.id !== chat.creator && currentUser.id === chat.creator &&
                        <span onClick={() => handleRemoveUser(member)} className={"member-remove-btn"}>{"X"}</span>}
                </div>)}
        </section>
        <button style={{marginTop: "auto"}} onClick={resetChat}>Вернуться</button>
    </div>
}

export default MembersList;