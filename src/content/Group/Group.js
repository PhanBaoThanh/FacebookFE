import {useState,useEffect, useContext,useRef} from 'react'
import { useParams,useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './group.scss'
import { PageContext } from '../../context/PageContext';
import GroupPostRequest from './GroupPostRequest';
import BlogGroup from './BlogGroup';
import GroupMember from './GroupMember';
import ImageGroup from './ImageGroup';
import IsPrivateGroup from './IsPrivateGroup';

function Group(){
    const {
        user,
        socket
    } = useContext(PageContext)
    const navigate = useNavigate()
    const groupParam = useParams('groupId')
    const [isClick,setIsClick] = useState('baiviet')
    const [group,setGroup] = useState({})
    const [posts,setPosts] = useState([])
    const [members,setMembers] = useState([])
    const [openModal,setOpenModal] = useState('')
    const [nameImg,setNameImg] = useState('')
    const statusRef = useRef()
    const [name,setName] = useState('')
    const [isPrivate,setIsPrivate] = useState(false)
    const [editGroup,setEditGroup] = useState(false)
    const [groupRequest,setGroupRequest] = useState(null)
    const [change,setChange] = useState('')
    const [admin,setAdmin] = useState({})
    const [adminId,setAdminId] = useState(null)

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/group-find/${groupParam.groupId}`)
            .then(res => {
                setGroup(res.data)
            })
        
        axios.get(`http://127.0.0.1:5000/get-all-member-from-group-member/${groupParam.groupId}`)
            .then(res => {
                setMembers(res.data)
                setAdmin(res.data.find(item => item.isAdmin))
            })

        axios.post('http://127.0.0.1:5000/find-group-request-by-client-id',{
            'clientId': user.clientId,
            'groupId': groupParam.groupId
        })
            .then(res => {
                setGroupRequest(res.data)
            })
            .catch(res => {
                setGroupRequest(null)
            })

        axios.get(`http://127.0.0.1:5000/get-all-post-of-group/${groupParam.groupId}`)
            .then(res => {
                setPosts(res.data)
            })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        socket.current.on('groupInfoResponse',data => {
            if(data.groupId === +groupParam.groupId)
                setChange('groupInfo')
        })

        socket.current.on('postGroupResponse',data=>{
            if(data.groupId === +groupParam.groupId)
                setChange('post')
        })  

        socket.current.on('groupMemberRequestRes',data => {
            if(data.groupId === +groupParam.groupId && data.userId === user.clientId){
                setChange('groupRequest')
            }
        })

        socket.current.on('groupMemberRequestConfirmRes',data => {
            if(data.groupId === +groupParam.groupId && data.userId === user.clientId)
                setChange('all')
            else if(data.groupId === +groupParam.groupId && data.userId !== user.clientId)
                setChange('groupMember')
        })

        socket.current.on('deleteGroupResponse',data => {
            if(data.groupId === +groupParam.groupId)
                navigate('/')
        })

        socket.current.on('outGroupResponse', data => {
            if(data.groupId === +groupParam.groupId && data.userId === user.clientId)
                setChange('all')
            else if(data.groupId === +groupParam.groupId && data.userId !== user.clientId)
                setChange('postAndMember')
        })

    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(change === 'groupInfo')
            axios.get(`http://127.0.0.1:5000/group-find/${groupParam.groupId}`)
                .then(res => {
                    setGroup(res.data)
                    setChange('')
                })

        else if(change === 'groupRequest') 
            axios.post('http://127.0.0.1:5000/find-group-request-by-client-id',{
                'clientId': user.clientId,
                'groupId': groupParam.groupId
            })
                .then(res => {
                    setGroupRequest(res.data)
                    setChange('')
                })
                .catch(err => {
                    setGroupRequest(null)
                    setChange('')
                })
        else if(change === 'groupMember')
            axios.get(`http://127.0.0.1:5000/get-all-member-from-group-member/${groupParam.groupId}`)
                .then(res => {
                    setChange('')
                    setMembers(res.data)
                    setAdmin(res.data.find(item => item.isAdmin))
                })

        else if(change === 'post')
            axios.get(`http://127.0.0.1:5000/get-all-post-of-group/${groupParam.groupId}`)
                .then(res => {
                    setPosts(res.data)
                    setChange('')
                }) 
        
        else if(change === 'postAndMember'){
            axios.get(`http://127.0.0.1:5000/get-all-post-of-group/${groupParam.groupId}`)
                .then(res => {
                    setPosts(res.data)
                })

            axios.get(`http://127.0.0.1:5000/get-all-member-from-group-member/${groupParam.groupId}`)
                .then(res => {
                    setMembers(res.data)
                    setAdmin(res.data.find(item => item.isAdmin))
                })
            setChange('')
        }

        else if(change === 'all'){
            axios.get(`http://127.0.0.1:5000/get-all-post-of-group/${groupParam.groupId}`)
                .then(res => {
                    setPosts(res.data)
                })

            axios.post('http://127.0.0.1:5000/find-group-request-by-client-id',{
                'clientId': user.clientId,
                'groupId': groupParam.groupId
            })
                .then(res => {
                    setGroupRequest(res.data)
                })
                .catch(err => {
                    setGroupRequest(null)
                })

            axios.get(`http://127.0.0.1:5000/get-all-member-from-group-member/${groupParam.groupId}`)
                .then(res => {
                    setMembers(res.data)
                    setAdmin(res.data.find(item => item.isAdmin))
                })
            setChange('')
        }
                
    // eslint-disable-next-line
    },[change])

    useEffect(() => {
        if(editGroup === true){
            if(openModal === 'backgroundImg'){
                const formData = new FormData()
                formData.append('manhom',groupParam.groupId)
                formData.append('backgroundImg', statusRef.current.files[0], statusRef.current.files[0].name)
                axios.post('http://127.0.0.1:5000/group-update-backgroundImg',formData, {headers: {'Content-Type': 'multipart/form-data' }})
                    .then(res => {
                        setEditGroup(false)
                        setOpenModal('')
                        socket.current.emit('groupInfo',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        // setChange('groupInfo')
                    })
            }
            else if(openModal === 'info')
                axios.post('http://127.0.0.1:5000/group-update',{
                    'manhom': groupParam.groupId,
                    'tennhom': name,
                    'riengtu': isPrivate ? true : false
                })
                    .then(res => {
                        setEditGroup(false)
                        setOpenModal('')
                        socket.current.emit('groupInfo',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        // setChange('groupInfo')
                        resetValue()
                    })
            else if(openModal === 'deleteGroup')
                axios.delete(`http://127.0.0.1:5000/group/${groupParam.groupId}`)
                    .then(res => {
                        socket.current.emit('deleteGroup',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        navigate('/')
                    })
            else if(openModal === 'joinGroup')
                axios.post('http://127.0.0.1:5000/group-request',{
                    'manhom': groupParam.groupId,
                    'manguoidung': user.clientId
                })
                    .then(res => {
                        socket.current.emit('groupMemberRequest',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        setEditGroup(false)
                        setOpenModal('')
                    })
            
            else if(openModal === 'deleteGroupRequest')
                axios.post('http://127.0.0.1:5000/group-request-delete',{
                    'clientId': user.clientId,
                    'groupId': groupParam.groupId
                })
                    .then(res => {
                        socket.current.emit('groupMemberRequest',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        setEditGroup(false)
                        setOpenModal('')
                    })

            else if(openModal === 'outGroup')
                axios.post('http://127.0.0.1:5000/group-member/delete',{
                    'clientId': user.clientId,
                    'groupId': groupParam.groupId
                })
                    .then(res => {
                        socket.current.emit('outGroup',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        // setChange('all')
                        setEditGroup(false)
                        setOpenModal('')
                    })

            else if(openModal === 'chooseAdmin')
                axios.post('http://127.0.0.1:5000/group-member-delete-and-update-new-admin',{
                    'groupId': groupParam.groupId,
                    'clientId': user.clientId,
                    'adminId': adminId
                })
                    .then(res => {
                        socket.current.emit('outGroup',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        // setChange('all')
                        setEditGroup(false)
                        setOpenModal('')
                    })

            else if(openModal === 'delete')
                axios.delete(`http://127.0.0.1:5000/group/${groupParam.groupId}`)
                    .then(res => {
                        socket.current.emit('deleteGroup',{
                            'userId': user.clientId,
                            'groupId': +groupParam.groupId
                        })
                        navigate('/')
                    })
        }
    // eslint-disable-next-line
    },[editGroup])

    const resetValue = () => {
        setName('')
        setIsPrivate(false)
    }

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
        if(value === 'backgroundImg'){
            setOpenModal('backgroundImg')
            urlToObject(group.backgroundImg)
        }
        else if(value === 'info'){
            setName(group.name)
            setIsPrivate(group.isPrivate)
            setOpenModal('info')
        }
        else if(value === 'outGroup')
            if(members.length <= 1)
                setOpenModal('delete')
            else
                if(members.some(item => item.clientId === user.clientId && item.isAdmin))
                    setOpenModal('chooseAdmin')
                else
                    setOpenModal('outGroup')
        else
            setOpenModal(value)

    }

    const handleEdit = () => {
        if(openModal === 'chooseAdmin' && adminId === null)
            setEditGroup(false)
        else
            setEditGroup(true)
    }

    return (
    <>
        <div className='Group'>
            <div className='GroupHeader'>
                <div className='GroupHeaderItem'>
                    <div className='GroupHeaderImg'>
                        <img src={`http://127.0.0.1:5000/img/${group.backgroundImg}`} alt='ptc' className='GroupHeaderImgItem' />
                        {
                            members.some(item => item.clientId === user.clientId && item.isAdmin) && (
                                <button className='GroupHeaderImgBtn' onClick={() => handleOpenChangeModal('backgroundImg')}>
                                    <i className='GroupHeaderImgBtnIcon'></i>
                                    <span>Chỉnh sửa ảnh bìa</span>
                                </button>
                            )
                        }
                    </div>

                    <div className='GroupHeaderInfo'>
                        <div className='GroupHeaderInfoBox'>
                            <div className='GroupHeaderInfoText'>
                                <h3>{group.name}</h3>
                                <span>{members.length} thành viên</span>
                            </div>
                        </div>


                        <div className='GroupHeaderInfoBox' style={{display: 'flex'}}>
                            
                            {
                                groupRequest === null && !members.some(item => item.clientId === user.clientId) && (
                                    <button className='GroupHeaderJoinBtn'  onClick={() => {setOpenModal('joinGroup');setEditGroup(true)}}>
                                        <span>Tham gia</span>
                                    </button>
                                ) 
                            }
                            {
                                groupRequest !== null && groupRequest.clientId && (
                                    <button className='GroupHeaderInfoBtn'  onClick={() => {setOpenModal('deleteGroupRequest');setEditGroup(true)}}>
                                        <span>Hủy yêu cầu</span>
                                    </button>
                                )
                            }
                            
                            {
                                members.some(item => item.clientId === user.clientId) && (
                                    <button className='GroupHeaderInfoBtn'  onClick={() => handleOpenChangeModal('outGroup')}>
                                        <span>Rời nhóm</span>
                                    </button>
                                )
                            }
                            {
                                members.some(item => item.clientId === user.clientId && item.isAdmin) && (
                                    <>
                                        <button className='GroupHeaderInfoBtn'  onClick={() => handleOpenChangeModal('info')}>
                                            <div className='GroupHeaderInfoBtnIcon'>
                                                <img src='https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/tmaz0VO75BB.png' alt='icon'/>
                                            </div>
                                            <span>Chỉnh sửa thông tin nhóm</span>
                                        </button>
                                        <button className='GroupHeaderDeleteBtn'  onClick={() => handleOpenChangeModal('delete')}>
                                            <span>Xóa nhóm</span>
                                        </button>
                                    </>
                                )
                            }
                        </div>

                        


                    </div>

                    <div className='GroupHeaderLine'></div>
                    {
                        (group.isPrivate === false || members.some(item => item.clientId === user.clientId)) && (
                            <div className='GroupHeaderNav'>
                                <div className='GroupHeaderNavItems'>
                                    <div className={`GroupHeaderNavItem ${isClick === 'baiviet' ? 'isClick' : ''}`} onClick={() => setIsClick('baiviet')}>Bài viết</div>
                                    <div className={`GroupHeaderNavItem ${isClick === 'thanhvien' ? 'isClick' : ''}`} onClick={() => setIsClick('thanhvien')}>Thành viên</div>
                                    {
                                        members.some(item => item.clientId === user.clientId && item.isAdmin) && (
                                            <div className={`GroupHeaderNavItem ${isClick === 'xetduyet' ? 'isClick' : ''}`} onClick={() => setIsClick('xetduyet')}>Xét duyệt bài đăng</div>
                                        )
                                    }
                                    <div className={`GroupHeaderNavItem ${isClick === 'anh' ? 'isClick' : ''}`} onClick={() => setIsClick('anh')}>Ảnh</div>
                                    
                                </div>
                            </div>
                        )
                    }
                    
                </div>
            </div>

            {
                members.some(item => item.clientId === user.clientId) || group.isPrivate === false ? (
                    <div className='GroupContent'>
                        {
                            isClick === 'baiviet' ? <BlogGroup setIsClick={setIsClick} posts={posts} setPosts={setPosts} admin={admin} group={group} members={members} /> : 
                            isClick === 'thanhvien' ? <GroupMember setChange={setChange} isAdmin={members.some(item => item.clientId===user.clientId && item.isAdmin)} group={group} members={members} setMembers={setMembers} /> : 
                            isClick === 'xetduyet' ? <GroupPostRequest admin={admin} group={group} /> : <ImageGroup posts={posts} />
                        }
                        
                    </div>
                ) : (
                    <IsPrivateGroup />
                )
            }
            
        </div>

        <div className='modalEditStatus' style={openModal !== '' && openModal !== 'joinGroup' && openModal !== 'deleteGroupRequest' ? {display: 'flex'}:{display: 'none'}}>
            <div className='GroupEditContentStt'>
                <div className='GroupEditStt'>
                    <h2 style={{textAlign: 'center',margin: '8px 0'}}>
                    {
                        openModal === 'backgroundImg' ? 'Chỉnh sửa ảnh bìa' :  
                        openModal === 'info' ? 'Chỉnh sửa thông tin nhóm' : 
                        openModal === 'chooseAdmin' ? 'Chọn quản trị viên' : 'Xác nhận'
                    }
                    </h2>

                    {
                        openModal === 'backgroundImg' ? (
                            <>
                                <div className='GroupEditSttImg'>
                                    <label onClick={() => setNameImg('')} htmlFor='editGroup'>
                                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                                        <span style={{marginLeft: '8px'}}>Ảnh</span>
                                        <input ref={statusRef} type='file' onChange={e => setNameImg(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id='editGroup' name='editGroup'/>
                                    </label>
                                    <span className='nameImg'>{nameImg}</span>
                                </div>
                                <button className='GroupEditSttBtn' onClick={() => handleEdit()}>Lưu</button>
                                <button className='GroupEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('')}}>Hủy</button>
                            </>
                        ) : openModal === 'info' ? (
                            <>
                                <div style={{display: 'flex',flexDirection: 'column',padding: '12px 0'}}>
                                    <input spellCheck={false} className='Group__edit__box__input' type='text' placeholder='Tên nhóm' value={name} onChange={e => setName(e.target.value)}/>
                                    <select className='Group__edit__box__select' value={isPrivate} onChange={e => setIsPrivate(e.target.value === 'true'? true : false )}>
                                        <option value={false} style={{color: '#fff'}}>Công khai</option>
                                        <option value={true} style={{color: '#fff'}}>Riêng tư</option>
                                    </select>
                                </div>
                                <button className='GroupEditSttBtn' onClick={() => handleEdit()}>Lưu</button>
                                <button className='GroupEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('');resetValue()}}>Hủy</button>
                            </>
                        ) : openModal === 'chooseAdmin' ? (
                            <>
                                <div style={{display: 'flex',flexWrap: 'wrap',padding: '12px 0'}}>
                                {
                                    members.filter(item => item.clientId !== user.clientId).map(item => (
                                        <div className='memberContentItem' key={item.clientId}>
                                            <div className={`memberContentItemBox ${adminId === item.clientId ? 'active' : ''}`} onClick={() => setAdminId(item.clientId)}>
                                                <div className='memberContentItemHeader'>
                                                    <Link to={`/client/${item.clientId}`}><img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='avt' /></Link>
                                                    <Link to={`/client/${item.clientId}`}>{item.name}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                                <button className='GroupEditSttBtn' onClick={() => handleEdit()}>Xác nhận</button>
                                <button className='GroupEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('');resetValue()}}>Hủy</button>
                            </>
                        ) : openModal === 'outGroup' ? (
                            <>
                                <p style={{textAlign: 'center',padding: '20px 0'}}>Bạn có chắc muốn rời nhóm</p>
                                <button className='GroupEditSttBtn' style={{backgroundColor: 'rgb(199, 4, 4)'}} onClick={() => handleEdit()}>Rời nhóm</button>
                                <button className='GroupEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('')}}>Hủy</button>
                            </>
                        ) : (
                            <>
                                <p style={{textAlign: 'center',padding: '20px 0'}}>Bạn có chắc muốn xóa nhóm</p>
                                <button className='GroupEditSttBtn' style={{backgroundColor: 'rgb(199, 4, 4)'}} onClick={() => handleEdit()}>Xóa nhóm</button>
                                <button className='GroupEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal('')}}>Hủy</button>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    </>
    )
}

export default Group