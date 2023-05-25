import React,{useState,useEffect,useRef,useContext} from 'react'
import axios from 'axios'
import './group.scss'
import { PageContext } from '../../context/PageContext'
import { Link } from 'react-router-dom'

const GroupMember = ({isAdmin,group,members,setMembers,setChange}) => {
  const {
    user,
    socket
  } = useContext(PageContext)
  const [isClick,setIsClick] = useState('thanhvien')
  const [data,setData] = useState(members)
  const [filterData,setFilterData] = useState(members)
  const [clientId,setClientId] = useState(null)
  const [onChange,setOnChange] = useState(false)
  const [deleteId,setDeleteId] = useState(null)
  const [clientIdDelete,setClientIdDelete] = useState(null)
  const inputRef = useRef()

  useEffect(() => {
    if(isClick === 'thanhvien')
        axios(`http://127.0.0.1:5000/get-all-member-from-group-member/${group.groupId}`)
            .then(res => {
                setData(res.data)
                setFilterData(res.data)
                setMembers(res.data)
            })
            .catch(err => {
              setData([])
              setFilterData([])
            })

    else if(isClick === 'yeucau')
        axios(`http://127.0.0.1:5000/get-all-member-from-group-request/${group.groupId}`)
            .then(res => {
                setData(res.data)
                setFilterData(res.data)
            })
            .catch(err => {
              setData([])
              setFilterData([])
            })
  // eslint-disable-next-line
  },[isClick])

    useEffect(() => {
        if(onChange === true){
            if(isClick === 'thanhvien')
                axios(`http://127.0.0.1:5000/get-all-member-from-group-member/${group.groupId}`)
                    .then(res => {
                        setData(res.data)
                        setFilterData(res.data)
                        setMembers(res.data)
                        setOnChange(false)
                    })
                    .catch(err => {
                        setData([])
                        setFilterData([])
                        setOnChange(false)
                    })

            else if(isClick === 'yeucau')
                axios(`http://127.0.0.1:5000/get-all-member-from-group-request/${group.groupId}`)
                    .then(res => {
                        setData(res.data)
                        setFilterData(res.data)
                        setOnChange(false)
                    })
                    .catch(err => {
                        setData([])
                        setFilterData([])
                        setOnChange(false)
                    })
        }
    // eslint-disable-next-line
    },[onChange])

    useEffect(() => {
        socket.current.on('groupMemberRequestRes',data => {
            if(data.groupId === group.groupId)
                setOnChange(true)
        })

        socket.current.on('outGroupResponse',data => {
            if(data.groupId === group.groupId)
                setOnChange(true)
        })

        socket.current.on('groupMemberRequestConfirmRes',data => {
            if(data.groupId === group.groupId)
                setOnChange(true)
        })
    // eslint-disable-next-line
    },[])

  useEffect(() => {
      if(clientId !== null){
            if(isClick === 'thanhvien')
                axios.post('http://127.0.0.1:5000/group-member/delete',{
                    'clientId': clientId,
                    'groupId': group.groupId
                })
                    .then(res => {
                        socket.current.emit('outGroup',{
                            'userId': clientId,
                            'groupId': group.groupId
                        })
                        setClientId(null)
                    })
            else if(isClick === 'yeucau')
                  axios.post('http://127.0.0.1:5000/group-request-confirm',{
                      'groupId': group.groupId,
                      'clientId': clientId
                  })
                      .then(res => {
                        socket.current.emit('groupMemberRequestConfirm',{
                            'userId': clientId,
                            'groupId': group.groupId
                        })
                        setClientId(null)
                      })
      }
    // eslint-disable-next-line
    },[clientId])

    useEffect(() => {
        if(deleteId !== null && clientIdDelete !== null)
            axios.delete(`http://127.0.0.1:5000/group-request-delete/${deleteId}`)
                .then(res => {
                    socket.current.emit('groupMemberRequest',{
                        'userId': clientIdDelete,
                        'groupId': group.groupId
                    })
                    setDeleteId(null)
                    setClientIdDelete(null)
                })
    // eslint-disable-next-line
    },[deleteId])

  const handleSearch = e => {
      if(e.target.value === '' || e.target.value === null)
          setFilterData(data)
      else
          setFilterData(data.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())))
  }

  const handleClickBtn = id => {
      setClientId(id)
  }

  const handleClickDeleteBtn = (id1,id2) => {
      setDeleteId(id1)
      setClientIdDelete(id2)
  }

  const handleClickConfirmBtn = id => {
      setClientId(id)
  }

  return (
    <div className='GroupMember'>
            <div className='GroupMemberHeader'>
                <h2>Thành viên nhóm</h2>
                <div className='search'>
                    <input ref={inputRef} placeholder='Tìm kiếm' onChange={e => handleSearch(e)} className='searchInput'/>
                    <label className='searchIcon'>
                        <span ><svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" ><g  transform="translate(-448 -544)"><g><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg></span>
                    </label>
                </div>
            </div>
            <div className='GroupMemberNav'>
                <div className='GroupMemberNavItems'>
                    <div className={`GroupMemberNavItem ${isClick === 'thanhvien' ? 'isClick' : ''}`} onClick={() =>{ setIsClick('thanhvien');inputRef.current.value = ''}}>Thành viên</div>
                    <div className={`GroupMemberNavItem ${isClick === 'yeucau' ? 'isClick' : ''}`} onClick={() =>{ setIsClick('yeucau');inputRef.current.value = ''}}>Yêu cầu tham gia nhóm</div>
                </div>
            </div>
            <div className='GroupMemberContent'>
                {
                    filterData.map(item => (
                        <div className='GroupMemberContentItem' key={item.clientId}>
                            <div className='GroupMemberContentItemBox'>
                                <div className='GroupMemberContentItemHeader'>
                                    <Link to={`/client/${item.clientId}`}>
                                        <img src={`http://127.0.0.1:5000/img/${item.avatar}`} alt='avt' />
                                    </Link>
                                    <Link to={`/client/${item.clientId}`}>{item.name}</Link>
                                </div>
                                {
                                  isClick === 'thanhvien' && isAdmin && item.clientId !== user.clientId && (
                                    <div className='GroupMemberContentItemBtn'>
                                      <button onClick={() => handleClickBtn(item.clientId)}>Kick</button>
                                    </div>
                                  )
                                }
                                {
                                    isClick === 'yeucau' && isAdmin && (
                                        <div style={{display: 'flex'}}>
                                            <div style={{marginRight: '8px'}} className='GroupMemberContentItemBtnAccept'>
                                                <button onClick={() => handleClickConfirmBtn(item.clientId)}>Xác nhận</button>
                                            </div>
                                            <div className='GroupMemberContentItemBtn'>
                                                <button onClick={() => handleClickDeleteBtn(item.groupRequestId,item.clientId)}>Xóa</button>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
  )
}

export default GroupMember