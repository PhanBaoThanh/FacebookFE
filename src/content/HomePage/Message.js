import {useContext, useEffect, useState} from 'react'
import './homepage.scss'
import { PageContext } from '../../context/PageContext'
import axios from 'axios'

function Message({item,count,length,clientInfo,scrollRef}){

    const {
        user,
        socket
    } = useContext(PageContext)
    const time = new Date(item.createdAt)
    const [isDeleteMessage,setIsDeleteMessage] = useState(false)
    useEffect(() => {
        if(isDeleteMessage === true)
            axios.delete(`http://127.0.0.1:5000/message/${item.messageId}`)
                .then(res => {
                    socket.current.emit('message',{
                        'client1': item.clientId1,
                        'client2': item.clientId2
                    })
                    setIsDeleteMessage(false)
                })
                .catch(err => {
                    setIsDeleteMessage(false)
                })
    // eslint-disable-next-line
    },[isDeleteMessage])

    return (
        <div className={`messageItem ${item.senderId === user.clientId ? 'isUser' : ''}`} key={item.messageId}>
            {
                user.clientId === item.senderId ? (
                    <>
                        <div className='messageItemContent' ref={length-1 === count ? scrollRef : null}>
                            {item.content}
                            <button className='buttonDeleteMessage' onClick={() => setIsDeleteMessage(true)}>
                                <i></i>
                            </button>
                            <div className='timeCreatedAtMessage isUserTimeCreated'>
                                {`${time.getHours()}:${time.getMinutes()} ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`}
                            </div>
                        </div>
                        <div className='messageItemImage messageUser'>
                            <img src={`http://127.0.0.1:5000/img/${user.avatar}`} alt='anh' />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='messageItemImage' ref={length-1 === count ? scrollRef : null}>
                            <img src={`http://127.0.0.1:5000/img/${clientInfo.avatar}`} alt='anh' />
                        </div>
                        <div className='messageItemContent' alt='ok'>
                            {item.content}
                            <div className='timeCreatedAtMessage'>
                                {`${time.getHours()}:${time.getMinutes()} ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`}
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Message