import React,{useState,useRef,useEffect, useContext} from 'react'
import axios from 'axios'
import {PageContext} from '../../context/PageContext'
import './newgroup.scss'

const NewGroup = () => {
    const {
        user
    } = useContext(PageContext)
    const [name,setName] = useState('')
    const [isPrivate,setIsPrivate] = useState(false)
    const [nameImgLarge,setNameImgLarge] = useState('')
    const [onSubmit,setOnSubmit] = useState(false)
    const imgLargeRef = useRef()

    useEffect(() => {
        if(name !== null && name !== '' && onSubmit){
            const formData = new FormData()
            formData.append('maquantrivien',user.clientId)
            formData.append('tennhom',name)
            formData.append('riengtu',isPrivate ? true : false)
            formData.append('backgroundImage', imgLargeRef.current.files[0], imgLargeRef.current.files[0].name)
            axios.post('http://127.0.0.1:5000/group',formData, {headers: {'Content-Type': 'multipart/form-data' }})
                .then(res => {
                    setName('')
                    setIsPrivate(false)
                    setNameImgLarge('')
                    setOnSubmit(false)
                    imgLargeRef.current.value = null
                })
                .catch(err => {
                    setName('')
                    setIsPrivate(false)
                    setOnSubmit(false)
                    setNameImgLarge('')
                    imgLargeRef.current.value = null
                })
        }
    // eslint-disable-next-line 
    },[onSubmit])

    const handleClickSubmit = () => {
        if(imgLargeRef.current.files[0] && name)
            setOnSubmit(true)
    }

    return (
        <div className='newGroup'>
            <h2>Tạo nhóm mới</h2>

            <div className='newGroupContent'>
                <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Tên nhóm' className='newGroupContentInput' />
                
                <select className='newGroupContentInput' placeholder='Chọn quyền riêng tư' onChange={e => setIsPrivate(e.target.value === '1' ? true : false)} value={isPrivate ? '1' : '2'}>
                    <option className='newGroupContentInputIcon' value='1'>Riêng tư</option>
                    <option className='newGroupContentInputIcon' value='2'>Công khai</option>
                </select>

                <div className='newGroupBtnImg'>
                    <label htmlFor='imgLargeGroup'>
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{height: '24px', width: '24px'}}/>
                        <span style={{marginLeft: '8px'}}>Ảnh bìa</span>
                        <input type='file' onChange={e => setNameImgLarge(e.target.files[0].name)} ref={imgLargeRef} className='newGroupBtnImgFile' accept="image/png, image/gif, image/jpeg" id='imgLargeGroup'  />
                    </label>
                    <span className='nameImg'>{nameImgLarge}</span>
                </div>

                <button onClick={() => handleClickSubmit()} className='newGroupContentBtn'>Tạo nhóm</button>
            </div>
        </div>
    )
}

export default NewGroup