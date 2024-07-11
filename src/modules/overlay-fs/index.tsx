import { Fragment, ReactElement, useEffect } from 'react';
import './index.css';

export function OverlayFS({ isOpen, onClose, children, isScrolable }: {isScrolable?: boolean, isOpen: boolean, onClose: () => void, children: ReactElement}) {
  useEffect(() => {
    const body = document.getElementsByTagName('body');
    if (isOpen && body[0]) body[0].classList.add('hide-scroll')
    else body[0].classList.remove('hide-scroll')
  }, [isOpen])
  
  return (
    <Fragment>
      {isOpen && (
        <div className='overlayFS'>
          <div className='overlayFS__background' onClick={onClose} />
          <div className={`overlayFS__container ${isScrolable?'scrollable': ''}`}  onClick={onClose}>
            <div className='overlayFS__controls'>
              <button
                className='overlayFS__close'
                type='button'
                onClick={onClose}
              />
            </div>
            <div className='overlayFS_children_container'>
              {children}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default OverlayFS;