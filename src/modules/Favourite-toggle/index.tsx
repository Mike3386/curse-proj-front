import React from 'react';
import './index.css'
import HeartActiveIcon from '../../svg/heart-active.svg';
import HeartInactiveIcon from '../../svg/heart-inactive.svg';

interface FavouriteToggleProps {
  isFavourite: boolean,
  onClick: () => void,
}

function FavouriteToggle({
  isFavourite,
  onClick,
}: FavouriteToggleProps) {
  return (
    <div className='FavouriteToggleWrapper' onClick={onClick}>
      <img className='FavouriteToggleIcon' src={isFavourite?HeartActiveIcon: HeartInactiveIcon} alt='' />
    </div>
  )
}

export default FavouriteToggle;