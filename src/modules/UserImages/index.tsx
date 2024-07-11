import React, { useEffect, useState } from 'react'
import { useUserImagesStore } from './store';

import './index.css'
import { Pagination } from '@mui/material';

import trash from './icons8-trash.svg'
import PublicIcon from '../../svg/public.svg'
import PrivateIcon from '../../svg/private.svg'
import CopyToClipboard from 'react-copy-to-clipboard';

import clipboardHtmlSvg from '../PublicImageShow/copy-to-clipboard/html.svg'
import clipboardLinkSvg from '../PublicImageShow/copy-to-clipboard/link.svg'
import clipboardRawSvg from '../PublicImageShow/copy-to-clipboard/raw.svg'
import { toast } from 'react-toastify';
import { TelegramShareButton, TelegramIcon, ViberShareButton, ViberIcon } from 'react-share';
import Overlay from '../overlay-fs';
import { WithContext as ReactTags } from 'react-tag-input';
import download from '../menu/images-from-search/download-svgrepo-com.svg'
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

interface IsOpen {id: string, link: string}

function UserImages() {
  const {images, load, pages, setCurrentPage, currentPage, deleteImage, switchAccess, addTag, removeTag, getAutocompleteTags, autocompleteTags} = useUserImagesStore(state => ({
    images: state.imagesData,
    load: state.loadImages,
    pages: state.pages,
    setCurrentPage: state.setCurrentPage,
    currentPage: state.currentPage,
    deleteImage: state.delete,
    switchAccess: state.switchAccess,
    addTag: state.addTag,
    removeTag: state.removeTag,
    autocompleteTags: state.autocompleteTags.map(tag => ({id: tag.id, text: tag.name})),
    getAutocompleteTags: state.getAutocompleteTags,
  }));
  console.log(pages)

  useEffect(() => {
    load()
    getAutocompleteTags()
  }, []);

  const [isOpen, setIsOpen] = useState<IsOpen|undefined>(undefined);
  const [tags, setTags] = useState<any>([]);
  const toggleOverlay = (data?: IsOpen) => {
    setIsOpen(data);
  };

  const tagsForImage = images?.find(image => image.id === isOpen?.id)?.tags || [];
  return (
    <div className='UserImages'>
      <Overlay isOpen={!!isOpen} onClose={() => toggleOverlay()}>
        <div className='image-wrapper-1'>
          <img src={isOpen&&isOpen.link} alt={'loading'}/>
          <div className='react-tags-wrapper3' onClick={e=> e.stopPropagation()}>
            <ReactTags
              inputFieldPosition="top"
              tags={tagsForImage.map((tag: any) => ({id: tag.id, text: tag.name}))}
              handleDelete={(i)=> {isOpen && removeTag(isOpen.id, tagsForImage[i].id)}}
              handleAddition={(tag) => {isOpen && addTag(isOpen.id, tag.text)}}
              handleTagClick={() => {}}
              
              allowDragDrop={false}
              placeholder='Enter для добавления'
              autocomplete={true}
              handleFilterSuggestions={(textInputValue, possibleSuggestionsArray) => {
                var lowerCaseQuery = textInputValue.toLowerCase()

                return possibleSuggestionsArray.filter(function(suggestion)  {
                    return suggestion.text.toLowerCase().includes(lowerCaseQuery)
                })
              }}
              suggestions={autocompleteTags}
              // shouldRenderSuggestions={() => true}
              
            />
            {
              isOpen && (
                <div className='share'>
                  <CopyToClipboard text={isOpen.link}>
                    <img
                      className='clipboard-icon'
                      src={clipboardRawSvg}
                      alt='clipboard-icon'
                      width={32}
                      height={32}
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.success('ссылка скопирована в буфер обмена')
                      }}
                    />
                  </CopyToClipboard>
                  <CopyToClipboard text={`http://${window.location.hostname}:3001/image/${isOpen.id}`}>
                    <img
                      className='clipboard-icon'
                      src={clipboardLinkSvg}
                      alt='clipboard-icon'
                      width={32}
                      height={32}
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.success('ссылка скопирована в буфер обмена')
                      }}
                    />
                  </CopyToClipboard>
                  <CopyToClipboard text={
                    `<img src='${isOpen}' alt='${'image-link'}'/>`
                    }>
                    <img
                      className='clipboard-icon'
                      src={clipboardHtmlSvg}
                      alt='clipboard-icon'
                      width={32}
                      height={32}
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.success('код скопирован в буфер обмена')
                      }}
                    />
                  </CopyToClipboard>
                  <TelegramShareButton url={isOpen.link} onClick={(e) => e.stopPropagation()} >
                    <TelegramIcon round={true} size={32} />
                  </TelegramShareButton>
                  <ViberShareButton url={isOpen.link}  onClick={(e) => e.stopPropagation()}>
                    <ViberIcon round={true} size={32} />
                  </ViberShareButton>
                  <img src={download} width={32} height={32}  onClick={(e) => {e.stopPropagation(); downloadImage(isOpen.link);}}/>
                </div>
              )
            }
          </div>
        </div>
      </Overlay>
      {
        pages === 0 && images?.length === 0 && (
          <div>
            Нет загруженных изображений
          </div>
        )
      }
      {
        <div className='UserImagesWrapper'>
          {
            images?.map(image => (
              <div key={image.id} className='UserImagesElement1'>
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsOpen({id: image.id, link: image.link})
                    setTags(image.tags)
                  }}
                  className='UserImagesImage1'
                  src={image.link}
                  alt=''
                  width={200}
                />
                <div className='user-images-share-image'>
                  <div className='user-image-icons-wrapper'>
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
                    <img className='user-image-download-button' src={download} alt='' width={20} height={20}  onClick={() => downloadImage(image.link)}/>
                  </div>
                  <div className='user-image-icons-wrapper'>
                    <img className='delete-image1' src={trash} alt='' onClick={() => deleteImage(image.id)} />
                    <img
                      className='switch-access-image1'
                      src={image.isPublic?PublicIcon: PrivateIcon}
                      alt=''
                      onClick={() => switchAccess(image.id)}
                    />
                  </div>
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