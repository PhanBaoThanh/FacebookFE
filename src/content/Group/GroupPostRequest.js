import axios from 'axios'
import {useContext, useEffect, useState} from 'react'
import StatusConfirm from '../StatusConfirm/StatusConfirm'
import { PageContext } from '../../context/PageContext'

function GroupPostRequest({admin,group}){
    const {
        socket
    } = useContext(PageContext)
    const [postConfirm,setPostConfirm] = useState([])
    const [changePostConfirm,setChangePostConfirm] = useState([])

    useEffect(() => {
        axios(`http://127.0.0.1:5000/get-all-post-confirm-by-group-id/${group.groupId}`)
            .then(res => {
                setPostConfirm(res.data)
            })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        socket.current.on('postConfirmResponse',data => {
            console.log('postConfirm')
            if(data.groupId === group.groupId)
                axios(`http://127.0.0.1:5000/get-all-post-confirm-by-group-id/${group.groupId}`)
                    .then(res => {
                        setPostConfirm(res.data)
                    })
        })
    // eslint-disable-next-line 
    },[])

    useEffect(() => {
        if(changePostConfirm === true)
            axios(`http://127.0.0.1:5000/get-all-post-confirm-by-group-id/${group.groupId}`)
                .then(res => {
                    setChangePostConfirm(false)
                    setPostConfirm(res.data)
                })
                .catch(err => {
                    setChangePostConfirm(false)
                })
    // eslint-disable-next-line
    },[changePostConfirm])

    return (
        <>
            <div className='groupPostRequest' style={{marginLeft: 'auto',marginRight: 'auto',width: '70%',minHeight: '400px'}}>
                {
                    postConfirm.map(item => (
                        <StatusConfirm key={item.postConfirmId} item={item} group={group} admin={admin} setChangePostConfirm={setChangePostConfirm} />
                    ))
                }
            </div>
        </>
    )
}

export default GroupPostRequest