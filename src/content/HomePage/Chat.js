import axios from "axios";
import { useContext, useEffect, useState , useRef} from "react";
import Message from "./Message";
import './homepage.scss'
import { PageContext } from "../../context/PageContext";

function Chat({clientInfo,userOnline,setMessageClient}){
    const {
        user,
        socket
    } = useContext(PageContext)
    const [messages,setMessages] = useState([])
    const [onChange,setOnChange] = useState(null)
    const [openModal,setOpenModal] = useState(null)
    const inputRef = useRef()
    const scrollRef = useRef()

    useEffect(() => {
        if(clientInfo !== null){
            const request = {
                params:{
                    client1: user.clientId,
                    client2: clientInfo.clientId
                }
            }
            axios('http://127.0.0.1:5000/get-all-message-by-client-id',request)
                .then(res => {
                    setMessages(res.data)
                })
        }
    // eslint-disable-next-line
    },[clientInfo])

    useEffect(() => {
        socket.current.on('messageResponse',data => {
            if((data.client1 === user.clientId && data.client2 === clientInfo.clientId) || (data.client1 === clientInfo.clientId && data.client2 === user.clientId)){
                const request = {
                    params:{
                        client1: user.clientId,
                        client2: clientInfo.clientId
                    }
                }
                axios('http://127.0.0.1:5000/get-all-message-by-client-id',request)
                    .then(res => {
                        setMessages(res.data)
                        scrollRef.current.scrollIntoView()
                    })
            }
        })
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if(onChange === 'deleteAll'){
            axios.delete(`http://127.0.0.1:5000/delete-chat-by-id/${messages[0].chatId}`)
                .then(res => {
                    socket.current.emit('message',{
                        'client1': user.clientId,
                        'client2': clientInfo.clientId
                    })
                    setMessageClient(null)
                    setOnChange(null)
                })
                .catch(err => {
                    setOnChange(null)
                })
        }
        else if(onChange === 'sendMessage'){
            if(messages.length === 0){
                axios.post('http://127.0.0.1:5000/chat',{
                    'client1': user.clientId,
                    'client2': clientInfo.clientId
                })
                    .then(res => {
                        axios.post('http://127.0.0.1:5000/message',{
                            'chatId': res.data.chatId,
                            'senderId': user.clientId,
                            'content': inputRef.current.value
                        })
                            .then(r => {
                                socket.current.emit('message',{
                                    'client1': user.clientId,
                                    'client2': clientInfo.clientId
                                })
                                setOnChange(null)
                                inputRef.current.value = ''
                            })
                            .catch(err => {
                                setOnChange(null)
                            })
                    })
            }
            else
                axios.post('http://127.0.0.1:5000/message',{
                    'chatId': messages[0].chatId,
                    'senderId': user.clientId,
                    'content': inputRef.current.value
                })
                    .then(r => {
                        socket.current.emit('message',{
                            'client1': user.clientId,
                            'client2': clientInfo.clientId
                        })
                        setOnChange(null)
                        inputRef.current.value = ''
                    })
                    .catch(err => {
                        setOnChange(null)
                    })
        }
    // eslint-disable-next-line
    },[onChange])

    const handleChangeValue = e => {
        if(e.keyCode === 13 && inputRef.current.value !== '' && inputRef.current.value !== null)
            setOnChange('sendMessage')
        else if(e.keyCode === 27)
            setMessageClient(null)
    }

    return (
        <>
            <div className='messageBox'>
                    <div className='messageHeader'>
                        <div className='messageHeaderUser'>
                            <div className='messageHeaderUserImage'>
                                <img src={`http://127.0.0.1:5000/img/${clientInfo.avatar}`} alt='anh' />
                            </div>
                            <div className='messageHeaderUserName'>
                                <p>{clientInfo.name}</p>
                                {
                                    userOnline.some(item => item.clientId === clientInfo.clientId) && (
                                        <div className='messageHeaderUserOnline'>
                                            <div></div>
                                            <p>Đang hoạt động</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className='messageHeaderBtn'>
                        {
                            messages.length > 0 && (
                                <button className='messageHeaderBtnStyle' onClick={() => setOpenModal(true)}>
                                    <i className='messageHeaderBtnIcon'></i>
                                </button>
                            )
                        }
                            <button className='messageHeaderBtnStyle' onClick={() => setMessageClient(null)}>
                                <svg height="24px" viewBox="0 0 24 24" width="24px"><g stroke="var(--disabled-icon)" strokeLinecap="round" strokeWidth="2"><line x1="6" x2="18" y1="6" y2="18"></line><line x1="6" x2="18" y1="18" y2="6"></line></g></svg>
                            </button>
                            
                        </div>
                    </div>

                    <div className='messageContent'>
                    {
                        messages.map((item,index) => (
                            <Message item={item} scrollRef={scrollRef} length={messages.length} count={index} messageId={item.messageId} clientInfo={clientInfo} />
                        ))
                    }
                    </div>

                    <div className='messageFooter'>
                        <input className='messageFooterInput' placeholder='Aa' ref={inputRef} onKeyDown={e => handleChangeValue(e)} />
                        <button className='messageFooterBtn' onClick={() => setOnChange('sendMessage')}>
                            <svg className="xsrhx6k" height="20px" viewBox="0 0 24 24" width="20px"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path></svg>
                        </button>
                    </div>
                    

            {
                openModal && (
                <div className='modalEditStatus' style={{display: 'flex'}}>
                    <div className='MessageContentStt'>
                        <div className='MessageStt'>
                            <h2 style={{textAlign: 'center',margin: '8px 0'}}>
                                Xóa cuộc trò chuyện
                            </h2>

                            <p style={{textAlign: 'center',padding: '20px 0'}}>Bạn có chắc muốn xóa cuộc trò chuyện</p>
                            <button className='MessageSttBtn' style={{backgroundColor: 'rgb(199, 4, 4)'}} onClick={() => {setOnChange('deleteAll');setOpenModal(null)}}>Xóa</button>
                            <button className='MessageSttBtn' style={{backgroundColor: '#3a3b3c'}} onClick={() => {setOpenModal(null)}}>Hủy</button>
                        </div>
                    </div>
                </div>
                )
            }
            </div>
        </>
    )
}

export default Chat