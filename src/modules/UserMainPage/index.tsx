import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useMainPageStore } from './store';
import { shallow } from 'zustand/shallow';
import { useLocation } from 'wouter';
import Button from '@mui/material/Button';
import './index.css';
import LastPublicImages from '../last-public-images';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';
import Translations from './transl';
import { Rating } from "@mui/material";

export default function MainPage() {
  const maxNumber = 20;
  const [path, navigate] = useLocation();

  const {imageList, setImageList, upload, selectedImageIndex, setSelectedImageIndex, saveUpdatedImage} = useMainPageStore(state => ({
    imageList: state.imageList,
    setImageList: state.setImageList,
    upload: state.upload,
    selectedImageIndex: state.selectedImageIndex,
    setSelectedImageIndex: state.setSelectedImage,
    saveUpdatedImage: state.saveUpdatedImage,
  }), shallow)

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);

    setImageList(imageList as never[]);
  };

  const closeImgEditor = () => {
    setSelectedImageIndex(undefined)
  }

  return (
    <div className="user-main-page">
      {/* <ImageUploading
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
              <div {...dragProps} className='upload-drop' onClick={onImageUpload}>
                <div className='text'>
                  {isDragging ? "Перетащите сюда" : "Кликните или перетащите"}
                </div>
                <div className='images-content'>
                {imageList.map((image, index) => (
                  <div key={index} className="user-main-page-image-item">
                    <div className='image-wrapper' onClick={(e) => {
                      e.preventDefault();   
                      e.stopPropagation();
                      setSelectedImageIndex(index)
                    }}>
                      <img src={image.dataURL} alt="" />
                    </div>
                    <div className="image-item__btn-wrapper">
                      <Button variant="outlined" onClick={(e) => {
                        e.preventDefault();   
                        e.stopPropagation();
                        onImageUpdate(index)}
                      }>Изменить</Button>
                      <Button variant="outlined" color="error" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onImageRemove(index)
                      }}>Удалить</Button>
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
            </div>
            &nbsp;
            {/* <button onClick={onImageRemoveAll}>Remove all images</button>
            <Button variant='contained' onClick={() => {upload(navigate)}}>Загрузить</Button>
          </div>
        )}
      </ImageUploading> */}
      <LastPublicImages />
      {/* {
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
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]}
          defaultTabId={TABS.ANNOTATE}
          defaultToolId={TOOLS.TEXT}
          savingPixelRatio={0} previewPixelRatio={0}
          translations={Translations}
          /></div>
      } */}
    </div>
  );
}
