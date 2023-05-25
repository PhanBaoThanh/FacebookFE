import {useState} from 'react'
import './container.scss'

function Container({Component}){
    return (
        <div className='container'>
            <Component />
        </div>
    )
}

export default Container