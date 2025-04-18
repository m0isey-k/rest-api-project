import Input from "../Components/Input";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { login } from "../api";

const USER_REGEX = /^(?=.{3,}$)[a-z0-9]+(_|-)*[a-z0-9]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
function Login(){
    const navigate = useNavigate();

    const [user, setUser] = useState({value: "", isValid: false});
    const [pwd, setPwd] = useState({value: "", isValid: false});
    const [error, setError] = useState('')

    useEffect(() => {
        setUser(p => ({...p , isValid: USER_REGEX.test(user.value)}));
    }, [user.value])

    useEffect(() => {
        setPwd(p => ({...p, isValid: PWD_REGEX.test(pwd.value)}))
    }, [pwd.value])

    useEffect(() => {
        setError('');
    }, [user.value, pwd.value])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(user.isValid && pwd.isValid)) {
            setError("Invalid Entry");
            return;
        }
        try {
            const response = await login(user.value, pwd.value);
            navigate('/')
        }
        catch(err) {
            if (!err?.response) {
                setError('No Server Response');
            } else {
                setError('Login Failed')
            }
        }
    }


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
                            name="password"
                            type="password" 
                            id="password"
                            placeholder="Password" 
                            value={pwd.value}
                            onChange={(e) => setPwd(p => ({...p, value: e.target.value}))}
                            className={pwd.isValid || !pwd.value ? "mt-6" : "mt-6 shadow-[0_0_4px_1px] shadow-red-500"}
                        />
                        <a href="#" className="block text-right text-white text-sm mt-2">Forgot Password?</a>
                        <button type="submit" className="w-full h-11 px-6 rounded-md bg-primary-a0 text-sm text-white shadow-primary-a0 hover:shadow-[0_0_4px_1px] focus:shadow-[0_0_4px_1px] duration-150 focus:outline-none cursor-pointer mt-14">Log In</button>
                        <p href="#" className="text-white text-sm mt-8">Don't have an account? <a href="signup" className="text-primary-a0">Sign Up</a></p>

                    </form>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default Login

