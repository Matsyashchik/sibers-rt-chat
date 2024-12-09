import {db} from "../../lib/firebase";
import {doc, arrayRemove, updateDoc} from "firebase/firestore";
import {useUserStore} from "../../lib/userStore";
import {useChannelStore} from "../../lib/chatStore";

const Members = ({member}) => {
    const {currentUser} = useUserStore();
    const {channel, removeUser} = useChannelStore();

    const handleRemoveUser = async (user) => {
        try {
            const channelRef = doc(db, "channels", channel.id);
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
            {member.id !== channel.creator && currentUser.id === channel.creator &&
            <span onClick={() => handleRemoveUser(member)} className={"member-remove-btn"}>{"X"}</span>}
    </div>
}

export default Members;