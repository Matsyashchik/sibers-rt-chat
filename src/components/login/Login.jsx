import {toast} from "react-toastify";
import "./login.css";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../lib/firebase";
import {doc, setDoc, getDocs} from "firebase/firestore";
import {useState} from "react";
import {collection, query, where,} from "firebase/firestore";

const Login = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);

        if (!email || !password)
            return toast.warn("Пожалуйста заполните все данные");

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Вход успешно выполнен");
        } catch (e) {
            console.log(e)
            toast.error("Ошибка входа");
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const {username, email, password} = Object.fromEntries(formData);

        if (!username || !email || !password)
            return toast.warn("Пожалуйста заполните все данные");

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return toast.warn("Пользователь с таким именем уже существует");
        }

        try {
            setLoading(true);
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                username: username,
                email: email,
                id: res.user.uid,
            });
            toast.success("Вы успешно зарегистрированы");
        } catch (e) {
            console.log(e)
            toast.error("Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    }

    return <div className={"container"}>
        <div className={"login-container"}>
            <div className={"login"}>
                <h2>Добро пожаловать</h2>
                <form onSubmit={handleLogin}>
                    <input type={"email"} name={"email"} minLength={5} placeholder="email"/>
                    <input type={"password"} name={"password"} minLength={6} placeholder={"пароль"}/>
                    <button disabled={loading}>Войти</button>
                </form>
            </div>

            <div className={"separator"}/>
            <div className={"login"}><h2>Создать аккаунт</h2>
                <form onSubmit={handleRegister}>
                    <input type={"text"} name={"username"} minLength={1} placeholder={"имя"}/>
                    <input type={"email"} name={"email"} minLength={6} placeholder="email"/>
                    <input type={"text"} name={"password"} minLength={6} placeholder={"пароль"}/>
                    <button disabled={loading}>Зарегистрироваться</button>
                </form>
            </div>
        </div>
    </div>
}

export default Login;