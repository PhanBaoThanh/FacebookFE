import {useContext, useState,useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContext } from '../../context/PageContext'
import axios from 'axios'
import './register.scss'
import { Link } from 'react-router-dom'
import {io} from 'socket.io-client'

function Register(){
    const [name,setName] = useState('')
    const [sdt,setSdt] = useState('')
    const [email,setEmail] = useState('')
    const [birthDay,setBirthDay] = useState()
    const [sex,setSex] = useState('nam')
    const [avt,setAvt] = useState('')
    const [backgroundImg,setBackgroundImg] = useState('')
    const [account,setAccount] = useState('')
    const [password,setPassword] = useState('')
    const [err,setErr] = useState(false)
    const avtRef = useRef()
    const backgroundImgRef = useRef()
    const navigate = useNavigate()

    const {
        setIsLogin,
        setUser,
        socket
    } = useContext(PageContext)

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    function containsOnlyNumber(str){
        return /^[0-9]+$/.test(str);
    }
    const handleSubmit = () => {
        if(
            name !== '' && 
            sdt !== ''  && containsOnlyNumber(sdt) &&
            email !== '' && email.match(mailformat) &&
            birthDay !== null &&
            avt !== '' &&
            backgroundImg !== '' &&
            account !== '' &&
            password !== ''
        ) {
            const formData = new FormData()
            formData.append('hoten',name)
            formData.append('sdt',sdt)
            formData.append('email',email)
            formData.append('taikhoan',account)
            formData.append('matkhau',password)
            formData.append('gioitinh', sex === 'nam' ? true : false)
            formData.append('ngaysinh',birthDay)
            formData.append('avt', avtRef.current.files[0], avtRef.current.files[0].name)
            formData.append('backgroundImage', backgroundImgRef.current.files[0], backgroundImgRef.current.files[0].name)
            axios.post('http://127.0.0.1:5000/client',formData, {headers: {'Content-Type': 'multipart/form-data' ,'Access-Control-Allow-Origin': '*'}})
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
                }
                )
                .catch(err => {
                    setErr(true)
                })
        }
        else 
            setErr(true)
    }

    const handleKeyDown = e => {
        if(e.keyCode === 13){
            if(
                name !== '' && 
                sdt !== ''  && containsOnlyNumber(sdt) &&
                email !== '' && email.match(mailformat) &&
                birthDay !== null &&
                avt !== '' &&
                backgroundImg !== '' &&
                account !== '' &&
                password !== ''
            ) {
                const formData = new FormData()
                formData.append('hoten',name)
                formData.append('sdt',sdt)
                formData.append('email',email)
                formData.append('taikhoan',account)
                formData.append('matkhau',password)
                formData.append('gioitinh', sex === 'nam' ? true : false)
                formData.append('ngaysinh',birthDay)
                formData.append('avt', avtRef.current.files[0], avtRef.current.files[0].name)
                formData.append('backgroundImage', backgroundImgRef.current.files[0], backgroundImgRef.current.files[0].name)
                axios.post('http://127.0.0.1:5000/client',formData, {headers: {'Content-Type': 'multipart/form-data' }})
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
                    }
                    )
                    .catch(err => {
                        setErr(true)
                    })
            }
            else
                setErr(true)
        }
    }

    return (
        <div className='registerContainer'>
            <div className='register'>
                <div className='register__header'>
                    <h1>facebook</h1>
                    <p>Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.</p>
                </div>
                <div className='register__box'>
                    <div className='registerContent'>
                        <p className='registerHeader'>Đăng ký</p>
                        <input className='register__box__input' type='text' placeholder='Họ tên' onChange={e => setName(e.target.value)}/>
                        <input className='register__box__input' type='text' placeholder='Số điện thoại' onChange={e => setSdt(e.target.value)}/>
                        <input className='register__box__input' type='email' placeholder='Email' onChange={e => setEmail(e.target.value)}/>
                        <div style={{display: 'flex',justifyContent:'space-between'}}>
                            <input className='register__box__input2' type='date' placeholder='Ngày sinh' onChange={e => setBirthDay(e.target.value)}/>
                            <select className='register__box__select' value={sex} onChange={e => setSex(e.target.value)}>
                                <option value='nam' style={{color: '#000'}}>Nam</option>
                                <option value='nu' style={{color: '#000'}}>Nữ</option>
                            </select>
                        </div>
                        <div>
                            <div className='UserSttImg'>
                                <label htmlFor='imgStt'>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                                    <span style={{marginLeft: '8px'}}>Ảnh avatar</span>
                                    <input ref={avtRef} type='file' onChange={e => setAvt(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id='imgStt' name='imgStt'  />
                                </label>
                                <span className='nameImg'>{avt}</span>
                            </div>
                        </div>

                        <div>
                            <div className='UserSttImg'>
                                <label htmlFor='imgBg'>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                                    <span style={{marginLeft: '8px'}}>Ảnh bìa</span>
                                    <input ref={backgroundImgRef} type='file' onChange={e => setBackgroundImg(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id='imgBg' name='imgBg'  />
                                </label>
                                <span className='nameImg'>{backgroundImg}</span>
                            </div>
                        </div>

                        <input className='register__box__input' type='text' placeholder='Tên tài khoản' onChange={e => setAccount(e.target.value)}/>
                        <input className='register__box__input' type='password' placeholder='Mật khẩu' onKeyDown={e => handleKeyDown(e)} onChange={e => setPassword(e.target.value)}/>
                        {
                            err ? (
                                <p style={{color: 'red',marginBottom: '10px'}}>Đăng nhập thất bại</p>
                            ) : (
                                <></>
                            )
                        }
                        <button className='registerBtn' onClick={() => handleSubmit()}>Đăng ký</button>
                        <Link to='/login' className='loginBtn'>Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register