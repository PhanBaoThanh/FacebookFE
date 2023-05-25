import React from 'react'
import './client.scss'

const ImageClient = ({posts}) => {
  return (
    <div className='imageclient'>
        <h2>Ảnh</h2>

        <div className='imageclientContent'>
        {
            posts.map(item => {
              if(item.postImg !== '' && item.postImg !== null)
              return (
                <div className='imageclientContentItem' key={item.postId}>
                  <div className='imageclientContentItemBox'>
                    <img src={`http://127.0.0.1:5000/img/${item.postImg}`} alt='ptc' />
                  </div>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default ImageClient