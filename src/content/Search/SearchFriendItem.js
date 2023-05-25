import axios from 'axios'
import React, { useState,useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { PageContext } from '../../context/PageContext'
import './search.scss'

//friend
//friend-request
//friend-response
//not-friend
const SearchFriendItem = ({item,setFriendRequestData,friendRequestData}) => {
    const {
        user,
        friends,
        setFriends,
        socket
    } = useContext(PageContext)
    const [isFriend,setIsFriend] = useState(false)
    const [stt,setStt] = useState('not-friend')
    const [onClick,setOnClick] = useState(false)
    const [isDelete,setIsDelete] = useState(false)

    useEffect(() => {
        if(friends.find(i => i.clientId === item.clientId))
            setStt('friend')
        else {
            if(friendRequestData.find(i => i.senderId === item.clientId))
                setStt('friend-response')
            else if(friendRequestData.find(i => i.receiverId === item.clientId))
                setStt('friend-request')
            else
                setStt('not-friend')
        }
    // eslint-disable-next-line
    },[friends,friendRequestData])

    useEffect(() => {
        socket.current.on('friendRequestRes',data => {
            if(data.client1 === item.clientId || data.client2 === item.clientId)
                axios.get(`http://127.0.0.1:5000/get-all-friend-request-by-client-id/${user.clientId}`)
                    .then(res => {
                        setFriendRequestData(res.data)
                    })
        })

        socket.current.on('friendRequestConfirmRes',data => {
            if(data.client1 === item.clientId || data.client2 === item.clientId){
                axios.get(`http://127.0.0.1:5000/get-all-friend-request-by-client-id/${user.clientId}`)
                    .then(res => {
                        setFriendRequestData(res.data)
                    })
                axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                    .then(res => {
                        setFriends(res.data)
                    })  
            }
        })

        socket.current.on('deleteFriendResponse',data => {
            if(data.client1 === item.clientId || data.client2 === item.clientId)
                axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                    .then(res => {
                        setFriends(res.data)
                    })  
        })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(onClick){
            if(stt === 'friend')
                axios.post('http://127.0.0.1:5000/friend-delete',{
                    'client1': user.clientId,
                    'client2': item.clientId
                })
                    .then(res => {
                        socket.current.emit('deleteFriend',{
                            'client1': user.clientId,
                            'client2': item.clientId
                        })
                    })
            else if(stt === 'friend-request')
                axios.post('http://127.0.0.1:5000/friend-request-delete',{
                    'senderId': user.clientId,
                    'receiverId': item.clientId
                })
                    .then(res => {
                        socket.current.emit('friendRequest',{
                            'client1': user.clientId,
                            'client2': item.clientId
                        })
                    })
            else if(stt === 'friend-response'){
                if(isDelete)
                    axios.post('http://127.0.0.1:5000/friend-request-delete',{
                        'receiverId': user.clientId,
                        'senderId': item.clientId
                    })
                        .then(res => {
                            socket.current.emit('friendRequest',{
                                'client1': user.clientId,
                                'client2': item.clientId
                            })
                            setIsDelete(false)
                        })
                else
                    axios.post('http://127.0.0.1:5000/friend-request-confirm',{
                        'receiverId': user.clientId,
                        'senderId': item.clientId
                    })
                        .then(res => {
                            socket.current.emit('friendRequestConfirm',{
                                'client1': user.clientId,
                                'client2': item.clientId
                            })
                        })
            }
                
            else
                axios.post('http://127.0.0.1:5000/friend-request',{
                    'nguoigui': user.clientId,
                    'nguoinhan': item.clientId
                })
                    .then(res => {
                        socket.current.emit('friendRequest',{
                            'client1': user.clientId,
                            'client2': item.clientId
                        })
                    })

            setOnClick(false)
        }
    // eslint-disable-next-line
    },[onClick])

    const handleClickAddFriend = (value) => {
        setIsFriend(!isFriend)
        setOnClick(true)
        setIsDelete(value)
    }

    return (
        <div className='searchContentItem'>
            <div className='searchContentItemFriend'>
                <div className='searchContentItemFriendBox'>
                    <Link to={`/client/${item.clientId}`} className='searchImgFriend'>
                        <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='ptc' className='searchImgFriendItem' />
                    </Link>
                    <Link to={`/client/${item.clientId}`} className='searchAuthor'>{item.name}</Link>
                </div>
                <div className='searchContentItemFriendBox'>
                {
                    stt === 'friend' ? (
                        <button className='cancel' onClick={() => handleClickAddFriend(false)}>Xóa bạn</button>
                    ) : stt === 'friend-request' ? (
                        <button className='cancel' onClick={() => handleClickAddFriend(false)}>Hủy yêu cầu</button>
                    ) : stt === 'friend-response' ? (
                        <>
                            <button style={{marginRight: '8px'}} onClick={() => handleClickAddFriend(false)}>Xác nhận</button>
                            <button className='cancel' onClick={() => handleClickAddFriend(true)}>Xóa</button>
                        </>
                    ) : (
                        <button onClick={() => handleClickAddFriend(false)}>Thêm bạn bè</button>
                    )
                }
                </div>
            </div>
        </div>
    )
}

export default SearchFriendItem