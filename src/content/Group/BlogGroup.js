import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { PageContext } from '../../context/PageContext'
import StatusGroup from '../StatusGroup/StatusGroup'

const BlogGroup = ({ setIsClick, posts, setPosts, group, members ,admin }) => {
  const {
    user,
    socket
  } = useContext(PageContext)
  const [nameImg, setNameImg] = useState('')
  const [value, setValue] = useState('')
  const sttRef = useRef()
  const [onChange, setOnChange] = useState(false)
  const [onChangePost, setOnChangePost] = useState(false)
  const time = group.groupCreatedAt ? new Date(group.groupCreatedAt.slice(1,-1).split('T')[0]) : new Date()

  useEffect(() => {
    if (onChangePost === true)
      axios.get(`http://127.0.0.1:5000/get-all-post-of-group/${group.groupId}`)
        .then(res => {
            setOnChangePost(false)
            setPosts(res.data)
        })
        .catch(err => {
          setOnChangePost(false)
        })
    // eslint-disable-next-line
  }, [onChangePost])


  useEffect(() => {
    if (onChange === true) {
      if (sttRef.current.files[0]) {
        const formData = new FormData()
        formData.append('manhom', group.groupId)
        formData.append('manguoidung', user.clientId)
        formData.append('noidung', value)
        formData.append('image', sttRef.current.files[0], sttRef.current.files[0].name)
        axios.post('http://127.0.0.1:5000/post-confirm', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then(res => {
            socket.current.emit('postConfirm',{
              user,
              'groupId': group.groupId
            })
            setValue('')
            setNameImg('')
            sttRef.current.value = null
            setOnChange(false)
          })
          .catch(err => {
            setValue('')
            setNameImg('')
            sttRef.current.value = null
            setOnChange(false)
          })
      }
      else
        axios.post('http://127.0.0.1:5000/post-confirm-no-img', {
          'manhom': group.groupId,
          'manguoidung': user.clientId,
          'noidung': value
        })
          .then(res => {
            socket.current.emit('postConfirm',{
              user,
              'groupId': group.groupId
            })
            setValue('')
            setNameImg('')
            sttRef.current.value = null
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
  }, [onChange])

  const handleUpPost = () => {
    if ((value !== '' && value !== null) || (sttRef.current.files[0] !== undefined && sttRef.current.files[0] !== null))
      setOnChange(true)
  }

  return (
    <>
      <div className='GroupContentOverview'>
        <div className='GroupContentOverviewInfo'>
          <h3>Giới thiệu</h3>

          <div className='GroupContentOverviewInfo'>
            <p style={{ padding: '4px 0' }}>Ngày tạo: {`${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`}</p>
            <p style={{ padding: '4px 0' }}>Chế độ riêng tư: {group.isPrivate ? 'Riêng tư' : 'Công khai'}</p>
            <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '16px' }}>Quản trị viên:</span>
              <div className='homepageFriendItem' key={admin.clientId} style={{ display: 'flex', alignItems: 'center' }}>
                <Link style={{ textDecoration: 'none', margin: 0 }} to={admin.clientId === user.clientId ? '/myAccount' : `/client/${admin.clientId}`} className='btnCircle marginRight8'>
                  <img style={{ borderRadius: '50%', width: '100%', height: '100%' }} src={`http://127.0.0.1:5000/img/${admin.avatar}`} alt='' />
                </Link>
                <Link style={{ textDecoration: 'none', marginLeft: '2px' }} to={admin.clientId === user.clientId ? '/myAccount' : `/client/${admin.clientId}`} className='homepageFriendText textLimit'>{admin.name}</Link>
              </div>
            </div>

          </div>
        </div>

        <div className='GroupContentOverviewImage'>
          <div className='GroupContentOverviewImageBtn'>
            <h3 style={{ marginBottom: 0 }}>Ảnh</h3>
            <button onClick={() => setIsClick('anh')}>Xem tất cả ảnh</button>
          </div>

          <div className='GroupContentOverviewImages'>
            {
              posts.filter(item => item.postImg !== '' && item.postImg !== null).slice(0,9).map(item => (
                <div className='GroupContentOverviewImageItem' key={item.postId}>
                  <div className='GroupContentOverviewImageItemBox'>
                    <img src={`http://127.0.0.1:5000/img/${item.postImg}`} alt='ptc' />
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className='GroupContentOverviewFriend'>
          <div className='GroupContentOverviewFriendBtn'>
            <h3>Thành viên</h3>
            <button onClick={() => setIsClick('thanhvien')}>Xem tất cả thành viên</button>
          </div>
          <p style={{ marginTop: '0px' }}>{members.length} thành viên</p>

          <div className='GroupContentFriends'>
            {
              members.map(item => (
                <div className='GroupContentFriend' key={item.GroupId}>
                  <div className='GroupContentFriendItem'>
                  {
                    item && item.clientId === user.clientId ? (
                      <>
                        <Link to='/myAccount' className='GroupContentFriendItemBox'>
                          <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='img' className='GroupContentFriendImg' />
                        </Link>
                        <Link to='/myAccount'>{item.name}</Link>
                      </>
                      
                    ) : (
                      <>
                        <Link to={`/client/${item.clientId}`} className='GroupContentFriendItemBox'>
                          <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='img' className='GroupContentFriendImg' />
                        </Link>
                        <Link to={`/client/${item.clientId}`}>{item.name}</Link>
                      </>
                      
                    )
                  }
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>
      <div className='GroupContentStt'>
        {
          members.some(item => item.clientId === user.clientId) && (
            <div className='GroupStt'>
              <h2 style={{ textAlign: 'center', margin: '8px 0' }}>Tạo bài viết</h2>
              <div className='GroupSttHeader'>
                <div className='btnCircle marginRight8'>
                  <img style={{ borderRadius: '50%', width: '100%', height: '100%' }} src={`http://127.0.0.1:5000/img/${user.avatar}`} alt='' />
                </div>
                <div className='GroupSttInput'>
                  <input className='GroupSttInputItem' placeholder='Viết bình luận...' value={value} onChange={e => setValue(e.target.value)} />
                </div>
              </div>
              <div className='GroupSttImg'>
                <label onClick={() => setNameImg('')} htmlFor='sttOfGroup'>
                  <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png" alt="" style={{ height: '24px', width: '24px' }} />
                  <span style={{ marginLeft: '8px' }}>Ảnh</span>
                  <input ref={sttRef} type='file' onChange={e => setNameImg(e.target.files[0].name)} accept="image/png, image/gif, image/jpeg" id='sttOfGroup' name='sttOfGroup' />
                </label>
                <span className='nameImg'>{nameImg}</span>
              </div>
              <div onClick={() => handleUpPost()} className='GroupSttBtn'>Đăng</div>
            </div>
          )
        }
        
        {
          posts.map(item => (
            <StatusGroup admin={admin} changePost={setOnChangePost} group={group} item={item} key={item.postId} />
          ))
        }
      </div>
    </>
  )
}

export default BlogGroup