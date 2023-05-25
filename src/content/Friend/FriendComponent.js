import React,{useState,useEffect, useContext} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {PageContext} from '../../context/PageContext'
import './friendcomponent.scss'

const FriendComponent = () => {
  const {
    user,
    friends,
    setFriends,
    socket
  } = useContext(PageContext)
  const [onChange,setOnChange] = useState(true)
  const [clientId,setClientId] = useState(null)
  useEffect(() => {
    if(onChange===true)
      axios(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
        .then(res => {
          setFriends(res.data)
          setOnChange(false)
        })
  // eslint-disable-next-line
  },[onChange])

  useEffect(() => {
    socket.current.on('deleteFriendResponse',data => {
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
    if(clientId !== null){
      axios.post('http://127.0.0.1:5000/friend-delete',{
        'client1': user.clientId,
        'client2': clientId
      })
        .then(res => {
          socket.current.emit('deleteFriend',{
            'client1': user.clientId,
            'client2': clientId
          })
        })
    }
  // eslint-disable-next-line
  },[clientId])

  return (
    <div className='friendcomponent'>
    {
      friends.map(item => (
        <div className='friendcomponentbox' key={item.clientId}>
          <div className='friendcomponentItem'>
            <Link to={`/client/${item.clientId}`} className='friendItemImg'>
              <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='ptc'/>
            </Link>
            <Link to={`/client/${item.clientId}`} className='friendItemName'>{item.name}</Link>
            <div className='friendItemBtn' onClick={() => setClientId(item.clientId)}>
              <button>Xóa, gỡ bỏ</button>
            </div>
          </div>
        </div>
      ))
    }
    </div>
  )
}

export default FriendComponent