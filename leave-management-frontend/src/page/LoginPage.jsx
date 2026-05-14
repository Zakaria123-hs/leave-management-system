import  { useState } from 'react'
import axios from 'axios'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'
const LoginPage = () => {
    // const Navigate = useNavigate()
    const { setUser } = useAuth();
    const [userLogin, setUserLogin] = useState({
        email: '',
        password: ''
    })
    const handlInput = (e) =>{
        setUserLogin({
            ...userLogin,
            [e.target.name] : e.target.value
        })
    }

    const HandleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.get(
                "http://127.0.0.1:8000/sanctum/csrf-cookie",
                { withCredentials: true }
            );
            const response = await login(userLogin)
            setUser(response.data.user)
            if(response.data.user.role === 'employee') {
                console.log('/employee')
            }
            if(response.data.user.role === 'manager') {
                console.log('/manager')
            }
            if(response.data.user.role === 'hr') {
                console.log('/hr')
            }
        }catch(error) {

            if (error.response?.status === 401) {
                alert("Invalid Credentials");
            } else {
                console.error("Login Error:", error);
            }
        }
    }
    return (

        <div>
            <form onSubmit={HandleLogin}>
                <label>email</label>
                <input type='email' name='email' value={userLogin.email} onChange={handlInput}/>
                <label>password</label>
                <input type='password' name='password' value={userLogin.password} onChange={handlInput}/>
                <input type='submit' value={'login'}/>
            </form>
        </div>
    )
}

export default LoginPage
