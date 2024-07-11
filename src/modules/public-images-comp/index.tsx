import React, { useEffect } from 'react'
import { useLastPublicImagesStore } from './store';
import { useLocation } from 'wouter';
import './index.css'
import { Rating } from '@mui/material';

function AddImageComponent() {
  const {load, images} = useLastPublicImagesStore(state => ({
    ...state.actions,
    images: state.imageList
  }));

  const [_, setLocation] = useLocation();

  useEffect(() => {
    load()
  }, [])
  return (<div className='AddImageComponent'>
    {
      images.map(image => (
        <div key={image.id} className='public-image-preview'>
          <div style={{position: 'absolute', top: 0, left: 0}}>
            <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
          </div>
          <img src={image.link} alt='' height={'100px'} onClick={() => {setLocation('image/'+image.id)}} />
        </div>
        
      ))
    }
  </div>)
}

export default AddImageComponent;