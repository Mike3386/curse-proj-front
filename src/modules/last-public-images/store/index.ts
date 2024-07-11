import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../authStore";
import { useSearchStore } from "../../menu/state";

interface ImageList {
  id: string;
  link: string;
  name: string;
  privateLink: string;
  publicId: string;
  rate?: number;
  viewCount: number;
  userRating?: number;
  favouriteByUsers: any[];
  userId?: string;
  commentsCount: number;
  tags: [
    {
      id: string;
      name: string;
    }
  ];
}

interface LastPublicImagesState {
  imageList: ImageList[];
  fullCount: number;
  searchType: "uploadedAt" | "viewCount" | "rate";
  actions: {
    setComments: (imageId: string, commentsCount: number) => void;
    setImageList: (imageList: ImageList[]) => void;
    load: () => void;
    loadMore: () => void;
    setRating: (rate: number, imageId: string) => void;
    reset: () => void;
    makeFavourite: (imageId: string) => void;
    removeFavourite: (imageId: string) => void;
    changeSearchType: (type: "uploadedAt" | "viewCount" | "rate") => void;
  };
}

export const useLastPublicImagesStore = create<LastPublicImagesState>()(
  immer((set, get) => ({
    imageList: [],
    fullCount: 0,
    searchType: "uploadedAt",
    actions: {
      setComments(imageId: string, commentsCount: number) {
        const imgData = get().imageList;
        const img = imgData.find((img) => img.id === imageId);
        if (!img) return;
        img.commentsCount = commentsCount;
        set({ imageList: imgData });
      },
      changeSearchType(type) {
        set({ searchType: type });
        get().actions.load();
      },
      reset: () => {
        set({
          imageList: [],
          fullCount: 0,
        });
      },
      setImageList: (imageList: ImageList[]) => {
        set({ imageList });
      },
      load: () => {
        console.log(useSearchStore.getState().searchType);
        axios
          .get("/images/last-public-images", {
            params: {
              limit: 20,
              offset: 0,
              type: Number(useSearchStore.getState().searchType),
              email: useAuthStore.getState().authUser?.email,
              tags: useSearchStore.getState().selectedTags || [],
              searchType: get().searchType,
            },
          })
          .then((res) => {
            set({ imageList: res.data.images, fullCount: res.data.amount });
          });
      },
      loadMore: () => {
        console.log(useSearchStore.getState().searchType);
        axios
          .get("/images/last-public-images", {
            params: {
              limit: 20,
              offset: get().imageList.length,
              type: Number(useSearchStore.getState().searchType),
              email: useAuthStore.getState().authUser?.email,
              tags: useSearchStore.getState().selectedTags || [],
              searchType: get().searchType,
            },
          })
          .then((res) => {
            const fitered = res.data.images.filter(
              (el: ImageList) => !get().imageList.find((i) => i.id === el.id)
            );
            set({
              imageList: get().imageList.concat(fitered),
              fullCount: res.data.amount,
            });
          });
      },
      setRating: (rate: number, imageId: string) => {
        axios
          .putForm(
            `/images/${imageId}/rate`,
            {},
            {
              params: { rate },
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          )
          .then((res) => {
            const images = get().imageList;
            const image = images.find((el) => el.id === imageId);
            if (!image) return;

            image.rate = res.data.rate;
            image.userRating = rate;
            set({ imageList: images });
          });
      },
      makeFavourite: (imageId: string) => {
        axios
          .putForm(
            `/images/${imageId}/favourite`,
            {},
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          )
          .then((data) => {
            const images = get().imageList;
            const img = images.find((img) => img.id === imageId);
            if (!img) return;
            img.favouriteByUsers.push({
              id: useAuthStore.getState().authUser?.id,
            });
            set({ imageList: images });
          });
      },
      removeFavourite: (imageId: string) => {
        axios
          .delete(`/images/${imageId}/favourite`, {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          })
          .then((data) => {
            const images = get().imageList;
            const img = images.find((img) => img.id === imageId);
            if (!img) return;
            img.favouriteByUsers = img.favouriteByUsers.filter(
              (us) => us.id !== useAuthStore.getState().authUser?.id
            );
            set({ imageList: images });
          });
      },
    },
  }))
);
