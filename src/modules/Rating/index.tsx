import { Rating } from '@mui/material';
import React, { useState } from 'react';
import { useAuthStore } from '../../authStore';
import StarIcon from '@mui/icons-material/Star';
import { CSSTransition } from 'react-transition-group';

import './index.css';

interface UserRatingProps {
  defaultRating?: number,
  onRatingClick?: (rate: number) => void,
  currentRate?: number,
  isBlocked?: boolean
}
 
function UserRating ({
  defaultRating,
  onRatingClick,
  currentRate,
  isBlocked,
}: UserRatingProps) {
  const [isFull, setIsFull] = useState(false);
  const {isNotAuthUser} = useAuthStore(state => ({
    isNotAuthUser: !state.authUser
  }))
  
  const [isBlockMouseEnter, setIsBlockMouseEnter] = useState(false);

  return (<div className='rating-wrapper'>
    {
      isBlocked || !isFull || isNotAuthUser ?
        <div className='single-star-icon-wrapper'>
          {currentRate && <div className='single-star-rate'>{currentRate}</div>}
          <StarIcon
            className={currentRate?'single-star-icon': ''}
            onMouseEnter={() => !isBlockMouseEnter && setIsFull(true)}
            onClick={() => setIsFull(true)}
          />
        </div> :
        <CSSTransition in={isFull} timeout={300} >
          <Rating
            name="half-rating"
            defaultValue={defaultRating}
            onMouseLeave={() => setIsFull(false)}
            className='rating-component'
            disabled={isNotAuthUser}
            onChange={(e, rate) => {
              console.log(rate);
              onRatingClick && rate && onRatingClick(rate)
              setIsFull(false)
              setIsBlockMouseEnter(true)
              setTimeout(() => {
                setIsBlockMouseEnter(false)
              }, 2000)
            }}
          />
        </CSSTransition>
    }
    
  </div>)
}

export default UserRating;
