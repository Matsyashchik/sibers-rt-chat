import {db} from "../../lib/firebase";
import {doc, arrayRemove, updateDoc} from "firebase/firestore";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";

const Members = ({member}) => {
    const {currentUser} = useUserStore();
    const {chat, removeUser} = useChatStore();

    const handleRemoveUser = async (user) => {
        try {
            const channelRef = doc(db, "channels", chat.id);
            removeUser(user)

            await updateDoc(channelRef, {
                participants: arrayRemove(user.id)
            });
        } catch (e) {
            console.log(e)
        }
    }

    return <div key={member.id} className={"member-info"}>
        <span className={"member-name"}> {member.username}</span>
            {member.id !== chat.creator && currentUser.id === chat.creator &&
            <span onClick={() => handleRemoveUser(member)} className={"member-remove-btn"}>{"X"}</span>}
    </div>
}

export default Members;