import "./main.css";
import {auth} from "../../lib/firebase";
import ChannelsList from "../channelsList/ChannelsList";
import Chat from "../chat/Chat";
import MembersList from "../membersList/MembersList";
import {useChannelStore} from "../../lib/chatStore";
import {useUserStore} from "../../lib/userStore";

const Main = () => {
    const {currentUser} = useUserStore();
    const chatStore = useChannelStore();

    const handleSignOut = () => {
        chatStore.resetChat();
        auth.signOut()
    }

    return <div className={"main-container"}>
        <nav className={"navigation"}>
            <span className={"current-user"}>{currentUser.username}</span>
            <span className={"exit-button"} onClick={handleSignOut}>Выйти</span>
        </nav>
        <div className={"main-content"}>
            <ChannelsList/>
            {chatStore.channel && <>
                <Chat/>
                <MembersList/>
            </>}
        </div>
    </div>
}

export default Main;