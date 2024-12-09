import {useUserStore} from "../../lib/userStore";
import {useChannelStore} from "../../lib/chatStore";
import avatar from "../media/avatar.png"

const Message = ({message}) => {
    const {currentUser} = useUserStore();
    const {participants} = useChannelStore();

    const formatUsername = (senderId) => {
        const user = participants.find(user => user.id === senderId);
        return user ? user.username : "Удалённый пользователь";
    }

    const formatTime = (timestamp) => {
        // Умножаем время на тысячб 1000 чтобы получить время в секундах, а не миллисекунадх
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        return hours + ':' + minutes.slice(-2, 3);
    }

    return <div className={currentUser.id === message.senderId ? "massage-wrapper sender" : "massage-wrapper"}>
        <img alt={"avatar"} src={avatar}/>
        <div className={"massage-contents"}>
            <b className={"massage-sender"}>{formatUsername(message.senderId)}</b>
            <p className={"massage-text"}>{message.text}
                <span className={"massage-time"}>{formatTime(message.createdAt).toString()}</span>
            </p>
        </div>
    </div>


}

export default Message;