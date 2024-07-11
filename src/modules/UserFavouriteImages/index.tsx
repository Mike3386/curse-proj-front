import React, { useEffect, useState } from 'react'
import { useUserFavouriteImagesStore } from './store';

import './index.css'
import { Pagination } from '@mui/material';

import trash from './icons8-trash.svg'
import unFavourite from '../../svg/heart-active.svg'
import CopyToClipboard from 'react-copy-to-clipboard';

import clipboardHtmlSvg from '../PublicImageShow/copy-to-clipboard/html.svg'
import clipboardLinkSvg from '../PublicImageShow/copy-to-clipboard/link.svg'
import { toast } from 'react-toastify';
import { TelegramShareButton, TelegramIcon, ViberShareButton, ViberIcon } from 'react-share';
import Overlay from '../overlay-fs';
import { WithContext as ReactTags } from 'react-tag-input';
import download from '../menu/images-from-search/download-svgrepo-com.svg'
import clipboardRawSvg from '../PublicImageShow/copy-to-clipboard/raw.svg'
async function downloadImage(imageSrc: string) {
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = 'image'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function UserFavouriteImages() {
  const {images, load, pages, setCurrentPage, currentPage, deleteImage} = useUserFavouriteImagesStore(state => ({
    images: state.imagesData,
    load: state.loadImages,
    pages: state.pages,
    setCurrentPage: state.setCurrentPage,
    currentPage: state.currentPage,
    deleteImage: state.delete,
  }));
  console.log(pages)

  useEffect(() => {
    load()
  }, []);

  const [isOpen, setIsOpen] = useState<string|undefined>(undefined);
  const [tags, setTags] = useState<any>([]);
  const toggleOverlay = (link?: string) => {
    setIsOpen(link);
  };
  return (
    <div className='UserImages'>
      <Overlay isOpen={!!isOpen} onClose={() => toggleOverlay()}>
        <div className='image-wrapper-1'>
          <img src={isOpen} alt={'loading'}/>
          <div className='react-tags-wrapper3'>
            <ReactTags
              tags={tags.map((tag: any) => ({id: tag.id, text: tag.name}))}
              handleDelete={()=> {}}
              handleAddition={() => {}}
              readOnly
              handleTagClick={() => {}}
            />
          </div>
        </div>
      </Overlay>
      {
        pages === 0 && images?.length === 0 && (
          <div>
            Нет избранных изображений
          </div>
        )
      }
      {
        <div className='UserImagesWrapper'>
          {
            images?.map(image => (
              <div key={image.id} className='UserImagesElement'>
              <img className='delete-image' src={unFavourite} alt='' onClick={() => deleteImage(image.id)} />
              <div className='share-image'>
                <CopyToClipboard text={image.link}>
                  <img
                    className='clipboard-icon'
                    src={clipboardRawSvg}
                    alt='clipboard-icon'
                    width={20}
                    height={20}
                    onClick={() => {
                      toast.success('ссылка скопирована в буфер обмена')
                    }}
                  />
                </CopyToClipboard>
                <CopyToClipboard text={`http://${window.location.hostname}:3001/image/${image.id}`}>
                  <img
                    className='clipboard-icon'
                    src={clipboardLinkSvg}
                    alt='clipboard-icon'
                    width={20}
                    height={20}
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.success('ссылка скопирована в буфер обмена')
                    }}
                  />
                </CopyToClipboard>
                <CopyToClipboard text={
                  `<img src='${image?.link}' alt='${'image-link'}'/>`
                  }>
                  <img
                    className='clipboard-icon'
                    src={clipboardHtmlSvg}
                    alt='clipboard-icon'
                    width={20}
                    height={20}
                    onClick={() => {
                      toast.success('код скопирован в буфер обмена')
                    }}
                  />
                </CopyToClipboard>
                <TelegramShareButton url={image.link} >
                  <TelegramIcon round={true} size={20} />
                </TelegramShareButton>
                <ViberShareButton url={image.link}>
                  <ViberIcon round={true} size={20} />
                </ViberShareButton>
                <img src={download} width={20} height={20}  onClick={() => downloadImage(image.link)}/>
                </div>
                <img
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(image.link)
                  setTags(image.tags)
                }}
                className='UserImagesImage' src={image.link} alt='' width={200}/>
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

export default UserFavouriteImages;