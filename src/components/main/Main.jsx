import "./main.css";
import {auth} from "../../lib/firebase";
import ChannelsList from "../channelsList/channelsList";
import Chat from "../chat/Chat";
import MembersList from "../userList/MembersList";
import {useChatStore} from "../../lib/chatStore";
import {useUserStore} from "../../lib/userStore";

const Main = () => {
    const {currentUser} = useUserStore();
    const chatStore = useChatStore();

    const handleSignOut = () => {
        chatStore.resetChat();
        auth.signOut()
    }

    return <div className={"main-container"}>
        <nav className={"navigation"}>
            <span className={"current-user"}>{currentUser.username}</span>
            <button className={"exit-button"} onClick={handleSignOut}>Выйти</button>
        </nav>
        <>
            {
                chatStore.chat
                    ?
                    <div className={"wrapper"}>
                        <Chat />
                        <MembersList />
                    </div>
                    : <ChannelsList />
            }
        </>
    </div>
}

export default Main;