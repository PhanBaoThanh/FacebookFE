import React,{ useState,useRef,useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Status from '../Status/Status'
import './user.scss'
import { PageContext } from '../../context/PageContext'

const BlogUser = ({friends,setIsClick,posts,setPosts}) => {
    const {
        user,
        socket
    } = useContext(PageContext)
    const [nameImg,setNameImg] = useState('')
    const [value,setValue] = useState('')
    const sttRef = useRef()
    const [onChange,setOnChange] = useState(false)
    const [onChangePost,setOnChangePost] = useState(false)
    const time = new Date(user.dayOfBirth)
    useEffect(() => {
        if(onChangePost === true)
            axios.get(`http://127.0.0.1:5000/get-all-post-of-client/${user.clientId}`)
                .then(res => {
                    setPosts(res.data)
                    setOnChangePost(false)
                })
                .catch(err => {
                    setOnChangePost(false)
                })
    // eslint-disable-next-line
    },[onChangePost])

    useEffect(() => {
        if(onChange === true){
            if(sttRef.current.files[0]){
                const formData = new FormData()
                formData.append('manhom',JSON.stringify(null))
                formData.append('manguoidung',user.clientId)
                formData.append('noidung',value)
                formData.append('image', sttRef.current.files[0], sttRef.current.files[0].name)
                axios.post('http://127.0.0.1:5000/post',formData, {headers: {'Content-Type': 'multipart/form-data' }})
                    .then(res => {
                        socket.current.emit('post',{
                            'userId': user.clientId
                        })
                        setValue('')
                        setNameImg('')
                        sttRef.current.value = null
                        setOnChangePost(true)
                        setOnChange(false)
                    }
                    )
                    .catch(err => {
                        setValue('')
                        sttRef.current.value = null
                        setOnChange(false)
                        setNameImg('')
                    })
            }
            else
                axios.post('http://127.0.0.1:5000/post-no-img',{
                    'manhom': null,
                    'manguoidung': user.clientId,
                    'noidung': value
                })
                    .then(res=> {
                        socket.current.emit('post',{
                            'userId': user.clientId
                        })
                        setValue('')
                        setNameImg('')
                        sttRef.current.value = null
                        setOnChangePost(true)
                        setOnChange(false)
                    })
                    .catch(err => {
                        setValue('')
                        setNameImg('')
                        sttRef.current.value = null
                        setOnChange(false)
                    })
        }
    // eslint-disable-next-line 
    },[onChange])

    const handleUpPost = () => {
        if((value !== '' && value !== null) || (sttRef.current.files[0] !== undefined && sttRef.current.files[0] !== null))
            setOnChange(true)
    }

    return (
        <>
            <div className='userContentOverview'>
                <div className='userContentOverviewInfo'>
                    <h3>Giới thiệu</h3>

                    <div className='userContentOverviewInfo'>
                        <p style={{padding: '4px 0'}}>Email: {user.email}</p>
                        <p style={{padding: '4px 0'}}>Giới tính: {user.sex === true ? 'Nam' : 'Nữ'}</p>
                        <p style={{padding: '4px 0'}}>Ngày sinh: {`${time.getDate()}-${time.getMonth()+1}-${time.getFullYear()}`}</p>
                        <p style={{padding: '4px 0'}}>Số điện thoại: {user.phoneNumber}</p>
                    </div>
                </div>

                <div className='userContentOverviewImage'>
                    <div className='userContentOverviewImageBtn'>
                        <h3 style={{marginBottom: 0}}>Ảnh</h3>
                        <button onClick={() => setIsClick('anh')}>Xem tất cả ảnh</button>
                    </div>

                    {
                        posts.length > 0 ? (
                            <div className='userContentOverviewImages'>
                                {
                                    posts.slice(0,9).map(item => {
                                        if(item.postImg !== '' && item.postImg !== null)
                                            return (
                                                <div key={item.postId} className='userContentOverviewImageItem'>
                                                    <div className='userContentOverviewImageItemBox'>
                                                        <img src={`http://127.0.0.1:5000/img/${item.postImg}`}  alt='ptc' />
                                                    </div>
                                                </div>
                                            )
                                    })
                                }
                            </div>
                        ) : (
                            <></>
                        )
                    }
                    
                </div>

                <div className='userContentOverviewFriend'>
                    <div className='userContentOverviewFriendBtn'>
                        <h3 style={{marginBottom: 0}}>Bạn bè</h3>
                        <button onClick={() => setIsClick('banbe')}>Xem tất cả bạn bè</button>
                    </div>
                    <p>{friends.length} bạn bè</p>

                    <div className='userContentFriends'>
                        {
                            friends.slice(0,9).map(item => (
                                <div className='userContentFriend' key={item.clientId}>
                                    <div className='userContentFriendItem'>
                                        <Link to={`/client/${item.clientId}`} className='userContentFriendItemBox'>
                                            <img  src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='img' className='userContentFriendImg' />
                                        </Link>
                                        <Link to={`/client/${item.clientId}`}>{item.name}</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
            <div className='userContentStt'>
                <div className='UserStt'>
                    <h2 style={{textAlign: 'center',margin: '8px 0'}}>Tạo bài viết</h2>
                    <div className='UserSttHeader'>
                        <div className='btnCircle marginRight8'>
                            <img style={{borderRadius: '50%',width: '100%',height: '100%'}} src={`http://127.0.0.1:5000/img/${user.avatar}`} alt='' />
                        </div>
                    <div className='userSttInput'>
                        <input className='userSttInputItem' placeholder='Viết bình luận...' value={value} onChange={e => setValue(e.target.value)} />
                    </div>
                </div>
                <div className='UserSttImg'>
                    <label onClick={() => setNameImg('')} htmlFor='imgStt'>
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                        <span style={{marginLeft: '8px'}}>Ảnh</span>
                        <input ref={sttRef} type='file' onChange={e => setNameImg(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id='imgStt' name='imgStt'  />
                    </label>
                    <span className='nameImg'>{nameImg}</span>
                </div>
                <div onClick={() => handleUpPost()} className='UserSttBtn'>Đăng</div>
            </div>
            {
                posts.map(item => (
                    <Status changePost={setOnChangePost} item={item} key={item.postId}/>
                ))
            }
            </div>
        </>
    )
}

export default BlogUser