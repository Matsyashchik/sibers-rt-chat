import "./main.css";
import {auth} from "../../lib/firebase";
import ChannelsList from "../channelsList/channelsList";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";

const Main = () => {
    const {currentUser} = useUserStore();
    const {chatId} = useChatStore();
    // const channelSelected = false;

    return <div className={"main-container"}>
        <nav className={"navigation"}>
            <span className={"current-user"}>{currentUser.username}</span>
            <button className={"exit-button"} onClick={()=>auth.signOut()}>Выйти</button>
        </nav>
        <>
            {
                chatId
                    ? <div>{chatId}</div>
                    : <ChannelsList />
            }
        </>
    </div>
}

export default Main;