import React,{useState,useEffect,useRef, useContext} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './user.scss'
import { PageContext } from '../../context/PageContext'

const FriendUser = ({friends,setFriends}) => {
    const {
        user,
        socket
    } = useContext(PageContext)
    const [isClick,setIsClick] = useState('banbe')
    const [data,setData] = useState(friends)
    const [filterData,setFilterData] = useState(friends)
    const [clientId,setClientId] = useState(null)
    const [onChange,setOnChange] = useState(false)
    const [deleteId,setDeleteId] = useState(null)
    const [clientDelete,setClientDelete] = useState(null)
    const inputRef = useRef()

    useEffect(() => {
        if(isClick === 'banbe')
            axios(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                .then(res => {
                    setData(res.data)
                    setFriends(res.data)
                    setFilterData(res.data)
                })
        else if(isClick === 'loimoi')
            axios(`http://127.0.0.1:5000/get-all-friend-by-friend-response/${user.clientId}`)
                .then(res => {
                    setData(res.data)
                    setFilterData(res.data)
                })
        else
            axios(`http://127.0.0.1:5000/get-all-friend-by-friend-request/${user.clientId}`)
                .then(res => {
                    setData(res.data)
                    setFilterData(res.data)
                })
    // eslint-disable-next-line
    },[isClick])

    useEffect(() => {
        if(onChange === true){
            if(isClick === 'banbe')
                axios(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                    .then(res => {
                        setData(res.data)
                        setFriends(res.data)
                        setOnChange(false)
                        setFilterData(res.data)
                    })
            else if(isClick === 'loimoi')
                axios(`http://127.0.0.1:5000/get-all-friend-by-friend-response/${user.clientId}`)
                    .then(res => {
                        setData(res.data)
                        setOnChange(false)
                        setFilterData(res.data)
                    })
            else
                axios(`http://127.0.0.1:5000/get-all-friend-by-friend-request/${user.clientId}`)
                    .then(res => {
                        setData(res.data)
                        setOnChange(false)
                        setFilterData(res.data)
                    })
        }
    // eslint-disable-next-line
    },[onChange])

    useEffect(() => {
        socket.current.on('friendRequestRes',data => {
            if(data.client1 === user.clientId || data.client2 === user.clientId)
                setOnChange(true)
        })

        socket.current.on('friendRequestConfirmRes',data => {
            if(data.client1 === user.clientId || data.client2 === user.clientId)
                setOnChange(true)
        })

        socket.current.on('deleteFriendResponse',data => {
            if(data.client1 === user.clientId || data.client2 === user.clientId)
                setOnChange(true)
        })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(clientId !== null){
            if(isClick === 'banbe')
                axios.post('http://127.0.0.1:5000/friend-delete',{
                    'client1': user.clientId,
                    'client2': clientId
                })
                    .then(res => {
                        socket.current.emit('deleteFriend',{
                            'client1': user.clientId,
                            'client2': clientId
                        })
                        setClientId(null)
                    })
            else if(isClick === 'loimoi')
                axios.post('http://127.0.0.1:5000/friend-request-confirm',{
                    'receiverId': user.clientId,
                    'senderId': clientId
                })
                    .then(res => {
                        socket.current.emit('friendRequestConfirm',{
                            'client1': user.clientId,
                            'client2': clientId
                        })
                        setClientId(null)
                    })
        }
      // eslint-disable-next-line
      },[clientId])

    useEffect(() => {
        if(deleteId !== null)
            axios.delete(`http://127.0.0.1:5000/friend-request/${deleteId}`)
                .then(res => {
                    socket.current.emit('friendRequest',{
                        'client1': user.clientId,
                        'client2': clientDelete
                    })
                    setClientDelete(null)
                    setDeleteId(null)
                })
    // eslint-disable-next-line
    },[deleteId])

    const handleSearch = e => {
        if(e.target.value === '' || e.target.value === null)
            setFilterData(data)
        else
            setFilterData(data.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())))
    }

    const handleClickBtn = id => {
        setClientId(id)
    }

    const handleClickDeleteBtn = (id1,id2) => {
        setDeleteId(id1)
        setClientDelete(id2)
    }

    return (
        <div className='friendUser'>
            <div className='friendUserHeader'>
                <h2>Bạn bè</h2>
                <div className='search'>
                    <input ref={inputRef} placeholder='Tìm kiếm' onChange={e => handleSearch(e)} className='searchInput'/>
                    <label className='searchIcon'>
                        <span ><svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" ><g  transform="translate(-448 -544)"><g><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg></span>
                    </label>
                </div>
            </div>
            <div className='friendUserNav'>
                <div className='friendUserNavItems'>
                    <div className={`friendUserNavItem ${isClick === 'banbe' ? 'isClick' : ''}`} onClick={() =>{ setIsClick('banbe');inputRef.current.value = ''}}>Bạn bè</div>
                    <div className={`friendUserNavItem ${isClick === 'loimoi' ? 'isClick' : ''}`} onClick={() =>{ setIsClick('loimoi');inputRef.current.value = ''}}>Lời mời kết bạn</div>
                    <div className={`friendUserNavItem ${isClick === 'yeucau' ? 'isClick' : ''}`} onClick={() =>{ setIsClick('yeucau');inputRef.current.value = ''}}>Yêu cầu kết bạn</div>
                </div>
            </div>
            <div className='friendUserContent'>
                {
                    filterData.map(item => (
                        <div className='friendUserContentItem' key={item.clientId}>
                            <div className='friendUserContentItemBox'>
                                <div className='friendUserContentItemHeader'>
                                    <Link to={`/client/${item.clientId}`}>
                                        <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='avt' />
                                    </Link>
                                    <Link to={`/client/${item.clientId}`}>{item.name}</Link>
                                </div>
                                {
                                    isClick === 'banbe' ? (
                                        <div className='friendUserContentItemBtn'>
                                            <button onClick={() => handleClickBtn(item.clientId)}>Xóa bạn</button>
                                        </div>
                                    ) : isClick === 'loimoi' ? (
                                        <div style={{display: 'flex'}}>
                                            <div style={{marginRight: '8px'}} className='friendUserContentItemBtnAccept'>
                                                <button onClick={() => handleClickBtn(item.clientId)}>Xác nhận</button>
                                            </div>
                                            <div className='friendUserContentItemBtn'>
                                                <button onClick={() => handleClickDeleteBtn(item.friendRequestId,item.clientId)}>Xóa</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='friendUserContentItemBtn'>
                                            <button onClick={() => handleClickDeleteBtn(item.friendRequestId,item.clientId)}>Hủy yêu cầu</button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FriendUser