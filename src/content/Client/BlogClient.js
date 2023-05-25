import React,{useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { PageContext } from '../../context/PageContext'
import Status from '../Status/Status'
import axios from 'axios'
import './client.scss'

const BlogClient = ({userId,setPosts,setIsClick,posts,client,friends}) => {
    const {
        user,
        socket
    } = useContext(PageContext)
    const time = client.dayOfBirth ? new Date(client.dayOfBirth.slice(1,-1).split('T')[0]) : new Date()

    useEffect(() => {
        socket.current.on('postResponse',data => {
            if(data.userId === userId)
                axios.get(`http://127.0.0.1:5000/get-all-post-of-client/${userId}`)
                    .then(res => {
                        setPosts(res.data)
                    })
        })
    // eslint-disable-next-line
    },[])

    return (
        <>
            <div className='clientContentOverview'>
                <div className='clientContentOverviewInfo'>
                    <h3>Giới thiệu</h3>

                    <div className='clientContentOverviewInfo'>
                        <p style={{padding: '4px 0'}}>Email: {client.email}</p>
                        <p style={{padding: '4px 0'}}>Giới tính: {client.sex === true ? 'Nam' : 'Nữ'}</p>
                        <p style={{padding: '4px 0'}}>Ngày sinh: {`${time.getDate()}-${time.getMonth()+1}-${time.getFullYear()}`}</p>
                        <p style={{padding: '4px 0'}}>Số điện thoại: {client.phoneNumber}</p>
                    </div>
                </div>

                <div className='clientContentOverviewImage'>
                    <div className='clientContentOverviewImageBtn'>
                        <h3 style={{marginBottom: 0}}>Ảnh</h3>
                        <button onClick={() => setIsClick('anh')}>Xem tất cả ảnh</button>
                    </div>

                    <div className='clientContentOverviewImages'>
                    {
                        posts.slice(0, 9).map(item => {
                            if(item.postImg !== '' && item.postImg !== null)
                            return (
                            <div className='clientContentOverviewImageItem' key={item.postId}>
                                <div className='clientContentOverviewImageItemBox'>
                                <img src={`http://127.0.0.1:5000/img/${item.postImg}`} alt='ptc' />
                                </div>
                            </div>
                            )
                        })
                    }
                    </div>
                </div>

                <div className='clientContentOverviewFriend'>
                    <div className='clientContentOverviewFriendBtn'>
                        <h3 style={{marginBottom: 0}}>Bạn bè</h3>
                        <button onClick={() => setIsClick('banbe')}>Xem tất cả bạn bè</button>
                    </div>
                    <p>{friends.length} bạn bè</p>

                    <div className='clientContentFriends'>
                    {
                        friends.map(item => (
                            <div className='clientContentFriend' key={item.clientId}>
                                <div className='clientContentFriendItem'>
                                    <Link to={item.clientId === user.clientId ? '/myAccount' : `/client/${item.clientId}`} className='clientContentFriendItemBox'>
                                        <img  src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='img' className='clientContentFriendImg' />
                                    </Link>
                                    <Link to={item.clientId === user.clientId ? '/myAccount' : `/client/${item.clientId}`}>{item.name}</Link>
                                    
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>

            </div>

            
            
            <div className='clientContentStt'>
            {
                posts.map(item => (
                    <Status item={item} key={item.postId}/>
                ))
            }
            </div>
        </>
    )
}

export default BlogClient