import React from 'react'

const ImageGroup = ({posts}) => {
  return (
    <div className='imageGroup'>
        <h2>Ảnh</h2>

        <div className='imageGroupContent'>
          {
            posts.map(item => {
              if(item.postImg !== '' && item.postImg !== null)
                return (
                  <div className='imageGroupContentItem' key={item.postId}>
                    <div className='imageGroupContentItemBox'>
                      <postImg src={`http://127.0.0.1:5000/img/${item.postImg}`} alt='ptc' />
                    </div>
                  </div>
                )
            })
          }
        </div>
    </div>
  )
}

export default ImageGroup