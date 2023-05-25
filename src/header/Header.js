import {useContext, useState,useEffect} from 'react'
import { Link,  useNavigate} from 'react-router-dom'
import { PageContext } from '../context/PageContext'
import './header.scss'
import ChatItem from './ChatItem'
import axios from 'axios'

function Header(){
    const [value,setValue] = useState('')
    const [messages,setMessages] = useState([])
    const [isLogout,setIsLogout] = useState(false)
    const {
        setIsLogin,
        setSearchValue,
        user,
        socket
    } = useContext(PageContext)

    const navigate = useNavigate()
    const [btnValue,setBtnValue] = useState(null)

    useEffect(() => {
            axios(`http://127.0.0.1:5000/get-all-chat-by-client-id/${user.clientId}`)
                .then(res => {
                    setMessages(res.data)
                })
    // eslint-disable-next-line   
    },[])

    useEffect(() => {
        socket.current.on('messageResponse',data => {
            if(data.client1 === user.clientId || data.client2 === user.clientId)
                axios(`http://127.0.0.1:5000/get-all-chat-by-client-id/${user.clientId}`)
                    .then(res => {
                        setMessages(res.data)
                    })
        })
    // eslint-disable-next-line   
    },[])

    useEffect(() => {
        if(isLogout === true){
            socket.current.emit('removeUser',user.clientId)
            socket.current.disconnect(true)
            localStorage.setItem('isLogin',JSON.stringify(false))
            localStorage.setItem('user',JSON.stringify({}))
            setIsLogin(false)
            navigate('/login')
            setIsLogout(false)
        }
    // eslint-disable-next-line   
    },[isLogout])

    const handleClickUser = () => {
        if(btnValue === 'user')
            setBtnValue(null)
        else
            setBtnValue('user')
    }

    const handleClickMess = () => {
        if(btnValue === 'mess')
            setBtnValue(null)
        else
            setBtnValue('mess')
    }

    const handleLogout = () => {
        setIsLogout(true)
    }

    const handleSearch = e => {
        if(e.keyCode === 13){
            setSearchValue(value)
            setValue('')
            navigate('/search')
        }
    }

    return (
        <div className='header'>
            <div className='headerContent1'>
                <Link to='/' className='btnCircle logoBtn'>
                <svg viewBox="0 0 36 36" fill="url(#jsc_s_2)" height="40" width="40"><defs><linearGradient x1="50%" x2="50%" y1="97.0782153%" y2="0%" id="jsc_s_2"><stop offset="0%" stopColor='#0062E0'></stop><stop offset="100%" stopColor="#19AFFF"></stop></linearGradient></defs><path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path><path fill='#fff' d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path></svg>
                </Link>
                
                <div className='search'>
                    <input placeholder='Tìm kiếm trên Facebook' value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => handleSearch(e)} className='searchInput'/>
                    <label className='searchIcon'>
                        <span ><svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" ><g  transform="translate(-448 -544)"><g><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg></span>
                    </label>
                </div>
            </div>
            <div className='headerContent2'>
                <Link to='/friend' className='btnIcon headerFriendBtn' style={{marginRight: '12px'}}>
                    <svg viewBox="0 0 28 28" fill="currentColor" height="28" width="28"><path d="M10.5 4.5c-2.272 0-2.75 1.768-2.75 3.25C7.75 9.542 8.983 11 10.5 11s2.75-1.458 2.75-3.25c0-1.482-.478-3.25-2.75-3.25zm0 8c-2.344 0-4.25-2.131-4.25-4.75C6.25 4.776 7.839 3 10.5 3s4.25 1.776 4.25 4.75c0 2.619-1.906 4.75-4.25 4.75zm9.5-6c-1.41 0-2.125.841-2.125 2.5 0 1.378.953 2.5 2.125 2.5 1.172 0 2.125-1.122 2.125-2.5 0-1.659-.715-2.5-2.125-2.5zm0 6.5c-1.999 0-3.625-1.794-3.625-4 0-2.467 1.389-4 3.625-4 2.236 0 3.625 1.533 3.625 4 0 2.206-1.626 4-3.625 4zm4.622 8a.887.887 0 00.878-.894c0-2.54-2.043-4.606-4.555-4.606h-1.86c-.643 0-1.265.148-1.844.413a6.226 6.226 0 011.76 4.336V21h5.621zm-7.122.562v-1.313a4.755 4.755 0 00-4.749-4.749H8.25A4.755 4.755 0 003.5 20.249v1.313c0 .518.421.938.937.938h12.125c.517 0 .938-.42.938-.938zM20.945 14C24.285 14 27 16.739 27 20.106a2.388 2.388 0 01-2.378 2.394h-5.81a2.44 2.44 0 01-2.25 1.5H4.437A2.44 2.44 0 012 21.562v-1.313A6.256 6.256 0 018.25 14h4.501a6.2 6.2 0 013.218.902A5.932 5.932 0 0119.084 14h1.861z"></path></svg>
                </Link>
                <button onClick={handleClickMess} className='btnIcon' style={{marginRight: '12px'}}>
                    <svg viewBox="0 0 28 28" alt="" fill="currentColor" height="20" width="20"><path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path></svg>
                </button>
                <img onClick={handleClickUser} src={`http://127.0.0.1:5000/img/${user.avatar}`} alt='ptc' className='btnCircle' />
            
                <div className='userInfo' style={btnValue === 'user' ? {display: 'flex'} : {display: 'none'}}>
                    <div className='user'>
                        <Link to='/myAccount' onClick={() =>setBtnValue(null)} className='userItem'>
                            <div className='btnCircle'>
                                <img style={{borderRadius: '50%',width: '100%',height: '100%'}} className='userItemImg' src={`http://127.0.0.1:5000/img/${user.avatar}`} alt='' />
                            </div>
                            <p>{user.name}</p>
                        </Link>
                        <div className='userItem' onClick={handleLogout}>
                            <div className='btnIcon'>
                                <i className='userItemImg icon'></i>
                            </div>
                            <p>Đăng xuất</p>
                        </div>
                    </div>
                </div>
                <div className='messenger' style={btnValue === 'mess' ? {display: 'flex'} : {display: 'none'}}>
                    <h2>Chat</h2>
                    <div className='messengers'>
                        {messages.map(item => (
                            <ChatItem setBtnValue={setBtnValue} item={item} chatId={item.chatId}  />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header