import './groups.scss'
import { useState } from 'react'
import GroupsComponent from './GroupsComponent'
import GroupsRequestComponent from './GroupsRequestComponent'
import NewGroup from './NewGroup'


function Groups(){
    const [isClick,setIsClick] = useState('group')
    
    return (
        <div className='group'>
            <div className='groupNav'>
                <div className='groupNavItems'>
                    <button onClick={() => setIsClick('group')} className={`groupNavItem ${isClick === 'group' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={ isClick==='group' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImggroup'></i>
                        </div>
                        <p>Nhóm đã tham gia</p>
                    </button>

                    <button onClick={() => setIsClick('groupRequest')} className={`groupNavItem ${isClick==='groupRequest' && 'active'}`}>
                        <div className='btnIcon marginRight8' style={isClick === 'groupRequest' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImggroupRequest'></i>
                        </div>
                        <p>Yêu cầu tham gia nhóm</p>
                    </button>

                    <button onClick={() => setIsClick('newGroup')} className={`groupNavItem ${isClick==='newGroup' && 'active'}`}>
                    <div className='btnIcon marginRight8' style={isClick  === 'newGroup' ? {backgroundColor: '#1877f2'} : {backgroundColor: '#3a3b3c'}}>
                            <i className='btnIconImggroupAdd'></i>
                        </div>
                        <p>Tạo nhóm mới</p>
                    </button>

                </div>
            </div>
            
            <div className='groupContent'>
                {
                    isClick === 'group' ? <GroupsComponent /> : isClick === 'groupRequest' ? <GroupsRequestComponent /> : <NewGroup />
                }
            </div>
        </div>
    )
}

export default Groups