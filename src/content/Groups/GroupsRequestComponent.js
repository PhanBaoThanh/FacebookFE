import React,{useState,useEffect, useContext} from 'react'
import axios from 'axios'
import './groupsrequestcomponent.scss'
import {Link} from 'react-router-dom'
import { PageContext } from '../../context/PageContext'

const GroupsRequestComponent = () => {
  const {
    user,
    socket
  } = useContext(PageContext)
  const [groupRequest,setGroupRequest] = useState([])
  const [onChange,setOnChange] = useState(true)
  const [groupId,setGroupId] = useState(null)
  useEffect(() => {
    if(onChange === true)
      axios(`http://127.0.0.1:5000/get-all-group-by-group-request/${user.clientId}`)
        .then(res => {
          setGroupRequest(res.data)
          setOnChange(false)
        })
  // eslint-disable-next-line
  },[onChange])

  useEffect(() => {
    socket.current.on('groupMemberRequestRes',data => {
      if(data.userId === user.clientId)
        setOnChange(true)
    })

    socket.current.on('groupMemberRequestConfirmRes',data => {
      if(data.userId === user.clientId)
          setOnChange(true)
  })
  // eslint-disable-next-line
  },[])

  useEffect(() => {
    if(groupId !== null){
      axios.post('http://127.0.0.1:5000/group-request-delete',{
        'clientId': user.clientId,
        'groupId': groupId
      })
        .then(res => {
          socket.current.emit('groupMemberRequest',{
            'userId': user.clientId,
            'groupId': groupId
          })
          // setOnChange(true)
          setGroupId(null)
        })
        .catch(err => {
          setGroupId(null)
        })
    }
  // eslint-disable-next-line
  },[groupId])

  return (
    <div className='grouprequestcomponent'>
    {
      groupRequest.map(item => (
        <div className='grouprequestcomponentbox' key={item.groupId}>
          <div className='grouprequestcomponentItem'>
            <Link to={`/group/${item.groupId}`} className='grouprequestItemImg'>
              <img src={`http://127.0.0.1:5000/img/${item.backgroundImg}`} alt='ptc'/>
            </Link>
            <Link to={`/group/${item.groupId}`} className='grouprequestItemName'>{item.name}</Link>
            <div className='grouprequestItemBtn' onClick={() => setGroupId(item.groupId)}>
              <button>Hủy yêu cầu tham gia nhóm</button>
            </div>
          </div>
        </div>
      )
      )
    }

      

      
      
    </div>
  )
}

export default GroupsRequestComponent