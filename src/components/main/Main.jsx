import "./main.css";
import {auth} from "../../lib/firebase";

const Main = () => {
    const handlerLogOut = async (e) => {
        e.preventDefault();
        await auth.signOut()
    }

    return <div>
        <button onClick={handlerLogOut}>Разлогиниться</button>
    </div>
}

export default Main;