import {useEffect, useRef, useState} from 'react'
import useModal from '../../lib/useModal'
import {toast} from "react-toastify";
import {collection, doc, getDocs, query, serverTimestamp, setDoc, where} from "firebase/firestore";
import {db} from "../../lib/firebase";
import {useSelectedUsersStore} from "../../lib/selectedUsersStore";
import {useUserStore} from "../../lib/userStore";
import {UserInfo} from "./UserInfo";


export default function CreateChannel() {
    const selectedUsersStore = useSelectedUsersStore();
    const {currentUser} = useUserStore();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState([]);
    const modal = useModal()
    const modalRef = useRef(null)

    useEffect(() => {
        if (!modalRef.current) return

        if (modal.isOpen) {
            modalRef.current.showModal()
        } else {
            modalRef.current.close()
        }
    }, [modal.isOpen])

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
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            const newChannelRef = doc(channelRef);
            setLoading(true);
            try {
                await setDoc(newChannelRef, {
                    createdAt: serverTimestamp(),
                    title: title,
                    description: description,
                    creator: currentUser.id,
                    participants: [currentUser.id].concat(selectedUsersStore.getUserIDs()),
                    chatId: newChatRef.id
                });
            } catch (e) {
                console.log(e)
            }
            toast.success("Канал создан");
        } catch (e) {
            console.log(e)
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

    const resetCreating = () => {
        modal.close()
        selectedUsersStore.reset();
        setSearch([]);
    }

    if (!modal.isOpen) return null

    return (
        <dialog className={"create-channel-dialog"} ref={modalRef}>
            <form onSubmit={handleCreateChannel} className={"create-channel-form"}>
                <div className={"create-channel-dialog-header"}>
                    <h3>Создание канала</h3>
                    <span onClick={resetCreating}>X</span>
                </div>
                <label>Название канала
                    <input type={"text"} name={"title"} className={"create-channel-title-field"}/>
                </label>
                <label>Описание
                    <textarea name={"description"} className={"create-channel-description-field"} maxLength={150}/>
                </label>

                <span>Добавить пользователей</span>
                <input type={"text"} name={"userSearch"} placeholder={"Введите полное имя пользователя"}
                       className={"search-user-field"} onChange={handleUserSearch}/>
                <div className={"user-list"}>
                    {search.map(user => <UserInfo user={user} isSelected={false} />)}
                </div>
                <div className={"user-list"}>
                    <span>Выбранные пользователи:</span>
                    {selectedUsersStore.selectedUsers.map(user => <UserInfo user={user} isSelected={true} />)}
                </div>
                <button className={"create-channel-btn"} disabled={loading}>Создать канал</button>
            </form>
        </dialog>
    )
}