import React, { useContext } from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './search.scss'
import { PageContext } from '../../context/PageContext'

//joined
//send request
//not-join
const SearchItem = ({item,setGroups,setGroupMembers,setGroupRequests,groupMembers,groupRequests}) => {
    const {
        user,
        searchValue,
        socket
    } = useContext(PageContext)
    const [status,setStatus] = useState('not-join')
    const [onClick,setOnClick] = useState(false)
    const [isJoined,setIsJoined] = useState(false)

    useEffect(() => {
        if(groupMembers.find(i => i.groupId === item.groupId)){
            if(groupMembers.find(i => i.clientId === user.clientId && i.groupId === item.groupId && i.isAdmin === true)){
                setStatus('admin')
            }
            else{
                setStatus('joined')
            }
        }
        else{
            if(groupRequests.find(i => i.groupId === item.groupId)){
                setStatus('send-request')
            }
            else{
                setStatus('not-join')
            }
        }
    // eslint-disable-next-line
    },[groupMembers,groupRequests])

    useEffect(() => {
        socket.current.on('groupMemberRequestRes',data => {
            if(item.groupId === data.groupId)
                axios(`http://127.0.0.1:5000/get-all-group-request-by-client-id/${user.clientId}`)
                    .then(res => {
                        setGroupRequests(res.data)
                    })
        })

        socket.current.on('groupMemberRequestConfirmRes',data => {
            if(item.groupId === data.groupId){
                axios(`http://127.0.0.1:5000/get-all-group-request-by-client-id/${user.clientId}`)
                    .then(res => {
                            setGroupRequests(res.data)
                    })
    
                axios(`http://127.0.0.1:5000/group-member-get-all-by-client-id/${user.clientId}`)
                    .then(res => {
                        setGroupMembers(res.data)
                    })
            }
        })

        socket.current.on('deleteGroupResponse',data => {
            if(item.groupId === data.groupId)
                axios.post('http://127.0.0.1:5000/group-search',{
                    'key': searchValue
                })
                    .then(res => {
                        setGroups(res.data)
                    })

        })

        socket.current.on('outGroupResponse', data => {
            if(item.groupId === data.groupId) 
                axios(`http://127.0.0.1:5000/group-member-get-all-by-client-id/${user.clientId}`)
                    .then(res => {
                        setGroupMembers(res.data)
                    })
        })

    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(onClick){
            if(status === 'joined')
                axios.post('http://127.0.0.1:5000/group-member/delete',{
                    'clientId': user.clientId,
                    'groupId': item.groupId
                })
                    .then(res=> {
                        socket.current.emit('outGroup',{
                            'userId': user.clientId,
                            'groupId': item.groupId
                        })
                        
                    })
            else if(status === 'send-request')
                axios.post('http://127.0.0.1:5000/group-request-delete',{
                    'clientId': user.clientId,
                    'groupId': item.groupId
                })
                    .then(res => {
                        socket.current.emit('groupMemberRequest',{
                            'userId': user.clientId,
                            'groupId': item.groupId
                        })
                        
                    })
            else
                axios.post('http://127.0.0.1:5000/group-request',{
                    'manguoidung': user.clientId,
                    'manhom': item.groupId
                })
                    .then(res=>{
                        socket.current.emit('groupMemberRequest',{
                            'userId': user.clientId,
                            'groupId': item.groupId
                        })
                        
                    })
            setOnClick(false)
        }
    // eslint-disable-next-line
    },[onClick])



    const handleJoinGroup = () => {
        setOnClick(true)
        setIsJoined(!isJoined)
    }

    return (
        <div className='searchContentItemGroup'>
            <div className='searchContentItemGroupBox'>
                <Link to={`/group/${item.groupId}`} className='searchImg'>
                    <img src={`http://127.0.0.1:5000/img/${item.backgroundImg}`} alt='ptc' className='searchImgItem' />
                </Link>
                <Link to={`/group/${item.groupId}`} className='searchAuthor'>{item.name}</Link>
            </div>
            <div className='searchContentItemGroupBox'>
                {
                    status === 'admin' ? (
                        <Link className='adminButtonSearch' to={`/group/${item.groupId}`}>
                            Admin
                        </Link>
                    ) : status === 'joined' ? (
                        <button className='cancel' onClick={() => handleJoinGroup()}>Rời nhóm</button>
                    ) : status === 'send-request' ? (
                        <button className='cancel' onClick={() => handleJoinGroup()}>Hủy yêu cầu</button>
                    ) : (
                        <button onClick={() => handleJoinGroup()}>Tham gia</button>
                    )
                }
            </div>
        </div>
    )
}

export default SearchItem