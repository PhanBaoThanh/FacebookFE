import React,{useContext, useEffect,useState} from 'react'
import './groupscomponent.scss'
import {Link} from 'react-router-dom'
import { PageContext } from '../../context/PageContext'
import axios from 'axios'

const GroupsComponent = () => {
  const {
    user,
    groups,
    setGroups,
    socket
  } = useContext(PageContext)
  const [groupId,setGroupId] = useState(null)
  const [isChange,setIsChange] = useState(true)

  useEffect(() => {
    if(isChange === true)
      axios(`http://127.0.0.1:5000/get-all-group-by-client-id/${user.clientId}`)
        .then(res => {
          setGroups(res.data)
        })
   // eslint-disable-next-line
  },[isChange])

  useEffect(() => {
    socket.current.on('outGroupResponse',data => {
      if(data.userId === user.clientId){
        setIsChange(true)
      }
    })

    socket.current.on('groupMemberRequestConfirmRes',data => {
      if(data.userId === user.clientId)
          setIsChange(true)
      })
  // eslint-disable-next-line
  },[])

  useEffect(() => {
    if(groupId !== null){
      const formData = new FormData()
      formData.append('clientId',user.clientId)
      formData.append('groupId',groupId)
      axios.post('http://127.0.0.1:5000/group-member/delete',{
        'clientId': user.clientId,
        'groupId': groupId
      })
        .then(res => {
          socket.current.emit('outGroup',{
            'userId': user.clientId,
            'groupId': groupId
          })
          setGroupId(null)
          // setIsChange(true)
        })
        .catch(err => {
          setGroupId(null)
        })
    }
   // eslint-disable-next-line
  },[groupId])

  return (
    <div className='groupcomponent'>
    {
      groups.map(item => (
        <div className='groupcomponentbox' key={item.groupId}>
          <div className='groupcomponentItem'>
            <Link to={`/group/${item.groupId}`} className='groupItemImg'>
              <img src={`http://127.0.0.1:5000/img/${item.backgroundImg}`} alt='ptc'/>
            </Link>
            <Link to={`/group/${item.groupId}`} className='groupItemName'>{item.name}</Link>
            <div className='groupItemBtn'>
              <button onClick={() => setGroupId(item.groupId)}>Rời nhóm</button>
            </div>
          </div>
        </div>
      ))
    }
      
      
    </div>
  )
}

export default GroupsComponent