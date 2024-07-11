import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { useAuthStore } from "../../../authStore";
import { useLocation } from "wouter";
import { toast } from "react-toastify";

interface Reply {
  id: string;
  commentId: string;
  userId: string;
  text: string;
  user: {
    email: string;
    username: string;
  };
}

interface Comment {
  id: string;
  userId: string;
  imageId: string;
  replies: Reply[];
  text: string;
  user: {
    email: string;
    username: string;
  };
}

interface ImageData {
  id: string;
  link: string;
  favouriteByUsers: any[];
  rate?: number;
  viewCount: number;
  userRating?: number;
  commentsCount: number;
  userId?: string;
  tags: [
    {
      id: string;
      name: string;
    }
  ];
}

interface PublicImageShowState {
  imageData?: ImageData;
  setImageData: (imageData: ImageData) => void;
  loadImage: (imageId: string) => void;
  flush: () => void;
  comments: Comment[];
  listComments: (imageId: string) => void;
  makeFavourite: (imageId: string) => void;
  removeFavourite: (imageId: string) => void;
  setRating: (rate: number, imageId: string) => void;
}

export interface User {
  id: string;
  email: string;
}

export const useMainPageStore = create<PublicImageShowState>()(
  immer((set, get) => ({
    imageData: undefined,
    comments: [],
    setImageData: (imageData: any) => {},
    loadImage: (imageId: string) => {
      axios.get(`images/public/${imageId}`).then((res) => {
        set({ imageData: res.data });
      });
    },
    flush: () => {
      set({ imageData: undefined, comments: [] });
    },
    listComments: (imageId: string) => {
      axios
        .get(`comments/images/${imageId}`, {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        })
        .then((res) => {
          set({ comments: res.data });
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
          const imageData = get().imageData;
          if (!imageData) return;
          imageData.rate = res.data.rate;
          imageData.userRating = rate;
          set({ imageData });
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
          const imageData = get().imageData;
          if (!imageData) return;
          imageData.favouriteByUsers.push({
            id: useAuthStore.getState().authUser?.id,
          });
          set({ imageData });
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
          const imageData = get().imageData;
          if (!imageData) return;
          imageData.favouriteByUsers = imageData.favouriteByUsers.filter(
            (us) => us.id !== useAuthStore.getState().authUser?.id
          );
          set({ imageData });
        });
    },
  }))
);
