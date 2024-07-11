import React, { useEffect, useState } from 'react'
import { useAddImageStore } from './store';
import { useLocation } from 'wouter';
import './index.css'
import { Button, Rating } from '@mui/material';
import ImageUploading, { ImageListType } from "react-images-uploading";
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';
import Translations from './transl';
import editIcon from '../../svg/edit-svgrepo-com.svg'
import removeIcon from '../../svg/remove-svgrepo-com.svg'
import { useAuthStore } from '../../authStore';
import OverlayFS from '../overlay-fs';

function AddImageComponent() {
  const {imageList, setImageList, upload, selectedImageIndex, resetStore, setSelectedImage, saveUpdatedImage} = useAddImageStore(state => ({
    ...state.actions,
    imageList: state.imageList,
    selectedImageIndex: state.selectedImageIndex,
  }));

  const {isUser} = useAuthStore(state => ({
    isUser: !!state.authUser
  }))

  const [loc, setLocation] = useLocation();

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);

    setImageList(imageList as never[]);
  };

  const closeImgEditor = () => {
    setSelectedImage(undefined)
  }

  const maxNumber = isUser?20:1;

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, []);

  const [showTerms, setShowTerms] = useState(false);

  return (<div className='AddImageComponent'>
    <ImageUploading
        multiple
        value={imageList}
        onChange={onChange}
        maxNumber={maxNumber}
        acceptType={['jpg', 'png']}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          <div className="upload__image-wrapper">
              <div {...dragProps} className='upload-drop2' onClick={onImageUpload}>
                <div className='text'>
                  {isDragging ? "Перетащите сюда" : "Кликните или перетащите"}
                </div>
                <div className='images-content'>
                {imageList.map((image, index) => (
                  <div key={index} className="user-main-page-image-item">
                    <div className='image-wrapper2' onClick={(e) => {
                      e.preventDefault();   
                      e.stopPropagation();
                      onImageUpdate(index)
                    }}>
                      <div className="image-item__btn-wrapper">
                        <img src={removeIcon} className='image-over-icon' onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onImageRemove(index)
                        }} alt=''/>
                        {
                          isUser && <img src={editIcon} className='image-over-icon2' onClick={(e) => {
                              e.preventDefault();   
                              e.stopPropagation();
                              setSelectedImage(index)
                            }
                          } alt=''/>
                        }
                        
                      </div>
                      <img src={image.dataURL} alt="" />
                    </div>
                  </div>
                ))}
                </div>
                
              </div>
            {/* <div
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </div> */}
            &nbsp;
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            <Button variant='contained' onClick={() => {upload(setLocation, isUser)}}>Загрузить</Button>
            <div className='terms'>загружая изображение вы соглашаетесь с <div className='term2' onClick={() => setShowTerms(true)}>условиями</div> пользования сервисом</div>
          </div>
        )}
      </ImageUploading>
      <OverlayFS isOpen={showTerms} isScrolable onClose={() => setShowTerms(false)}>
        {
          <div style={{overflow: 'auto'}}>
              <div>
                При загрузке изображения неавторизированным пользователем, оно будет доступно в течении суток
              </div>
              <div>
                Ваше изображение должно соответствовать правилам, в случае несоблюдения ваше изображение может быть удалено, а ваш аккаунт заблокирован.
              </div>
              <div>
                Правила
              </div>
              <div>
                1: Авторские права: Убедитесь, что у вас есть право загружать и распространять данное изображение. Если вы не являетесь автором изображения, убедитесь, что у вас есть соответствующие лицензии или разрешение от правообладателя.
              </div>
              <div>
                2: Частная жизнь и согласие: Не загружайте изображения, которые нарушают частную жизнь других лиц или не получили согласия от фотографируемых людей, особенно если они находятся в неприличных, непристойных или компрометирующих ситуациях.
              </div>
              <div>
                3: Детская порнография: Загрузка, распространение или публикация детской порнографии является преступлением практически во всех странах мира. Никогда не загружайте изображения, связанные с детской порнографией.
              </div>
              <div>
                4: Незаконное содержание: Избегайте загрузки изображений, содержащих материалы, которые могут быть незаконными в вашей стране или в странах, в которых сервис будет доступен. Это может включать насилие, террористическую пропаганду, расизм, ненависть, клевету и другие незаконные или оскорбительные материалы.
              </div>
              <div>
                5: Авторские метки и разрешения: Если на изображении присутствуют логотипы, товарные знаки или другие авторские метки, убедитесь, что у вас есть разрешение их использовать. Они могут быть защищены авторским правом и требуют соответствующего согласия.
              </div>
              <div>
                6: Закон о защите данных: Соблюдайте законы о защите данных, особенно если изображение содержит персональные данные других лиц. Убедитесь, что у вас есть согласие на сбор, хранение и обработку таких данных.
              </div>
              <div>
                7: Незаконная реклама: Избегайте загрузки изображений, содержащих незаконную рекламу, такую как запрещенные продукты или услуги, мошеннические схемы или незаконные пирамиды.
              </div>
          </div>
        }
      </OverlayFS>
      {
        selectedImageIndex !== undefined && <div className='filerobot-wrapper'>
          <FilerobotImageEditor
          source={imageList[selectedImageIndex].dataURL || ''}
          onSave={(editedImageObject, designState) => {
            console.log('saved', editedImageObject, designState)
            saveUpdatedImage(editedImageObject)
          }}
          onClose={closeImgEditor}

          annotationsCommon={{
            fill: '#ff0000',
          }}
          Text={{ text: ' ' }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          Crop={{
            presetsItems: [
              {
                titleKey: 'classicTv',
                descriptionKey: '4:3',
                ratio: 4 / 3,
                // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
              },
              {
                titleKey: 'cinemascope',
                descriptionKey: '21:9',
                ratio: 21 / 9,
                // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
              },
            ],
          }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE]}
          defaultTabId={TABS.ANNOTATE}
          defaultToolId={TOOLS.TEXT}
          savingPixelRatio={0} previewPixelRatio={0}
          translations={Translations}
          /></div>
      }
  </div>)
}

export default AddImageComponent;