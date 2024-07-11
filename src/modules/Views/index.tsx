import React from 'react';
import eyeIcon from '../../svg/eye-svgrepo-com.svg'
import './index.css';

interface ViewsProps {
  viewsCount: number,
}

function Views({
  viewsCount
}: ViewsProps) {
  return (<div className='Views-comp-wrapper'>
    {viewsCount}
    <img src={eyeIcon} alt='' className='Views-comp-eye'/>
  </div>)
}

export default Views;