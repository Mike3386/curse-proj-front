import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useRoute } from 'wouter';
import { useMainPageStore } from './store';
import { shallow } from 'zustand/shallow';
import Overlay from '../overlay-fs';
import './index.css'
import {
  TelegramShareButton,
  ViberShareButton,
  TelegramIcon,
  ViberIcon,

} from 'react-share';
import { WithContext as ReactTags } from 'react-tag-input';

import CopyToClipboard, {} from 'react-copy-to-clipboard'

import clipboardHtmlSvg from './copy-to-clipboard/html.svg'
import clipboardLinkSvg from './copy-to-clipboard/link.svg'
import clipboardRawSvg from './copy-to-clipboard/raw.svg'
import { toast } from 'react-toastify';
import download from '../menu/images-from-search/download-svgrepo-com.svg'
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { CommentSection } from '../react-comments-section';
import { useAuthStore } from '../../authStore';
import FavouriteToggle from '../Favourite-toggle';
import UserRating from '../Rating';

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

function PublicImageShow({
  // selectedImage
}: any) {
  const [match, params] = useRoute("/image/:imageId");
  const {makeFavourite, removeFavourite, setRating, imageData, loadImage, flush, comments, listComments} = useMainPageStore(state => ({
    imageData: state.imageData,
    loadImage: state.loadImage,
    flush: state.flush,
    makeFavourite: state.makeFavourite,
    removeFavourite: state.removeFavourite,
    setRating: state.setRating,
    comments: state.comments.map(comment => (
      {
        userId: comment.userId,
        comId: comment.id,
        fullName: comment.user.username,
        avatarUrl: `https://ui-avatars.com/api/?name=${comment.user.username}`,
        text: comment.text,
        replies: comment.replies.map((reply) => ({
            userId: reply.userId,
            comId: reply.id,
            fullName: reply.user.username,
            avatarUrl: `https://ui-avatars.com/api/?name=${reply.user.username}`,
            text: reply.text,
        }))
      }
    )),
    listComments: state.listComments,
  }), shallow)
  
  const {authUser} = useAuthStore(state => ({
    authUser: state.authUser
  }))

  const imageId = params?.imageId;
  useEffect(() => {
    if (imageId) {
      loadImage(imageId)
      listComments(imageId)
    }
    return () => {
      flush()
    }
  }, [imageId])
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    // e.stopPropagation()
    setIsOpen(!isOpen);
  };

  const imgRef = useRef<any>();
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    const { current: img } = imgRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      (img as HTMLImageElement).style.setProperty("transform", value);
    }
  }, []);

  return (
    <div className="public-main-image2">
      <div  className='imageWrapperPucblicMainImage'>
        <div className='side-panel' onClick={e => e.stopPropagation()}>
          {
            <>
              {authUser && imageData &&
                  <FavouriteToggle
                    isFavourite={!!imageData.favouriteByUsers.find((us: any) => us.id === authUser.id)}
                    onClick={() => {
                      if (imageData.favouriteByUsers.find((us: any) => us.id === authUser.id)) removeFavourite(imageData.id);
                      else makeFavourite(imageData.id);
                    }}
                  />
              }
              {
                imageData && <UserRating
                  currentRate={imageData.rate}
                  onRatingClick={(rate) => {
                    setRating(rate, imageData.id)
                  }}
                  isBlocked={imageData.userId === authUser?.id}
                  defaultRating={imageData.userRating}
                />
              }
            </>
          }
        </div>
      </div>
      <img className={'image'} src={imageData?.link}  onClick={toggleOverlay} alt={'loading'}/>

      <Overlay isOpen={isOpen} onClose={toggleOverlay}>
        <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={500}>
          <img ref={imgRef} className='public-main-image-overlay-image' src={imageData?.link} alt={'loading'} />
        </QuickPinchZoom>
      </Overlay>
      {
        imageData && (
          <ReactTags
            tags={imageData.tags.map(tag => ({id: tag.id, text: tag.name}))}
            // suggestions={suggestions}
            // delimiters={delimiters}
            handleDelete={()=> {}}
            handleAddition={() => {}}
            // handleDrag={handleDrag}
            // handleTagClick={handleTagClick}
            // autocomplete
            readOnly
            handleTagClick={() => {}}
          />
        )
      }
      {
        imageData && (
          <div className='share'>
            <CopyToClipboard text={imageData.link}>
              <img
                className='clipboard-icon'
                src={clipboardRawSvg}
                alt='clipboard-icon'
                width={32}
                height={32}
                onClick={() => {
                  toast.success('ссылка скопирована в буфер обмена')
                }}
              />
            </CopyToClipboard>
            <CopyToClipboard text={`http://${window.location.hostname}:3001/image/${imageData.id}`}>
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
              `<img src='${imageData?.link}' alt='${'image-link'}'/>`
              }>
              <img
                className='clipboard-icon'
                src={clipboardHtmlSvg}
                alt='clipboard-icon'
                width={32}
                height={32}
                onClick={() => {
                  toast.success('код скопирован в буфер обмена')
                }}
              />
            </CopyToClipboard>
            <TelegramShareButton url={imageData.link} >
              <TelegramIcon round={true} size={32} />
            </TelegramShareButton>
            <ViberShareButton url={imageData.link}>
              <ViberIcon round={true} size={32} />
            </ViberShareButton>
            <img src={download} width={32} height={32}  onClick={() => downloadImage(imageData.link)}/>
          </div>
        )
      }
      {
        imageData && <div className='comments-wrapper' onClick={(e) => e.stopPropagation()}>
        <CommentSection
          customNoComment={() => {
            return <div className='no-comDiv'>Еще нету комментариев, будь первым</div>
          }}
          commentsCount={comments.length}
          overlayStyle={{
            backgroundColor: 'white'
          }}
          currentUser={authUser ? {
            currentUserId: authUser?.id || '',
            currentUserFullName: authUser?.username || '',
            currentUserImg: `https://ui-avatars.com/api/?name=${authUser?.username}`,
            currentUserProfile: '',
          }: null}
          hrStyle={{ border: '0.5px solid #ff0072' }}
          commentData={comments}
          currentData={(data: any) => {
            console.log('curent data', data)
          }}
          logIn={{
            loginLink:'/sign-in',
            signupLink:'/sign-up'
          }}
          
          // customImg='https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=60'
          inputStyle={{ border: '1px solid rgb(208 208 208)' }}
          formStyle={{ backgroundColor: 'white' }}
          submitBtnStyle={{
            border: '1px solid black',
            backgroundColor: 'black',
            padding: '7px 15px'
          }}
          cancelBtnStyle={{
            border: '1px solid gray',
            backgroundColor: 'gray',
            color: 'white',
            padding: '7px 15px'
          }}
          advancedInput={true}
          replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
        />
      </div>
      }
    </div>
  );
}

export default PublicImageShow
