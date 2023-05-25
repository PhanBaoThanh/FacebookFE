import {useContext, useState,useEffect} from 'react'
import axios from 'axios'
import { PageContext } from '../../context/PageContext'
import './search.scss'
import SearchFriendItem from './SearchFriendItem'
import SearchItem from './SearchItem'

//them ban -> sendFriendRequest
//huy yeu cau ket bn -> deleteFriendRequest
//xac nhan -> confirmFriendResponse
//xoa loi moi ket bn  -> deleteFriendResponse
//xoa bn -> deleteFriend
function Search(){
    const {
        user,
        searchValue,
        setFriends,
    } = useContext(PageContext)
    const [value,setValue] = useState('all')
    const [clients,setClients] = useState([])
    const [groups,setGroups] = useState([])
    const [friendRequestData,setFriendRequestData] = useState([])
    const [groupMembers,setGroupMembers] = useState([])
    const [groupRequests,setGroupRequests] = useState([])

    useEffect(() => {
        if(searchValue !== '' && searchValue!== null){
            axios.post('http://127.0.0.1:5000/client-search',{
                'key': searchValue,
                'clientId': user.clientId
            })
                .then(res => {
                    setClients(res.data)
                })
            axios.post('http://127.0.0.1:5000/group-search',{
                'key': searchValue
            })
                .then(res => {
                    setGroups(res.data)
                })

            axios.get(`http://127.0.0.1:5000/get-all-friend-request-by-client-id/${user.clientId}`)
                .then(res => {
                    setFriendRequestData(res.data)
                })

            axios.get(`http://127.0.0.1:5000/get-all-friend-by-client-id/${user.clientId}`)
                .then(res => {
                    setFriends(res.data)
                })
            axios.get(`http://127.0.0.1:5000/group-member-get-all-by-client-id/${user.clientId}`)
                .then(res => {
                    setGroupMembers(res.data)
                })
            axios.get(`http://127.0.0.1:5000/get-all-group-request-by-client-id/${user.clientId}`)
                .then(res => {
                    setGroupRequests(res.data)
                })
        }
    // eslint-disable-next-line
    },[searchValue])

    return (
        <div className='searchPage'>
            <div className='searchNav'>
                <div className='searchNavItems'>

                    <h1>Kết quả tìm kiếm cho</h1>
                    <p className='searchNavItemsText'>{searchValue}</p>
                    <div className='line'></div>

                    <p className='searchNavItemsTitle'>Bộ lọc</p>

                    <button onClick={() => setValue('all')} className={`searchNavItem ${value === 'all' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={ value==='all' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImgSearchAll'></i>
                        </div>
                        <p>Tất cả</p>
                    </button>

                    <button onClick={() => setValue('friend')} className={`searchNavItem ${value==='friend' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={value === 'friend' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImgSearchFriend'></i>
                        </div>
                        <p>Mọi người</p>
                    </button>

                    <button onClick={() => setValue('group')} className={`searchNavItem ${value==='group' && 'active'}`}>
                    <div className='btnIcon marginRight8' style={value  === 'group' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImgSearchGroup'></i>
                        </div>
                        <p>Nhóm</p>
                    </button>
                </div>
            </div>
            
            <div className='searchContent'>
                {
                    (value === 'all' || value === 'friend') && 
                    clients.map(item => (
                        <SearchFriendItem setFriendRequestData={setFriendRequestData} friendRequestData={friendRequestData} key={item.clientId} item={item} />
                    ))
                }
                
                {
                    (value ==='all' || value ==='group') && (
                        <div className='searchContentItem'>
                            <h3>Nhóm</h3>
                            {
                                groups.map(item => (
                                    <SearchItem setGroups={setGroups} setGroupMembers={setGroupMembers} setGroupRequests={setGroupRequests} groupMembers={groupMembers} groupRequests={groupRequests} item={item} key={item.groupId} />
                                ))
                            }
                        </div>
                    )
                }
                
                
            </div>
        </div>
    )
}

export default Search