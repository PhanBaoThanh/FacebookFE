import {useState,useEffect, useContext} from 'react'
import axios from 'axios'
import BlogClient from './BlogClient'
import './client.scss'
import FriendClient from './FriendClient'
import ImageClient from './ImageClient'
import { useParams } from 'react-router-dom'
import { PageContext } from '../../context/PageContext'

function Client(){
    const {
        user,
        socket
    } = useContext(PageContext)
    const pagrams = useParams('clientId')
    const [friends,setFriends] = useState([])
    const [client,setClient] = useState({})
    const [posts,setPosts] = useState([])
    const [clickValue,setClickValue] = useState(null)
    const [change,setChange] = useState(false)
    const [requestValue,setRequestValue] = useState(null)

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/find-client/${pagrams.clientId}`)
            .then(res => {
                setClient(res.data)
            })

        axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${pagrams.clientId}`)
            .then(res => {
                setFriends(res.data)
            })

        axios.get(`http://127.0.0.1:5000/get-all-post-of-client/${pagrams.clientId}`)
            .then(res => {
                setPosts(res.data)
            })
        axios.post('http://127.0.0.1:5000/friend-request-find-by-sender-id-and-receiver-id',{
            'senderId': user.clientId,
            'receiverId': pagrams.clientId
        })
            .then(res => {
                if(res.data.senderId === user.clientId)
                    setRequestValue('sendRequest')
                else
                    setRequestValue('receiveRequest')
            })
            .catch(err => {
                setRequestValue(null)
            })
    // eslint-disable-next-line
    },[])


    useEffect(() => {

        socket.current.on('clientInfoResponse',data => {
            console.log(data.userId === +pagrams.clientId)
            console.log(data.userId,+pagrams.clientId)
            if(data.userId === +pagrams.clientId)
                axios.get(`http://127.0.0.1:5000/find-client/${pagrams.clientId}`)
                    .then(res => {
                        setClient(res.data)
                    })
        })

        socket.current.on('friendRequestRes',data => {
            if((data.client1 === +pagrams.clientId && data.client2 === user.clientId) || (data.client1 === user.clientId && data.client2 === +pagrams.clientId)){
                axios.post('http://127.0.0.1:5000/friend-request-find-by-sender-id-and-receiver-id',{
                    'senderId': user.clientId,
                    'receiverId': pagrams.clientId
                })
                    .then(res => {
                        if(res.data.senderId === user.clientId)
                            setRequestValue('sendRequest')
                        else
                            setRequestValue('receiveRequest')
                    })
                    .catch(err => {
                        setRequestValue(null)
                    })
            }
        })

        socket.current.on('friendRequestConfirmRes',data => {
            if(data.client1 === +pagrams.clientId || data.client2 === +pagrams.clientId){
                axios.post('http://127.0.0.1:5000/friend-request-find-by-sender-id-and-receiver-id',{
                    'senderId': user.clientId,
                    'receiverId': pagrams.clientId
                })
                    .then(res => {
                        if(res.data.senderId === user.clientId)
                            setRequestValue('sendRequest')
                        else
                            setRequestValue('receiveRequest')
                    })
                    .catch(err => {
                        setRequestValue(null)
                    })

                axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${+pagrams.clientId}`)
                    .then(res => {
                        setFriends(res.data)
                    })
            }
        })

        socket.current.on('deleteFriendResponse',data => {
            if(data.client1 === +pagrams.clientId || data.client2 === +pagrams.clientId)
                axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${+pagrams.clientId}`)
                    .then(res => {
                        setFriends(res.data)
                    })
        })
    // eslint-disable-next-line
    },[])


    useEffect(() => {
        if(change === 'friend')
            axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${pagrams.clientId}`)
                .then(res => {
                    setFriends(res.data)
                    setChange(null)
                })
        else if(change === 'request')
            axios.post('http://127.0.0.1:5000/friend-request-find-by-sender-id-and-receiver-id',{
                'senderId': user.clientId,
                'receiverId': pagrams.clientId
            })
                .then(res => {
                    if(res.data.senderId === user.clientId)
                        setRequestValue('sendRequest')
                    else
                        setRequestValue('receiveRequest')
                    setChange(null)
                })
                .catch(err => {
                    setRequestValue(null)
                    setChange(null)
                })

        else if(change === 'all'){
            axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${pagrams.clientId}`)
                .then(res => {
                    setFriends(res.data)
                })
            axios.post('http://127.0.0.1:5000/friend-request-find-by-sender-id-and-receiver-id',{
                'senderId': user.clientId,
                'receiverId': pagrams.clientId
            })
                .then(res => {
                    if(res.data.senderId === user.clientId)
                        setRequestValue('sendRequest')
                    else
                        setRequestValue('receiveRequest')
                    setChange(null)
                })
                .catch(err => {
                    setRequestValue(null)
                    setChange(null)
                })
            setChange(null)
        }
    // eslint-disable-next-line
    },[change])

    useEffect(() => {
        if(clickValue === 'addFriend')
            axios.post('http://127.0.0.1:5000/friend-request',{
                'nguoinhan': pagrams.clientId,
                'nguoigui': user.clientId
            })
                .then(res => {
                    socket.current.emit('friendRequest',{
                        'client1': +pagrams.clientId,
                        'client2': user.clientId
                    })
                    setClickValue(null)
                })
        else if(clickValue === 'deleteFriend')
            axios.post('http://127.0.0.1:5000/friend-delete',{
                'client1': user.clientId,
                'client2': pagrams.clientId
            })
                .then(res => {
                    socket.current.emit('deleteFriend',{
                        'client1': +pagrams.clientId,
                        'client2': user.clientId
                    })
                    setClickValue(null)
                })
        else if(clickValue === 'deleteFriendRequest')
            axios.post('http://127.0.0.1:5000/friend-request-delete',{
                'senderId': user.clientId,
                'receiverId': pagrams.clientId
            })
                .then(res => {
                    socket.current.emit('friendRequest',{
                        'client1': +pagrams.clientId,
                        'client2': user.clientId
                    })
                    setClickValue(null)
                })
        else if(clickValue === 'deleteFriendResponse')
            axios.post('http://127.0.0.1:5000/friend-request-delete',{
                'senderId': pagrams.clientId,
                'receiverId': user.clientId
            })
                .then(res => {
                    socket.current.emit('friendRequest',{
                        'client1': +pagrams.clientId,
                        'client2': user.clientId
                    })
                    setClickValue(null)
                })

        else if(clickValue === 'confirmFriendRequest')
            axios.post('http://127.0.0.1:5000/friend-request-confirm',{
                'senderId': pagrams.clientId,
                'receiverId': user.clientId
            })
                .then(res => {
                    socket.current.emit('friendRequestConfirm',{
                        'client1': +pagrams.clientId,
                        'client2': user.clientId
                    })
                    setClickValue(null)
                })
    // eslint-disable-next-line
    },[clickValue])

    const [isClick,setIsClick] = useState('baiviet')
    return (
        <div className='client'>
            <div className='clientHeader'>
                <div className='clientHeaderItem'>
                    <div className='clientHeaderImg'>
                        <img src={`http://127.0.0.1:5000/img/${client.backgroundImg}`} alt='ptc' className='clientHeaderImgItem' />
                    </div>

                    <div className='clientHeaderInfo'>
                        <div className='clientHeaderInfoBox'>
                            <div className='clientHeaderInfoAvt'>
                                <img src={`http://127.0.0.1:5000/img/${client.avatar}`} alt='avt' className='clientHeaderInfoAvtItem' />
                            </div>
                            <div className='clientHeaderInfoText'>
                                <div style={{display: 'flex',justifyContent: 'space-between'}}>
                                    <div>
                                        <h3>{client.name}</h3>
                                        <span>{friends.length} bạn bè</span>
                                    </div>
                                    <div style={{display: 'flex',alignItems:'center'}}>
                                        {
                                            friends.some(item => item.clientId === user.clientId) ? (
                                                <button className='ClientDeleteFriendBtn' onClick={() => setClickValue('deleteFriend')}>
                                                    <span>Xóa bạn</span>
                                                </button>
                                            ) : requestValue === 'sendRequest' ? (
                                                <button className='ClientDeleteFriendBtn' onClick={() => setClickValue('deleteFriendRequest')}>
                                                    <span>Hủy yêu cầu</span>
                                                </button>
                                            ) : requestValue === 'receiveRequest' ? (
                                                <>
                                                    <button className='ClientAddFriendBtn' onClick={() => setClickValue('confirmFriendRequest')}>
                                                        <span>Xác nhận</span>
                                                    </button>
                                                    <button className='ClientDeleteFriendBtn' onClick={() => setClickValue('deleteFriendResponse')}>
                                                        <span>Xóa</span>
                                                    </button>
                                                </>

                                            ) : (
                                                <button className='ClientAddFriendBtn' onClick={() => setClickValue('addFriend')}>
                                                    <span>Thêm bạn</span>
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='clientHeaderLine'></div>

                    <div className='clientHeaderNav'>
                        <div className='clientHeaderNavItems'>
                            <div className={`clientHeaderNavItem ${isClick === 'baiviet' ? 'isClick' : ''}`} onClick={() => setIsClick('baiviet')}>Bài viết</div>
                            <div className={`clientHeaderNavItem ${isClick === 'banbe' ? 'isClick' : ''}`} onClick={() => setIsClick('banbe')}>Bạn bè</div>
                            <div className={`clientHeaderNavItem ${isClick === 'anh' ? 'isClick' : ''}`} onClick={() => setIsClick('anh')}>Ảnh</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='clientContent'>
                {
                    isClick === 'baiviet' ? <BlogClient userId={+pagrams.clientId} setPosts={setPosts} setIsClick={setIsClick} friends={friends} posts={posts} client={client} /> : 
                    isClick === 'banbe' ? <FriendClient userId={+pagrams.clientId} setFriends={setFriends} friends={friends} /> : <ImageClient posts={posts} />
                }
                
            </div>
        </div>
    )
}

export default Client