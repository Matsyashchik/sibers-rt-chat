import './App.css';
import Login from "./components/login/Login";
import Notification from "./components/norification/Notification";
import {useUserStore} from "./lib/userStore";
import {auth} from "./lib/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {useEffect} from "react";
import Main from "./components/main/Main";

function App() {
    const {currentUser, isLoading, fetchUserInfo} = useUserStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            fetchUserInfo(user?.uid)
        });

        return () => {
            unSub();
        };

    }, [fetchUserInfo])

    if (isLoading) return (<div>Loading...</div>)

    return (
        <div className="App">
            {
                currentUser ? (
                    <>
                       <Main/>
                    </>
                ) : <Login/>

            }
            <Notification/>
        </div>
    );
}

export default App;
