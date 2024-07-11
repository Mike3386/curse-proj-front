import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { toast } from "react-toastify";
import { ImageListType, ImageType } from "react-images-uploading";
import { useLastPublicImagesStore } from "../../last-public-images/store";
import { useAuthStore } from "../../../authStore";

interface ManePageState {
  imageList: ImageListType;
  selectedImageIndex?: number;
  actions: {
    setImageList: (imageList: ImageListType) => void;
    upload: (navigate: any, isUser: boolean) => void;
    setSelectedImage: (index?: number) => void;
    saveUpdatedImage: (data: any) => void;
    resetStore: () => void;
  };
}

export interface User {
  id: string;
  email: string;
}

interface ImageDataUpdated {
  name: string;
  extension: string;
  mimeType: string;
  fullName?: string;
  height?: number;
  width?: number;
  imageBase64?: string;
  imageCanvas?: HTMLCanvasElement; // doesn't support quality
  quality?: number;
  cloudimageUrl?: string;
}

export const useAddImageStore = create<ManePageState>()(
  immer((set, get) => ({
    imageList: [],
    selectedImage: undefined,
    actions: {
      resetStore: () => {
        set({ imageList: [], selectedImageIndex: undefined });
      },
      saveUpdatedImage: (data: ImageDataUpdated) => {
        let images = get().imageList;
        let index = get().selectedImageIndex || 0;
        data.imageBase64 &&
          fetch(data.imageBase64).then(async (data2) => {
            const blobData = await data2.blob();

            images[index] = {
              dataURL: data.imageBase64,
              file: new File([blobData], data.fullName || "", {
                type: blobData.type,
              }),
            };
            set({ imageList: images, selectedImageIndex: undefined });
          });
      },
      setSelectedImage: (index?: number) => {
        console.log(index);
        set({ selectedImageIndex: index });
      },
      setImageList: (imageList: ImageListType) => {
        set({ imageList });
      },
      upload: (navigate: any, isUser) => {
        const data = get().imageList.map((image) => {
          return {
            image: image.file,
          };
        });

        if (data.length === 0) return toast.error("Выберите файл");

        const loadImagePromise = isUser
          ? axios.postForm(
              "/images",
              {
                images: data.map((data) => data.image),
              },
              {
                headers: {
                  Authorization: `Bearer ${useAuthStore.getState().token}`,
                },
              }
            )
          : axios.postForm("/images/image-no-user", {
              image: data[0].image,
            });
        const toastId = toast.loading("Загрузка изображений");

        loadImagePromise
          .then((res) => {
            toast.update(toastId, {
              render: "Картинки загружены, нажмите чтобы увидеть",
              autoClose: false,
              isLoading: false,
              closeButton: true,
              closeOnClick: true,
              type: "success",
              onClick: () => {
                navigate(isUser ? `/images` : `/image/${res.data.id}`);
              },
            });
            set({
              imageList: [],
            });
            useLastPublicImagesStore.getState().actions.load();
            console.log(res.data.privateLink);
          })
          .catch(() => {
            toast.update(toastId, {
              type: "error",
              render: "Картинки не загружены, попробуйте еще раз",
              autoClose: 5000,
              isLoading: false,
              closeButton: true,
              closeOnClick: true,
            });
          });
      },
    },
  }))
);
