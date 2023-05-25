import {useState,useEffect,useContext,useRef} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './statusconfirm.scss'
import { PageContext } from '../../context/PageContext'

function StatusConfirm({setChangePostConfirm,group,admin,item}){
    const {
        user,
        socket
    } = useContext(PageContext)
    const [isOpen,setIsOpen] = useState(false)
    const [clickValue,setClickValue] = useState('')
    const [isOpenModal,setIsOpenModal] = useState(false)
    const [nameImg,setNameImg] = useState('')
    const statusRef = useRef()
    const sttInputRef = useRef()
    const time = item.postCreatedAt ? new Date(item.postCreatedAt) : new Date()
  
    useEffect(() => {
        if(clickValue === 'delete')
            axios.delete(`http://127.0.0.1:5000/post-confirm/${item.postConfirmId}`)
                .then(res => {
                    setClickValue('')
                    setChangePostConfirm(true)
                })
                .catch(err => {
                    setClickValue('')
                })
        else if(clickValue === 'edit'){
            if(statusRef.current.files[0]){
                const formData = new FormData()
                formData.append('postConfirmId',item.postConfirmId)
                formData.append('content',sttInputRef.current.value)
                formData.append('image', statusRef.current.files[0], statusRef.current.files[0].name)
                axios.post('http://127.0.0.1:5000/post-confirm-update',formData,{headers: {'Content-Type': 'multipart/form-data' }})
                    .then(res => {
                        setClickValue('')
                        setChangePostConfirm(true)
  
                    })
                    .catch(err => {
                        setClickValue('')
                    })
            }
            else{
                axios.post('http://127.0.0.1:5000/post-confirm-update-no-img',{
                    'postConfirmId': item.postConfirmId,
                    'content': sttInputRef.current.value,
                })
                    .then(res => {
                        setClickValue('')
                        setChangePostConfirm(true)
                    })
            }
            
        }

        else if(clickValue === 'confirm')
            axios.post(`http://127.0.0.1:5000/post-confirmed/${item.postConfirmId}`)
                .then(res => {
                    socket.current.emit('postGroup',{
                        user,
                        'groupId': group.groupId
                    })
                    setClickValue('')
                    setChangePostConfirm(true)
                })
                .catch(err => {
                    setClickValue('')
                })
    // eslint-disable-next-line
    },[clickValue])
  
    const urlToObject= async()=> {
        const response = await fetch(`http://127.0.0.1:5000/img/${item.postConfirmImg}`);
        const blob = await response.blob();
        let list = new DataTransfer();
        let file = new File([blob], item.postConfirmImg, {type: blob.type})
        list.items.add(file);
        let myFileList = list.files;
        statusRef.current.files = myFileList
        setNameImg(item.postConfirmImg)
    }
  
    const handleClickEditBtn = () => {
        setIsOpenModal(true)
        if(item.postConfirmImg !== '' && item.postConfirmImg !== null)
            urlToObject()
        setIsOpen(false)
    }
  
    const handleEditStatus = () => {
        setIsOpenModal(false)
        setClickValue('edit')
    }

    return (
        <>
            <div className='StatusGroupConfirm'>
                <div className='StatusGroupConfirmHeader'>
                    <div style={{display: 'flex'}}> 
                        <div className='StatusGroupConfirmImg'>
                            <div className='StatusGroupConfirmImgItem'>
                                <img className='StatusGroupConfirmImgItemStyle' src={`http://127.0.0.1:5000/img/${group.backgroundImg}`} alt='' />
                            </div>
                            <div className='StatusImg btnCircle marginRight8'>
                                <img style={{borderRadius: '50%',width: '100%',height: '100%'}} src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='' />
                            </div>
                        </div>
                        <div className='StatusGroupConfirmHeaderInfo'>
                            <Link to={`/group/${group.groupId}`}>{group.name}</Link>
                            <div className='StatusGroupConfirmHeaderInfoUser'>
                                {
                                    item.clientId === user.clientId ? (
                                        <Link to={`/myAccount`} className='StatusGroupConfirmHeaderInfoAuthor'>{item.nameClient}</Link>

                                    ) : (
                                        <Link to={`/client/${item.clientId}`} className='StatusGroupConfirmHeaderInfoAuthor'>{item.nameClient}</Link>
                                    )
                                }
                                <span className='StatusGroupConfirmHeaderInfoTime'>{`${time.getHours()}:${time.getMinutes()} ${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`}</span>
                            </div>
                        </div>
                    </div>

                    {
                        (item.clientId === user.clientId || admin.clientId === user.clientId) && (
                            <div className='StatusGroupConfirmHeaderBtn' style={{display: 'flex',alignItems: 'center',justifyContent:'center',float: 'right'}}>
                                <div onClick={() => setIsOpen(!isOpen)} className='StatusGroupConfirmHeaderBtnAnimation' style={{padding: '8px',display: 'flex'}}>
                                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" ><g fillRule="evenodd" transform="translate(-446 -350)"><path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></g></svg>
                                </div>

                                {
                                    isOpen && (
                                        <div className='dropBox'>
                                            <button onClick={() => handleClickEditBtn()}>Chỉnh sửa bài viết</button>
                                        </div>
                                    )
                                }
                                
                            </div>
                        )
                    }
                </div>
                {
                    item.content !== '' && item.content !== null && (
                        <div className='StatusGroupConfirmContent'>
                            <span>{item.content}</span>
                        </div>
                    )
                }
                
                {
                    item.postConfirmImg !== '' && item.postConfirmImg !== null && (
                        <div className='StatusGroupConfirmImg'>
                            <img className='StatusGroupConfirmImgItem' src={`http://127.0.0.1:5000/img/${item.postConfirmImg}`} alt=''/>
                        </div>
                    )
                }
                
                <div style={{backgroundColor: '#4e4e4e',height: '1px',margin: '12px 0 4px'}}></div>
                <div className='StatusGroupConfirmIcon'>
                    <div className='StatusGroupConfirmIconItem' onClick={() => setClickValue('confirm')}>
                        <span className={`StatusGroupConfirmIconText`}>Xét duyệt</span>
                    </div>

                    <div className='StatusGroupConfirmIconItem Deleted' onClick={() => setClickValue('delete')}>
                        <span className='StatusGroupConfirmIconText'>Xóa</span>
                    </div>

                </div>
                <div style={{backgroundColor: '#4e4e4e',height: '1px',margin: '4px 0'}}></div>
            </div>


            <div className='modalEditStatusGroupConfirm' style={isOpenModal ? {display: 'flex'}:{display: 'none'}}>
                <div className='StatusGroupConfirmEditContentStt'>
                    <div className='StatusGroupConfirmEditStt'>
                        <h2 style={{textAlign: 'center',margin: '8px 0'}}>Chỉnh sửa bài viết</h2>
                        <div className='StatusGroupConfirmEditSttHeader'>
                            <div className='StatusGroupConfirmEditSttInput'>
                                <textarea style={{resize: 'none'}} rows={3} ref={sttInputRef} className='StatusGroupConfirmEditSttInputItem' placeholder='Viết bình luận...' defaultValue={item.content} />
                            </div>
                        </div>
                        <div className='StatusGroupConfirmEditSttImg'>
                            <label onClick={() => setNameImg('')} htmlFor={`nameStatusGroupConfirmChange${item.postId}`}>
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                                <span style={{marginLeft: '8px'}}>Ảnh</span>
                                <input ref={statusRef} type='file' onChange={e => setNameImg(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id={`nameStatusGroupConfirmChange${item.postId}`} name={`nameStatusGroupConfirmChange${item.postId}`}/>
                            </label>
                            <span className='nameImg'>{nameImg}</span>
                        </div>
                        <>
                            <button className='StatusGroupConfirmEditSttBtn' onClick={() => handleEditStatus()}>Lưu</button>
                            <button className='StatusGroupConfirmEditSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setIsOpenModal(false);sttInputRef.current.value = item.content;statusRef.current.files[0] = null}}>Hủy</button>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatusConfirm