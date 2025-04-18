import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import Input from "../Components/Input";
import axios from "axios";
import { signup } from "../api";

const USER_REGEX = /^(?=.{3,}$)[a-z0-9]+(_|-)*[a-z0-9]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function SignUp() {
    const navigate = useNavigate();

    const [user, setUser] = useState({value: "", isValid: false});
    const [email, setEmail] = useState({value: "", isValid: false});
    const [pwd, setPwd] = useState({value: "", isValid: false});
    const [error, setError] = useState('')

    useEffect(() => {
        setUser(p => ({...p , isValid: USER_REGEX.test(user.value)}));
    }, [user.value])

    useEffect(() => {
        setEmail(p => ({...p , isValid: EMAIL_REGEX.test(email.value)}));
    }, [email.value])

    useEffect(() => {
        setPwd(p => ({...p, isValid: PWD_REGEX.test(pwd.value)}))
    }, [pwd.value])

    useEffect(() => {
        setError('');
    }, [user.value, email.value, pwd.value])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(user.isValid && pwd.isValid && email.isValid)) {
            setError("Invalid Entry");
            return;
        }
        try {
            const response = await signup(user.value, email.value, pwd.value);
            navigate('/')
        }
        catch(err) {
            if (!err?.response) {
                setError('No Server Response');
            } else {
                setError('Login Failed')
            }
        }
    };

    return(
        <div className="flex h-screen">
            <div className="relative bg-surface-a10 m-auto shadow-[0_0_1px_1px] shadow-primary-a0 rounded-lg text-center">
                <div className="w-80 mx-8 my-10">
                    <form onSubmit={handleSubmit}>
                        <Input
                            name="username"
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={user.value}
                            onChange={(e) => setUser(p => ({...p, value: e.target.value}))}
                            className={user.isValid || !user.value ? "" : "shadow-[0_0_4px_1px] shadow-red-500"}
                        />
                        <Input
                            name="email"
                            type="text"
                            id="email"
                            placeholder="Email"
                            value={email.value}
                            onChange={(e) => setEmail(p => ({...p, value: e.target.value}))}
                            className={email.isValid || !email.value ? "mt-6" : "mt-6 shadow-[0_0_4px_1px] shadow-red-500"}
                        />
                        <Input 
                            name="password"
                            type="password" 
                            id="password"
                            placeholder="Password" 
                            value={pwd.value}
                            onChange={(e) => setPwd(p => ({...p, value: e.target.value}))}
                            className={pwd.isValid || !pwd.value ? "mt-6" : "mt-6 shadow-[0_0_4px_1px] shadow-red-500"}
                        />
                        <button type="submit" className="w-full h-11 px-6 rounded-md bg-primary-a0 text-sm text-white shadow-primary-a0 hover:shadow-[0_0_4px_1px] focus:shadow-[0_0_4px_1px] duration-150 focus:outline-none cursor-pointer mt-14">Sign Up</button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <p href="#" className="text-white text-sm mt-8">Have an account? <NavLink to={"/login"} className="text-primary-a0">Log In</NavLink></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp

