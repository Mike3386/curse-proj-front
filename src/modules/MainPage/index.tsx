import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useMainPageStore } from './store';
import { shallow } from 'zustand/shallow';
import { useLocation } from 'wouter';
import Button from '@mui/material/Button';
import './index.css';
import LastPublicImages from '../last-public-images';

export default function MainPage() {
  const maxNumber = 1;
  const [path, navigate] = useLocation();

  const {imageList, setImageList, upload} = useMainPageStore(state => ({
    imageList: state.imageList,
    setImageList: state.setImageList,
    upload: state.upload
  }), shallow)

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);

    setImageList(imageList as never[]);
  };

  return (
    <div className="App">
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
          // write your building UI
          <div className="upload__image-wrapper">
              <div {...dragProps} className='upload-drop' onClick={onImageUpload}>
                {isDragging ? "Drop here please" : "Кликните или перетащите"}
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.dataURL} alt="" width="200" />
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
            {/* <div
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </div> */}
            &nbsp;
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            <Button variant='contained' onClick={() => {upload(navigate)}}>Загрузить</Button>
          </div>
        )}
      </ImageUploading>
      <LastPublicImages />
    </div>
  );
}
