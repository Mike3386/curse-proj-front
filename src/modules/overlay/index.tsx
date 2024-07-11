import { Fragment, ReactElement } from 'react';
import './index.css';

export function Overlay({ isOpen, onClose, children }: {isOpen: boolean, onClose: () => void, children: ReactElement}) {
  return (
    <Fragment>
      {isOpen && (
        <div className='overlay'>
          <div className='overlay__background' onClick={onClose} />
          <div className='overlay__container'>
            <div className='overlay__controls'>
              <button
                className='overlay__close'
                type='button'
                onClick={onClose}
              />
            </div>
            <div className='overlay_children_container'>
              {children}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;