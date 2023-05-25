import axios from "axios";
import './header.scss'
import {useContext, useEffect, useState} from 'react'
import { PageContext } from "../context/PageContext";
import './header.scss'

function ChatItem({item,chatId,setBtnValue}){
    const {
        user,
        setMessageClient
    } = useContext(PageContext)

    const [client,setClient] = useState({})
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/find-client/${user.clientId === item.clientId1 ? item.clientId2 : item.clientId1}`)
            .then(res => {
                setClient(res.data)
            })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/find-client/${user.clientId === item.clientId1 ? item.clientId2 : item.clientId1}`)
            .then(res => {
                setClient(res.data)
            })
    // eslint-disable-next-line
    },[item])

    return (
        <div className='messengersItem' key={chatId} onClick={() => {setMessageClient(client);setBtnValue(null)}}>
            <div className='messengerItemImg'>
                <img src={`http://127.0.0.1:5000/img/${client.avatar}`} alt='' className='messengersItemImg' />
            </div>
            <div className='messengerItemText'>
                <p className='messengerItemNameClient'>{client.name}</p>
                <p className='messengerItemInfo'>{item.senderId === user.clientId ? 'Bạn' : client.name}: {item.content}</p>
            </div>
        </div>
    )
}

export default ChatItem