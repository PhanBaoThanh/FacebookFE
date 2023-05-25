import React,{useState,useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import {PageContext} from '../../context/PageContext'
import axios from 'axios'
import './friendresponsecomponent.scss'


const FriendResponseComponent = () => {
    const {
        user,
        friendRequest,
        setFriendRequest,
        socket
    } = useContext(PageContext)
    const [onChange,setOnChange] = useState(true)
    const [friendRequestId,setFriendRequestId] = useState(null)
    const [clientId,setClientId] = useState(null)
    useEffect(() => {
        if(onChange === true)
            axios(`http://127.0.0.1:5000/get-all-friend-by-friend-request/${user.clientId}`)
                .then(res => {
                    setFriendRequest(res.data)
                    setOnChange(false)
                })
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
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(friendRequestId !== null && clientId !== null){
            axios.delete(`http://127.0.0.1:5000/friend-request/${friendRequestId}`)
                .then(res => {
                    socket.current.emit('friendRequest',{
                        'client1': user.clientId,
                        'client2': clientId
                    })
                    setFriendRequestId(null)
                    setClientId(null)
                })
                .catch(err => {
                    setClientId(null)
                    setFriendRequestId(null)
                })
        }
    // eslint-disable-next-line
    },[friendRequestId])

  return (
    <div className='friendrequestcomponent'>
    {
        friendRequest.map(item => (
            <div className='friendrequestcomponentbox' key={item.clientId}>
                <div className='friendrequestcomponentItem'>
                    <Link to={`/client/${item.clientId}`} className='friendrequestItemImg'>
                        <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='ptc'/>
                    </Link>
                    <Link to={`/client/${item.clientId}`} className='friendrequestItemName'>{item.name}</Link>
                    <div className='friendrequestItemBtn' onClick={() => {setFriendRequestId(item.friendRequestId);setClientId(item.clientId)}}>
                        <button>Xóa</button>
                    </div>
                </div>
            </div>
        ))
    }
  </div>
  )
}

export default FriendResponseComponent