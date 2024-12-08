import {toast} from "react-toastify";
import "./channelsPage.css";
import {db} from "../../lib/firebase";
import {doc, onSnapshot, setDoc, getDocs, updateDoc, arrayUnion} from "firebase/firestore";
import {useEffect, useState} from "react";
import {collection, query, where, serverTimestamp} from "firebase/firestore";
import {useSelectedUsersStore} from "../../lib/selectedUsersStore";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";

const ChannelsList = () => {
    const {currentUser} = useUserStore();
    const [loading, setLoading] = useState(false);
    const [isAddingMode, setAdding] = useState(false);
    const [search, setSearch] = useState([]);
    const selectedUsersStore = useSelectedUsersStore();
    const [channels, setChannels] = useState([]);
    const {changeChat} = useChatStore();

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data()
            }));
            setChannels(list);
        });

        return () => unsub();
    }, [currentUser.id]);

    const handleCreateChannel = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const {title, description} = Object.fromEntries(formData);

        if (!title || !description || !selectedUsersStore.selectedUsers.length) return toast.warn("Пожалуйста заполните все данные");

        const channelRef = collection(db, "channels");
        const q = query(channelRef, where("title", "==", title));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return toast.warn("Такой канал уже существует");
        }

        try {
            const chatRef = collection(db, "chats");
            const newChatRef = doc(chatRef);
            const res = await setDoc(newChatRef, {
                createdAt: serverTimestamp(), messages: [],
            });
            console.log(res);

            const newChannelRef = doc(channelRef);
            setLoading(true);
            await setDoc(newChannelRef, {
                createdAt: serverTimestamp(),
                title: title,
                description: description,
                creator: currentUser.id,
                participants: [currentUser.id].concat(selectedUsersStore.getUserIDs()),
                chatId: newChatRef.id
            });

            toast.success("Канал создан");
        } catch (error) {
            console.log(error)
            toast.error("Ошибка");
        } finally {
            resetCreating();
            setLoading(false);
        }
    }

    const handleUserSearch = async (e) => {
        e.preventDefault();
        const inputData = e.target.value

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", inputData), where("id", "!=", currentUser.id));
        const querySnapshot = await getDocs(q);
        const result = []
        querySnapshot.forEach((doc) => {
            result.push(doc.data());
        });
        setSearch(result);
    }

    const handleChangeChannel = (chat) => {
        changeChat(chat);
    }

    const handleJoin = async (chat) => {
        try {
            const channelRef = doc(db, "channels", chat.id);
            await updateDoc(channelRef, {
                participants: arrayUnion(currentUser.id)
            });
        } catch (e) {
            console.log(e)
        }
    }

    const resetCreating = () => {
        setAdding(false);
        selectedUsersStore.reset();
        setSearch([]);
    }

    return <main>

        <section className={"channels-list"}>
            <h3>Мои каналы:</h3>
            {channels.filter(c => c.creator === currentUser.id || c.participants?.includes(currentUser.id))
                .map(channel =>
                    <div key={channel.id} className={"channel"} onClick={() => {handleChangeChannel(channel)}}>
                    <b>{channel.title}</b>
                    <p>{channel.description}</p>
                </div>)}
            <h3>Присоединиться к каналу:</h3>
            {channels.filter(c => c.creator !== currentUser.id && !c.participants?.includes(currentUser.id))
                .map(channel =>
                    <div key={channel.id} className={"channel"} onClick={() => {handleJoin(channel)}}>
                    <b>{channel.title}</b>
                    <p>{channel.description}</p>
                </div>)}
        </section>
        {isAddingMode ? <form onSubmit={handleCreateChannel} className={"create-channel-form"}>
            <h3>Создание канала:</h3>
            <input type={"text"} name={"title"} placeholder={"Название канала"}/>
            <textarea name={"description"} placeholder={"Описание"} maxLength={150}/>
            <span>Добавить пользователей</span>
            <input type={"text"} name={"userSearch"} placeholder={"Введите имя пользователя"}
                   className={"search-user-field"} onChange={handleUserSearch}/>
            <div className={"users-list"}>
                {search.map(user => <div className={"user-info"} key={user.id}>
                    <span>{user.username}</span>
                    <div onClick={() => selectedUsersStore.addUser(user)}>+</div>
                </div>)}
                <div className={"selected-users-list"}>Выбранные пользователи:
                    {selectedUsersStore.selectedUsers.map(user => <div className={"user-info"}
                                                                       key={"selected:" + user.id}>
                        <span>{user.username}</span>
                        <div onClick={() => selectedUsersStore.removeUser(user)}>–</div>
                    </div>)}
                </div>
            </div>
            <div style={{alignSelf: "center"}}>
                <button className={"create-channel-btn"} onClick={resetCreating} disabled={loading}>Отменить</button>
                <button className={"create-channel-btn"} disabled={loading}>Создать канал</button>
            </div>
        </form> : <button className={"create-channel-btn"}  onClick={() => setAdding(true)}>Создать канал</button>}
    </main>
}

export default ChannelsList;