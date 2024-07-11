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
  ViberIcon

} from 'react-share';
import { WithContext as ReactTags } from 'react-tag-input';

import CopyToClipboard, {} from 'react-copy-to-clipboard'

import clipboardHtmlSvg from './copy-to-clipboard/html.svg'
import clipboardLinkSvg from './copy-to-clipboard/link.svg'
import clipboardRawSvg from './copy-to-clipboard/raw.svg'
import { toast } from 'react-toastify';
import download from '../menu/images-from-search/download-svgrepo-com.svg'
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { CommentSection } from '../react-comments-section'
import 'react-comments-section/dist/index.css'
import ScrollToTop from 'react-scroll-to-top';
import { useAuthStore } from '../../authStore';

import UserIcon from '../../svg/user-svgrepo-com.svg';
import CommentIcon from '../../svg/comment.svg';
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
  selectedImage,
  setSelectedTags,
  selectedTags,
  makeFavourite,
  removeFavourite,
  setRating,
  setComments,
}: any) {
  // const [match, params] = useRoute("/image/:imageId");
  const {
    imageData,
    loadImage,
    flush,
    listComments,
    comments,
    addComment,
    addReply,
    editComment,
    editReply,
    removeComment,
    removeReply,
  } = useMainPageStore(state => ({
    imageData: state.imageData,
    loadImage: state.loadImage,
    flush: state.flush,
    ...state.actions,
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
  }), shallow)

        // userId: string;
        // comId: string;
        // fullName: string;
        // avatarUrl: string;
        // text: string;
        // userProfile?: string;
        // replies?: Array<{
        //     userId: string;
        //     comId: string;
        //     fullName: string;
        //     avatarUrl: string;
        //     text: string;
        //     userProfile?: string;
        // }> | undefined;
  const {authUser} = useAuthStore(state => ({
    authUser: state.authUser
  }))



  const imageId = selectedImage.id;
  useEffect(() => {
    if (selectedImage.id) {
      loadImage(selectedImage.id);
      listComments(selectedImage.id);
    }
    return () => {
      flush()
    }
  }, [imageId])
  
  const imgRef = useRef<any>();
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    const { current: img } = imgRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      (img as HTMLImageElement).style.setProperty("transform", value);
    }
  }, []);

  return (
    <div className="public-main-image">
      {/* <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={500}> */}
      <div className='imageWrapperPucblicMainImage'>
        <img className={'image'} ref={imgRef} src={imageData?.link} alt={'loading'}/>
        <div className='side-panel' onClick={e => e.stopPropagation()}>
          {
            <>
              {authUser && imageData &&
                  <FavouriteToggle
                    isFavourite={!!selectedImage.favouriteByUsers.find((us: any) => us.id === authUser.id)}
                    onClick={() => {
                      if (selectedImage.favouriteByUsers.find((us: any) => us.id === authUser.id)) removeFavourite(imageData.id);
                      else makeFavourite(imageData.id);
                      // loadImage()

                    }}
                  />
              }
              {
                imageData && <UserRating
                  currentRate={selectedImage.rate}
                  onRatingClick={(rate) => {
                    setRating(rate, selectedImage.id)
                  }}
                  isBlocked={selectedImage.userId === authUser?.id}
                  defaultRating={selectedImage.userRating}
                />
              }
            </>
          }
        </div>
      </div>
      {/* </QuickPinchZoom> */}

      {
        imageData && (
          <div onClick={(e) => e.stopPropagation()} style={{textTransform: 'capitalize'}}>
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
            handleTagClick={(i) => {
              setSelectedTags && selectedTags && setSelectedTags([...selectedTags, imageData.tags[i]])
            }}
            
          />
          </div>
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
                onClick={(e) => {
                  e.stopPropagation()
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
                onClick={(e) => {
                  e.stopPropagation()
                  toast.success('код скопирован в буфер обмена')
                }}
              />
            </CopyToClipboard>
            <TelegramShareButton url={imageData.link} onClick={(e) => e.stopPropagation()} >
              <TelegramIcon round={true} size={32} />
            </TelegramShareButton>
            <ViberShareButton url={imageData.link}  onClick={(e) => e.stopPropagation()}>
              <ViberIcon round={true} size={32} />
            </ViberShareButton>
            <img src={download} width={32} height={32}  onClick={(e) => {e.stopPropagation(); downloadImage(imageData.link);}}/>
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
          currentUser={{
            currentUserId: authUser?.id || '',
            currentUserFullName: authUser?.username || '',
            currentUserImg: `https://ui-avatars.com/api/?name=${authUser?.username}`,
            currentUserProfile: '',
          }}
          hrStyle={{ border: '0.5px solid #ff0072' }}
          commentData={comments}
          currentData={(data: any) => {            
            setComments(imageData.id, data.length)
          }}
          logIn={{
            loginLink:'',
            signupLink:''
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
          onDeleteAction={(data: {
            comIdToDelete: string,
            parentOfDeleteId: string
          }) => {
            if (data.parentOfDeleteId) {
              removeReply(data.comIdToDelete)
            } else removeComment(data.comIdToDelete)
          }}
          onSubmitAction={(data: {
            userId: string
            comId: string
            avatarUrl: string
            userProfile?: string
            fullName: string
            text: string
            replies: any
            commentId: string
          }) => {
            addComment(imageData.id, data.text);
          }}
          onReplyAction={(data: {
            userId: string
            parentOfRepliedCommentId: string
            repliedToCommentId: string
            avatarUrl: string
            userProfile?: string
            fullName: string
            text: string
          }) => {
            addReply(data.repliedToCommentId, data.text)
          }}
          onEditAction={(data: {
            userId: string
            comId: string
            avatarUrl: string
            userProfile?: string
            fullName: string
            text: string
            parentOfEditedCommentId: string
          }) => {
            if (data.parentOfEditedCommentId) {
              editReply(data.comId, data.text)
            }
            else editComment(data.comId, data.text)
          }}
          advancedInput={true}
          replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
        />
      </div>
      }
      <ScrollToTop smooth />
    </div>
  );
}

export default PublicImageShow
