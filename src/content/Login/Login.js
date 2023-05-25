import {useState,useContext,useEffect,useRef} from 'react'
import { PageContext } from '../../context/PageContext'
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom'
import './login.scss'
import {io} from 'socket.io-client'

function Login(){
    const {
        setIsLogin,
        setUser,
        socket
    } = useContext(PageContext)
    const [account,setAccount] = useState('')
    const [password,setPassword] = useState('')
    const [err,setErr] = useState(false)
    const accountRef = useRef()
    const navigate = useNavigate()
    const handleSubmit = () => {
        if(account !== null && account !== '' && password !== null && password !== ''){
            axios.post(' http://127.0.0.1:5000/client/login',{
                'taikhoan': account,
                'matkhau': password
            },{headers: {'Content-Type': 'application/json'}})
                .then(res => {
                    if(socket.current)
                        socket.current.connect()
                    else
                        socket.current = io.connect('http://127.0.0.1:5000')
                    socket.current.emit('addUser',res.data.clientId)

                    setIsLogin(true)
                    localStorage.setItem('isLogin',JSON.stringify(true))
                    localStorage.setItem('user',JSON.stringify({
                        account: res.data.account,
                        avatar: res.data.avatar,
                        backgroundImg: res.data.backgroundImg,
                        clientId: res.data.clientId,
                        dayOfBirth: res.data.dayOfBirth.slice(1,-1).split('T')[0],
                        email: res.data.email,
                        name: res.data.name,
                        phoneNumber: res.data.phoneNumber,
                        sex: res.data.sex,
                    }))
                    setUser(JSON.parse(localStorage.getItem('user')))
                    navigate('/')
                })
                .catch(err => {
                    accountRef.current.focus()
                    setErr(true)
                    setAccount('')
                    setPassword('')
                })
        }
    }

    useEffect(() => {
        if(JSON.parse(localStorage.getItem('isLogin')))
            navigate('/')
    // eslint-disable-next-line
    },[])

    const handleKeyDown = e => {
        if(e.keyCode === 13){
            axios.post('http://127.0.0.1:5000/client/login',{
                'taikhoan': account,
                'matkhau': password
            },{headers: {'Content-Type': 'application/json'}})
                .then(res => {
                    if(socket.current)
                        socket.current.connect()
                    else
                        socket.current = io.connect('http://127.0.0.1:5000')
                    socket.current.emit('addUser',res.data.clientId)

                    setIsLogin(true)
                    localStorage.setItem('isLogin',JSON.stringify(true))
                    localStorage.setItem('user',JSON.stringify({
                        account: res.data.account,
                        avatar: res.data.avatar,
                        backgroundImg: res.data.backgroundImg,
                        clientId: res.data.clientId,
                        dayOfBirth: res.data.dayOfBirth.slice(1,-1).split('T')[0],
                        email: res.data.email,
                        name: res.data.name,
                        phoneNumber: res.data.phoneNumber,
                        sex: res.data.sex,
                    }))
                    setUser(JSON.parse(localStorage.getItem('user')))
                    navigate('/')
                })
                .catch(err => {
                    accountRef.current.focus()
                    setErr(true)
                    setAccount('')
                    setPassword('')
                })
            
        }
    }

    const handleChangeAccount = e => {
        setAccount(e.target.value)
        setErr(false)
    }

    const handleChangePassword = e => {
        setPassword(e.target.value)
        setErr(false)
    }

    return (
        <div className='loginContainer'>
            <div className='login'>
                <div className='login__header'>
                    <h1>facebook</h1>
                    <p>Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.</p>
                </div>
                <div className='login__box'>
                    <div className='loginContent'>
                        <p className='loginHeader'>Đăng nhập</p>
                        <input ref={accountRef} className='login__box__input' type='text' placeholder='Tên tài khoản' value={account} onChange={e => handleChangeAccount(e)} />
                        <input className='login__box__input' type='password' placeholder='Mật khẩu' value={password} onKeyDown={e => handleKeyDown(e)} onChange={e => handleChangePassword(e)}/>
                        {
                            err ? (
                                <p style={{color: 'red',marginBottom: '10px'}}>Đăng nhập thất bại</p>
                            ) : (
                                <></>
                            )
                        }
                        <button className='loginBtn' onClick={handleSubmit}>Đăng nhập</button>
                        <Link to='/register' className='registerBtn'>Tạo tài khoản mới</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login