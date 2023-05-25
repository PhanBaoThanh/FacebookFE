import React,{useState,useEffect, useContext} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './friendrequestcomponent.scss'
import { PageContext } from '../../context/PageContext'

const FriendRequestComponent = () => {
  const {
    user,
    friendResponse,
    setFriendResponse,
    socket
  } = useContext(PageContext)
  const [onChange,setOnChange] = useState(true)
  const [clientIdDelete,setClientIdDelete] = useState(null)
  const [clientIdConfirm,setClientIdConfirm] = useState(null)
  const [friendResponseIdDelete,setFriendResponseIdDelete] = useState(null)
  useEffect(() => {
    if(onChange === true)
      axios(`http://127.0.0.1:5000/get-all-friend-by-friend-response/${user.clientId}`)
          .then(res => {
              setFriendResponse(res.data)
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
    if(friendResponseIdDelete !== null && clientIdDelete !== null)
    axios.delete(`http://127.0.0.1:5000/friend-request/${friendResponseIdDelete}`)
      .then(res => {
        socket.current.emit('friendRequest',{
          'client1': user.clientId,
          'client2': clientIdDelete
        })
        setFriendResponseIdDelete(null)
        setClientIdDelete(null)
      })
      .catch(err => {
        setFriendResponseIdDelete(null)
        setClientIdDelete(null)
      }) 
  // eslint-disable-next-line
  },[friendResponseIdDelete])

  useEffect(() => {
    if(clientIdConfirm!== null)
      axios.post('http://127.0.0.1:5000/friend-request-confirm',{
        'receiverId': user.clientId,
        'senderId': clientIdConfirm
      })
        .then(res => {
          socket.current.emit('friendRequestConfirm',{
            'client1': user.clientId,
            'client2': clientIdConfirm
          })
          setClientIdConfirm(null)
        })
        .catch(err => {
          setClientIdConfirm(null)
        })
  // eslint-disable-next-line
  },[clientIdConfirm])


  return (
    <div className='friendcomponentrequest'>
    {
      friendResponse.map(item => (
        <div className='friendcomponentrequestbox' key={item.clientId}>
          <div className='friendcomponentrequestItem'>
            <Link to={`/client/${item.clientId}`} className='friendrequestItemImg'>
              <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='ptc'/>
            </Link>
            <Link to={`/client/${item.clientId}`} className='friendrequestItemName'>{item.name}</Link>
            <div className='friendrequestItemBtn' onClick={() => setClientIdConfirm(item.clientId)}>
              <button className='friendrequestItemBtn confirm'>Xác nhận</button>
            </div>
            <div className='friendrequestItemBtn' onClick={() => {setFriendResponseIdDelete(item.friendRequestId);setClientIdDelete(item.clientId)}}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      ))
    }
  </div>
  )
}

export default FriendRequestComponent