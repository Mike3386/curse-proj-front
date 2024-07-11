import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useUserImagesStore } from './store';

import './index.css'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Tooltip } from '@mui/material';

import trash from './icons8-trash.svg'
import userIcon from './user-icon-svgrepo-com.svg'
import CopyToClipboard from 'react-copy-to-clipboard';

import clipboardHtmlSvg from '../PublicImageShow/copy-to-clipboard/html.svg'
import clipboardLinkSvg from '../PublicImageShow/copy-to-clipboard/link.svg'
import { toast } from 'react-toastify';
import { TelegramShareButton, TelegramIcon, ViberShareButton, ViberIcon } from 'react-share';
import Overlay from '../overlay-fs';
import { WithContext as ReactTags } from 'react-tag-input';
import EmailIcon2 from '../../svg/email-svgrepo-com.svg';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

function UserImages() {
  const {images, load, pages, setCurrentPage, currentPage, deleteImage, blockUser} = useUserImagesStore(state => ({
    images: state.imagesData,
    load: state.loadImages,
    pages: state.pages,
    setCurrentPage: state.setCurrentPage,
    currentPage: state.currentPage,
    deleteImage: state.delete,
    blockUser: state.blockUser,
  }));

  useEffect(() => {
    load()
  }, []);

  const [isOpen, setIsOpen] = useState<string|undefined>(undefined);
  const [tags, setTags] = useState<any>([]);
  const toggleOverlay = (link?: string) => {
    setIsOpen(link);
  };

  const imgRef = useRef<any>();
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    const { current: img } = imgRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      (img as HTMLImageElement).style.setProperty("transform", value);
    }
  }, []);

  const [openedData, setOpenedData] = useState<any>(false);

  const handleClose = (action: any) => {
    action()
    setOpenedData(false);
  };

  const handleExit = () => {
    setOpenedData(false);
  };

  return (
    <div className='UserImages'>
      <Overlay isOpen={!!isOpen} onClose={() => toggleOverlay()}>
        <div className='image-wrapper-1'>
          
          <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={500}>
            <img ref={imgRef} src={isOpen} alt={'loading'}/>
          </QuickPinchZoom>
          <div className='react-tags-wrapper3'>
            <ReactTags
              tags={tags||[].map((tag: any) => ({id: tag.id, text: tag.name}))}
              handleDelete={()=> {}}
              handleAddition={() => {}}
              readOnly
              handleTagClick={() => {}}
            />
          </div>
        </div>
      </Overlay>
      <Dialog
        open={!!openedData}
        onClose={handleExit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Подтверждение удаления/блокировки!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              `Вы действительно уверены что хотите ${openedData.type}`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExit}>Отменить</Button>
          <Button onClick={() => handleClose(openedData.action)} autoFocus>
            Да
          </Button>
        </DialogActions>
      </Dialog>
      {
        pages === 0 && images?.length === 0 && (
          <div>
            Нет загруженных изображений
          </div>
        )
      }
      {
        <div className='UserImagesWrapper2'>
          {
            images?.map(image => (
              <div key={image.id} className='UserImagesElement2'>
                {
                  (
                    <div className='UserImages-user-email-wrapper'>
                      {!!image.user && <img src={EmailIcon2} alt=''/>}
                      <div className='UserImages-user-email'>
                        {image.user ? image.user.email : 'временное'}
                      </div>
                    </div>
                  )
                }
                <img
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(image.link)
                  setTags(image.tags)
                }}
                className='UserImagesImage3' src={image.link} alt='' width={200}/>
                <div className='control-bar control-bar-2'>
                  <Tooltip title='удалить изображение'>
                    <img
                      className='delete-image3'
                      src={trash}
                      alt=''
                      onClick={() => {
                        setOpenedData({type: 'удалить изображение', action: () => deleteImage(image.id)})
                      }}
                    />
                  </Tooltip>
                  {
                    !!image.userId && (
                      <Tooltip title='удалить пользователя и заблокровать изображения'>
                        <img
                          className='delete-user'
                          src={userIcon}
                          alt=''
                          onClick={() => {
                           setOpenedData({type: 'заблокировать пользователя и его изображения', action: () => blockUser(image.userId)})
                          }}
                        />
                      </Tooltip>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      }
      {
        <div className='pagination'>
          {
            !!pages && <Pagination count={pages} page={currentPage} onChange={(e, page) => {setCurrentPage(page)}} />
          }
        </div>
      }
      </div>
  )
}

export default UserImages;