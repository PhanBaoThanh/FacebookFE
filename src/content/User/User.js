import {useState,useEffect,useRef,useContext} from 'react'
import axios from 'axios'
import BlogUser from './BlogUser'
import FriendUser from './FriendUser'
import ImageUser from './ImageUser'
import './user.scss'
import { PageContext } from '../../context/PageContext'
function User(){
    const {
        user,
        setUser,
        friends,
        setFriends,
        socket
    } = useContext(PageContext)
    const [posts,setPosts] = useState([])
    const [isClick,setIsClick] = useState('baiviet')
    const [openModal,setOpenModal] = useState('')
    const [nameImg,setNameImg] = useState('')
    const [editUser,setEditUser] = useState(false)
    const oldPasswordRef = useRef()
    const newPasswordRef = useRef()
    const statusRef = useRef()
    const [name,setName] = useState('')
    const [sdt,setSdt] = useState('')
    const [email,setEmail] = useState('')
    const [birthDay,setBirthDay] = useState()
    const [sex,setSex] = useState('nam')
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
            .then(res => {
                setFriends(res.data)
            })

        axios.get(`http://127.0.0.1:5000/get-all-post-of-client/${user.clientId}`)
            .then(res => {
                setPosts(res.data)
            })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        socket.current.on('friendRequestConfirmRes',data => {
            if(data.client1 === user.clientId || data.client2 === user.clientId)
                axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                    .then(res => {
                        setFriends(res.data)
                    })
        })

        socket.current.on('deleteFriendResponse',data => {
            if(data.client1 === user.clientId || data.client2 === user.clientId)
                axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                    .then(res => {
                        setFriends(res.data)
                    })
        })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(editUser === true){
            if(openModal === 'avt'){
                const formData = new FormData()
                formData.append('clientId',user.clientId)
                formData.append('avt', statusRef.current.files[0], statusRef.current.files[0].name)
                axios.post('http://127.0.0.1:5000/client-avt',formData,{headers: {'Content-Type': 'multipart/form-data' }})
                    .then(res => {
                        socket.current.emit('clientInfo',{
                            'userId': user.clientId
                        })
                        let jsonData = JSON.parse(localStorage.getItem('user'))
                        localStorage.setItem('user',JSON.stringify({
                            ...jsonData,
                            avatar: statusRef.current.files[0].name
                        }))
                        setUser(JSON.parse(localStorage.getItem('user')))
                        setEditUser(false)
                        setOpenModal('')
                    })
                    .catch(err => {
                        setEditUser(false)
                        setOpenModal('')
                    })
            }
            else if(openModal === 'backgroundImg'){
                const formData = new FormData()
                formData.append('clientId',user.clientId)
                formData.append('backgroundImg', statusRef.current.files[0], statusRef.current.files[0].name)
                axios.post('http://127.0.0.1:5000/client-backgroundImg',formData,{headers: {'Content-Type': 'multipart/form-data' }})
                    .then(res => {
                        socket.current.emit('clientInfo',{
                            'userId': user.clientId
                        })
                        let jsonData = JSON.parse(localStorage.getItem('user'))
                        localStorage.setItem('user',JSON.stringify({
                            ...jsonData,
                            backgroundImg: statusRef.current.files[0].name
                        }))
                        setUser(JSON.parse(localStorage.getItem('user')))
                        setEditUser(false)
                        setOpenModal('')
                    })
                    .catch(err => {
                        setEditUser(false)
                        setOpenModal('')
                    })
            }
            else if(openModal === 'info'){
                console.log(birthDay)
                console.log(birthDay.includes('T') ? birthDay.slice(1,-1).split('T')[0] : birthDay)
                axios.post('http://127.0.0.1:5000/client-update',{
                    clientId: user.clientId,
                    hoten: name,
                    sdt: sdt,
                    email: email,
                    gioitinh: sex === 'nam' ? true : false,
                    ngaysinh: birthDay.includes('T') ? birthDay.slice(1,-1).split('T')[0] : birthDay
                })
                    .then(res => {
                        socket.current.emit('clientInfo',{
                            'userId': user.clientId
                        })
                        let jsonData = JSON.parse(localStorage.getItem('user'))
                        localStorage.setItem('user',JSON.stringify({
                            ...jsonData,
                            dayOfBirth: birthDay,
                            email: email,
                            name: name,
                            phoneNumber: sdt,
                            sex: sex === 'nam' ? true : false,
                        }))
                        setUser(JSON.parse(localStorage.getItem('user')))
                        setEditUser(false)
                        setOpenModal('')
                    })
                    .catch(err => {
                        setEditUser(false)
                        setOpenModal('')
                    })
            }
            else if(openModal === 'password')
                axios.post('http://127.0.0.1:5000/client-password',{
                    clientId: user.clientId,
                    matkhaucu: oldPasswordRef.current.value,
                    matkhaumoi: newPasswordRef.current.value
                })
                    .then(res => {
                        console.log('success')
                        setEditUser(false)
                        setOpenModal('')
                    })
                    .catch(err => {
                        console.log(err)
                        setEditUser(false)
                        setOpenModal('')
                    })
        }
    // eslint-disable-next-line
    },[editUser])

    const urlToObject= async(img)=> {
        const response = await fetch(`http://127.0.0.1:5000/img/${img}`);
        const blob = await response.blob();
        let list = new DataTransfer();
        let file = new File([blob], img, {type: blob.type})
        list.items.add(file);
        let myFileList = list.files;
        statusRef.current.files = myFileList
        setNameImg(img)
    }

    const handleOpenChangeModal = value => {
        if(value === 'avt')
            urlToObject(user.avatar)
        else if(value === 'backgroundImg')
            urlToObject(user.backgroundImg)
        else if(value === 'info'){
            setSex(user.sex ? 'nam' : 'nu')
            setName(user.name)
            setSdt(user.phoneNumber)
            setEmail(user.email)
            setBirthDay(user.dayOfBirth)
        }
        else if(value === 'password'){
            oldPasswordRef.current.value = ''
            newPasswordRef.current.value = ''
        }
        setOpenModal(value)
    }


    function ValidateEmail(mail) 
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
            return (true)
        return (false)
    }

    function containsOnlyNumber(str){
        return /^[0-9]+$/.test(str);
    }

    const resetValue = () => {
        setSex('nam')
        setName('')
        setSdt('')
        setEmail('')
        setBirthDay()
    }

    const handleEdit = () => {
        if((openModal === 'avt' || openModal === 'backgroundImg') && statusRef.current.files[0])
            setEditUser(true)
        else if(openModal === 'info'){
            if( name !== '' && 
                sdt !== ''  && containsOnlyNumber(sdt) &&
                email !== '' && ValidateEmail(email) &&
                birthDay !== null
            )
                setEditUser(true)
        }
        else if(openModal === 'password' && oldPasswordRef.current.value !== '' && newPasswordRef.current.value !== '')
            setEditUser(true)
    }

    return (
        <>
            <div className='user'>
                <div className='userHeader'>
                    <div className='userHeaderItem'>
                        <div className='userHeaderImg'>
                            <img src={`http://127.0.0.1:5000/img/${user.backgroundImg}`} alt='ptc' className='userHeaderImgItem' />
                            <button className='userHeaderImgBtn' onClick={() => handleOpenChangeModal('backgroundImg')}>
                                <i className='userHeaderImgBtnIcon'></i>
                                <span>Chỉnh sửa ảnh bìa</span>
                            </button>
                        </div>

                        <div className='userHeaderInfo'>
                            <div className='userHeaderInfoBox'>
                                <div className='userHeaderInfoAvt'>
                                    <img src={`http://127.0.0.1:5000/img/${user.avatar}`} alt='avt' className='userHeaderInfoAvtItem' />
                                    <button className='userHeaderInfoAvtBtn' onClick={() => handleOpenChangeModal('avt')}>
                                        <i className='userHeaderInfoAvtBtnIcon'></i>
                                    </button>
                                </div>
                                <div className='userHeaderInfoText'>
                                    <h3>{user.name}</h3>
                                    <span>{friends.length} bạn bè</span>
                                </div>
                            </div>


                            <div className='userHeaderInfoBox' style={{display: 'flex'}}>
                                <button className='userHeaderInfoBtn' style={{marginRight: '8px'}} onClick={() => handleOpenChangeModal('password')}>
                                    <span>Đổi mật khẩu</span>
                                </button>
                                <button className='userHeaderInfoBtn'  onClick={() => handleOpenChangeModal('info')}>
                                    <div className='userHeaderInfoBtnIcon'>
                                        <img src='https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/tmaz0VO75BB.png' alt='icon'/>
                                    </div>
                                    <span>Chỉnh sửa trang cá nhân</span>
                                </button>
                            </div>

                            


                        </div>

                        <div className='userHeaderLine'></div>

                        <div className='userHeaderNav'>
                            <div className='userHeaderNavItems'>
                                <div className={`userHeaderNavItem ${isClick === 'baiviet' ? 'isClick' : ''}`} onClick={() => setIsClick('baiviet')}>Bài viết</div>
                                <div className={`userHeaderNavItem ${isClick === 'banbe' ? 'isClick' : ''}`} onClick={() => setIsClick('banbe')}>Bạn bè</div>
                                <div className={`userHeaderNavItem ${isClick === 'anh' ? 'isClick' : ''}`} onClick={() => setIsClick('anh')}>Ảnh</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='userContent'>
                    {
                        isClick === 'baiviet' ? <BlogUser setIsClick={setIsClick} posts={posts} setPosts={setPosts} friends={friends} /> : 
                        isClick === 'banbe' ? <FriendUser friends={friends} setFriends={setFriends} /> : <ImageUser posts={posts} />
                    }
                    
                </div>
            </div>

            <div className='modalEditStatus' style={openModal !== '' ? {display: 'flex'}:{display: 'none'}}>
                <div className='UserEditContentStt'>
                    <div className='UserEditStt'>
                        <h2 style={{textAlign: 'center',margin: '8px 0'}}>
                        {
                            openModal === 'avt' ? 'Chỉnh sửa ảnh đại diện' :
                            openModal === 'backgroundImg' ? 'Chỉnh sửa ảnh bìa' : 
                            openModal === 'info' ? 'Chỉnh sửa thông tin cá nhân' : 'Đổi mật khẩu'
                        }
                        </h2>

                        {
                            openModal === 'avt' || openModal === 'backgroundImg' ? (
                                <>
                                    <div className='UserEditSttImg'>
                                        <label onClick={() => setNameImg('')} htmlFor='editUser'>
                                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                                            <span style={{marginLeft: '8px'}}>Ảnh</span>
                                            <input ref={statusRef} type='file' onChange={e => setNameImg(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id='editUser' name='editUser'/>
                                        </label>
                                        <span className='nameImg'>{nameImg}</span>
                                    </div>
                                    <button className='UserEditSttBtn' onClick={() => handleEdit()}>Lưu</button>
                                    <button className='UserEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('')}}>Hủy</button>
                                </>
                            ) : openModal === 'info' ? (
                                <>
                                    <div style={{display: 'flex',flexDirection: 'column',padding: '12px 0'}}>
                                        <input spellCheck={false} className='user__edit__box__input' type='text' placeholder='Họ tên' value={name} onChange={e => setName(e.target.value)}/>
                                        <input spellCheck={false} className='user__edit__box__input' type='text' placeholder='Số điện thoại' value={sdt} onChange={e => setSdt(e.target.value)}/>
                                        <input spellCheck={false} className='user__edit__box__input' type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                                        <div style={{display: 'flex',justifyContent:'space-between'}}>
                                            <input className='user__edit__box__input2' type='date' defaultValue={new Date(user.dayOfBirth).toISOString().substring(0,10)} placeholder='Ngày sinh' onChange={e => setBirthDay(e.target.value)}/>
                                            <select className='user__edit__box__select' value={sex} onChange={e => setSex(e.target.value)}>
                                                <option value='nam' style={{color: '#fff'}}>Nam</option>
                                                <option value='nu' style={{color: '#fff'}}>Nữ</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className='UserEditSttBtn' onClick={() => handleEdit()}>Lưu</button>
                                    <button className='UserEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('');resetValue()}}>Hủy</button>
                                </>
                            ) : (
                                <>
                                    <div style={{display: 'flex',flexDirection: 'column',padding: '12px 0'}}>
                                        <input spellCheck={false} ref={oldPasswordRef} className='user__edit__box__input' defaultValue='' type='password' placeholder='Mật khẩu cũ'/>
                                        <input spellCheck={false} ref={newPasswordRef} className='user__edit__box__input' defaultValue='' type='password' placeholder='Mật khẩu mới'/>
                                    </div>
                                    <button className='UserEditSttBtn' onClick={() => handleEdit()}>Lưu</button>
                                    <button className='UserEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('');oldPasswordRef.current.value='';newPasswordRef.current.value=''}}>Hủy</button>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default User