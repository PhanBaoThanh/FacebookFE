import {useState} from 'react'
import FriendComponent from './FriendComponent'
import FriendRequestComponent from './FriendRequestComponent'
import './friend.scss'
import FriendResponseComponent from './FriendResponseComponent'
function Friend(){
    const [clickValue,setClickValue] = useState('friend')
    return (
        <div className='friend'>
            <div className='friendNav'>
                <div className='friendNavItems'>
                    <button onClick={() => setClickValue('friend')} className={`friendNavItem ${clickValue === 'friend' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={ clickValue === 'friend' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImgFriend'></i>
                        </div>
                        <p>Bạn bè</p>
                    </button>

                    <button onClick={() => setClickValue('response')} className={`friendNavItem ${clickValue === 'response' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={clickValue === 'response' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImgFriendResponse'></i>
                        </div>
                        <p>Lời mời kết bạn</p>
                    </button>

                    <button onClick={() => setClickValue('request')} className={`friendNavItem ${clickValue === 'request' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={clickValue === 'request' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImgFriendRequest'></i>
                        </div>
                        <p>Yêu cầu kết bạn</p>
                    </button>

                </div>
            </div>
            
            <div className='friendContent'>
                {clickValue === 'friend' ? <FriendComponent /> : clickValue === 'response' ? <FriendRequestComponent/> : <FriendResponseComponent></FriendResponseComponent>}
            </div>
        </div>
    )
}

export default Friend