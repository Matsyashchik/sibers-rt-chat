import "./channelsPage.css";
import {db} from "../../lib/firebase";
import {doc, onSnapshot, updateDoc, arrayUnion} from "firebase/firestore";
import {useEffect, useState} from "react";
import {collection} from "firebase/firestore";
import {useUserStore} from "../../lib/userStore";
import {useChannelStore} from "../../lib/chatStore";
import useModal from "../../lib/useModal";
import CreateChannel from "./createChannel";

const ChannelsList = () => {
    const {currentUser} = useUserStore();
    const {changeChat} = useChannelStore();
    const modal = useModal();
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
            const channels = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data()
            }));
            setChannels(channels);
        });

        return () => unsub();
    }, [currentUser]);


    const handleChangeChannel = (channel) => {
        setSelectedChannel(channel);
        changeChat(channel);
    }

    const handleJoin = async (channel) => {
        try {
            const channelRef = doc(db, "channels", channel.id);
            await updateDoc(channelRef, {
                participants: arrayUnion(currentUser.id)
            });
        } catch (e) {
            console.log(e)
        }
    }

    return <aside className={"wrapper"}>
        <section className={"channels-list"}>
            <h3>Мои каналы:</h3>
            {channels.filter(c => c.creator === currentUser.id || c.participants?.includes(currentUser.id))
                .map(channel =>
                    <div key={channel.id}
                         className={selectedChannel?.id === channel.id? "channel active" : "channel"}
                         onClick={() => {handleChangeChannel(channel)
                    }}>
                        <b>{channel.title}</b>
                        <p>{channel.description}</p>
                    </div>)}
            <h3>Присоединиться к каналу:</h3>
            {channels.filter(c => c.creator !== currentUser.id && !c.participants?.includes(currentUser.id))
                .map(channel =>
                    <div key={channel.id} className={"channel"} onClick={() => handleJoin(channel)}>
                        <b>{channel.title}</b>
                        <p>{channel.description}</p>
                    </div>)}
        </section>
        <CreateChannel />
        <button className={"create-channel-btn"} onClick={() => modal.open()}>Создать канал</button>
    </aside>
}

export default ChannelsList;