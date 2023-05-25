import React,{useState,useEffect,useRef, useContext} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './status.scss'
import { PageContext } from '../../context/PageContext'

const Comment = ({comment,postId}) => {
    const {
        user,
        socket
    } = useContext(PageContext)
    const [onChange,setOnChange] = useState(false)
    const [isOpen,setIsOpen] = useState(false)
    const [isEdit,setIsEdit] = useState(false)
    const time = new Date(comment.commentCreatedAt)
    const valueRef = useRef()

    useEffect(() => {
        if(onChange==='delete')
            axios.delete(`http://127.0.0.1:5000/comment/${comment.commentId}`)
                .then(res => {
                    socket.current.emit('comment',{
                        user,
                        postId
                    })
                    setOnChange(false)
                })
                .catch(err => {
                    setOnChange(false)
                })
        else if(onChange === 'edit')
            axios.post('http://127.0.0.1:5000/comment-update',{
                'mabinhluan': comment.commentId,
                'noidung': valueRef.current.value
            })
                .then(res => {
                    socket.current.emit('comment',{
                        user,
                        postId
                    })
                    setOnChange(false)
                    setIsEdit(false)
                })
                .catch(err => {
                    setOnChange(false)
                    setIsEdit(false)
                })
    // eslint-disable-next-line
    },[onChange])

    const handleClickEditBtn = () => {
        setIsEdit(true)
        setIsOpen(false)
    }

    const handleClickDeleteBtn = () => {
        setOnChange('delete')
        setIsOpen(false)
    }

    const changeComment = e => {
        if(e.keyCode === 27)
            setIsEdit(false)
        else if(e.keyCode === 13)
            setOnChange('edit')
    }

    return (
        <div className='statusCommentItem'>
            <div className='btnCircle marginRight8'>
                <img style={{borderRadius: '50%',width: '100%',height: '100%'}} src={`http://127.0.0.1:5000/img/${comment.avatar}`} alt='' />
            </div>
            <div className='statusCommentText'>
                {
                    comment.clientId === user.clientId ? (
                        <Link to={`/myAccount`} className='userLink'>{comment.nameClient}</Link>
                    ) : (
                        <Link to={`/client/${comment.clientId}`} className='userLink'>{comment.nameClient}</Link>
                    )
                }
                <span className='statusCommentTextTime' style={{fontSize: '11px',padding: '4px 0',userSelect: 'none',cursor: 'default',color: '#a3a3a3'}}>{`${time.getHours()}:${time.getMinutes()} ${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`}</span>
                {
                    isEdit ? (
                        <>
                            <textarea onKeyDown={e => changeComment(e)} rows={3} ref={valueRef} spellCheck={false} className='commentTextarea' defaultValue={comment.content} />
                            <p className='commentNote'>Nhấn Esc để hủy, Enter để lưu</p>
                        </>
                    ) : (
                        <p>{comment.content}</p>
                    )
                }
                {
                    comment.clientId === user.clientId && (
                        <div className='statusCommentBtn'>
                            <div onClick={() => setIsOpen(!isOpen)} className='statusCommentBtnStyle'>
                                <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" ><g fillRule="evenodd" transform="translate(-446 -350)"><path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></g></svg>
                            </div>
                            

                            {
                                isOpen && (
                                    <div className='dropBoxComment'>
                                        <button onClick={() => handleClickEditBtn()}>Chỉnh sửa bình luận</button>
                                        <button onClick={() => handleClickDeleteBtn()}>Xóa bình luận</button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            
            
            
        </div>
    )
}

export default Comment