import React from 'react';
import CommentIcon from '../../svg/comment.svg';
import './index.css'

function CommentsCount({
  count
}: {count?: number}) {
  return (
    <div className='CommentsCount'>
      <div className='CommentsCountText'>{count || 0}</div>
      <img className='CommentsCountImage' src={CommentIcon} alt='' />
    </div>
  )
}

export default CommentsCount;