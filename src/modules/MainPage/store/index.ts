import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { toast } from "react-toastify";
import { ImageListType } from "react-images-uploading";
import { useLastPublicImagesStore } from "../../last-public-images/store";

interface ManePageState {
  imageList: ImageListType;
  setImageList: (imageList: ImageListType) => void;
  upload: (navigate: any) => void;
}

export interface User {
  id: string;
  email: string;
}

export const useMainPageStore = create<ManePageState>()(
  immer((set, get) => ({
    imageList: [],
    setImageList: (imageList: ImageListType) => {
      set({ imageList });
    },
    upload: (navigate: any) => {
      const data = get().imageList.map((image) => {
        return {
          image: image.file,
        };
      });

      if (data.length === 0) return toast.error("Выберите файл");

      const loadImagePromise = axios.postForm("/images/image-no-user", {
        image: data[0].image,
      });

      const toastId = toast.loading("Загрузка изображения");

      loadImagePromise
        .then((res) => {
          console.log(res);
          toast.update(toastId, {
            render: "Картинка загружена, нажмите чтобы увидеть",
            autoClose: false,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
            type: "success",
            onClick: () => {
              navigate(`/image/${res.data.id}`);
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
            render: "Картинка не загружена, попробуйте еще раз",
            autoClose: 5000,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
          });
        });
    },
  }))
);
