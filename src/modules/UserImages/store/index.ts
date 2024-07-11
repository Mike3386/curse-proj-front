import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { useAuthStore } from "../../../authStore";
import { useLocation } from "wouter";
import { toast } from "react-toastify";

interface ImageData {
  id: string;
  link: string;
  isPublic: boolean;
  tags: [
    {
      id: string;
      name: string;
    }
  ];
}

interface UserImagesState {
  imagesData?: ImageData[];
  pages: number;
  setImageData: (imageData: ImageData) => void;
  loadImages: () => void;
  limit: number;
  offset: number;
  flush: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  delete: (id: string) => void;
  switchAccess: (imageId: string) => void;
  addTag: (imageId: string, text: string) => void;
  removeTag: (imageId: string, id: string) => void;
  getAutocompleteTags: () => void;
  autocompleteTags: any[];
}

export interface User {
  id: string;
  email: string;
}

export const useUserImagesStore = create<UserImagesState>()(
  immer((set, get) => ({
    imagesData: [],
    pages: 0,
    limit: 10,
    offset: 0,
    currentPage: 1,
    autocompleteTags: [],
    getAutocompleteTags: () => {
      axios
        .get(`/tags/autocomplete`, {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        })
        .then((res) => {
          set({ autocompleteTags: res.data });
        });
    },
    addTag: (imageId, text) => {
      const imgData = get().imagesData;
      const image = imgData?.find((img) => img.id === imageId);
      if (!image) return;
      if (
        image.tags.find((tag) => tag.name.toLowerCase() === text.toLowerCase())
      )
        return toast.warning(
          "Тэг с таким текстом уже есть у этого изображения"
        );
      axios
        .post(`/images/${imageId}/tags`, [{ name: text }], {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        })
        .then((res) => {
          const imgData = get().imagesData;
          const image = imgData?.find((img) => img.id === imageId);
          if (!image) return;

          //@ts-ignore
          res.data.length && image.tags.push(res.data[0] as any);
          set({ imagesData: imgData });
        });
    },
    removeTag: (imageId, id) => {
      axios
        .delete(`/images/${imageId}/tags/${id}`, {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        })
        .then((res) => {
          const imgData = get().imagesData;
          const image = imgData?.find((img) => img.id === imageId);
          if (!image) return;
          //@ts-ignore
          image.tags = image.tags.filter((tag) => tag.id !== id);
          set({ imagesData: imgData });
        });
    },
    setCurrentPage: (page: number) => {
      set({ currentPage: page });
      get().loadImages();
    },
    setImageData: (imageData: any) => {},
    flush: () => {
      set({
        imagesData: [],
        pages: 0,
        limit: 10,
        offset: 0,
      });
    },
    loadImages: () => {
      axios
        .get(`/images`, {
          params: {
            limit: get().limit,
            offset: (get().currentPage - 1) * get().limit,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        })
        .then((res) => {
          set({
            imagesData: res.data.images,
            pages: Math.ceil(res.data.count / get().limit),
          });
        });
    },
    delete: (id: string) => {
      const deleteToast = toast.error(
        "Вы уверены в удалении изображения, нажмите чтобы удалить",
        {
          closeOnClick: false,
        }
      );
      toast.update(deleteToast, {
        onClick: () => {
          toast.dismiss(deleteToast);
          axios
            .delete(`/images/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            })
            .then((res) => {
              if (get().imagesData?.length === 1 && get().currentPage !== 1)
                set({ currentPage: get().currentPage - 1 });
              get().loadImages();
            });
        },
      });
    },
    switchAccess: (imageId: string) => {
      const images = get().imagesData;
      const image = images?.find((image) => image.id === imageId);

      if (!image) return;

      axios
        .putForm(
          `/images/${imageId}/${image.isPublic ? "private" : "public"}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          }
        )
        .then((res) => {
          image.isPublic = !image.isPublic;
          set({ imagesData: images });
        });
    },
  }))
);
