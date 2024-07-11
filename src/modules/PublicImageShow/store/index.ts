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
    username: string;
    email: string;
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
  actions: {
    listComments: (imageId: string) => void;
    addComment: (imageId: string, text: string) => void;
    removeComment: (commentId: string) => void;
    editComment: (commentId: string, text: string) => void;
    addReply: (commentId: string, text: string) => void;
    editReply: (replyId: string, text: string) => void;
    removeReply: (replyId: string) => void;
  };
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
    actions: {
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
      addComment: (imageId: string, text: string) => {
        axios
          .postForm(
            `comments/images/${imageId}`,
            { text },
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          )
          .then((res) => {
            get().actions.listComments(get().imageData?.id || "");
          });
      },
      removeComment: (commentId: string) => {
        axios
          .delete(`comments/${commentId}`, {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          })
          .then((res) => {
            get().actions.listComments(get().imageData?.id || "");
          });
      },
      editComment: (commentId: string, text: string) => {
        axios
          .putForm(
            `comments/${commentId}`,
            { text },
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          )
          .then((res) => {
            get().actions.listComments(get().imageData?.id || "");
          });
      },
      addReply: (commentId: string, text: string) => {
        axios
          .postForm(
            `comments/${commentId}/reply`,
            { text },
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          )
          .then((res) => {
            get().actions.listComments(get().imageData?.id || "");
          });
      },
      editReply: (replyId: string, text: string) => {
        axios
          .putForm(
            `replies/${replyId}`,
            { text },
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          )
          .then((res) => {
            get().actions.listComments(get().imageData?.id || "");
          });
      },
      removeReply: (replyId: string) => {
        axios
          .delete(`replies/${replyId}`, {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          })
          .then((res) => {
            get().actions.listComments(get().imageData?.id || "");
          });
      },
    },
  }))
);
