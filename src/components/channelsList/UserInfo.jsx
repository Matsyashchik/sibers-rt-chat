import {useSelectedUsersStore} from "../../lib/selectedUsersStore";


export const UserInfo = ({user, isSelected}) => {
    const {removeUser, addUser} = useSelectedUsersStore()

    return <div className={"user-info"} key={isSelected ? "selected:" + user.id : user.id}>
        <span>{user.username}</span>
        {isSelected
            ? <div onClick={() => removeUser(user)}>x</div>
            : <div onClick={() => addUser(user)}>+</div>
        }
    </div>
}