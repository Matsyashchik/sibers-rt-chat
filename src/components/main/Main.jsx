import "./main.css";
import {auth} from "../../lib/firebase";
import ChannelsList from "../channelsList/channelsList";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";
import Chat from "../chat/Chat";

const Main = () => {
    const {currentUser} = useUserStore();
    const {chat} = useChatStore();

    return <div className={"main-container"}>
        <nav className={"navigation"}>
            <span className={"current-user"}>{currentUser.username}</span>
            <button className={"exit-button"} onClick={()=>auth.signOut()}>Выйти</button>
        </nav>
        <>
            {
                chat
                    ? <Chat />
                    : <ChannelsList />
            }
        </>
    </div>
}

export default Main;