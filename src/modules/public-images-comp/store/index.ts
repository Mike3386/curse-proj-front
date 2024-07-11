import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../authStore";

interface ImageList {
  id: string;
  link: string;
  name: string;
  privateLink: string;
  publicId: string;
  tags: [
    {
      id: string;
      name: string;
    }
  ];
}

interface LastPublicImagesState {
  imageList: ImageList[];
  actions: {
    setImageList: (imageList: ImageList[]) => void;
    load: () => void;
  };
}

export const useLastPublicImagesStore = create<LastPublicImagesState>()(
  immer((set, get) => ({
    imageList: [],
    actions: {
      setImageList: (imageList: ImageList[]) => {
        set({ imageList });
      },
      load: () => {
        axios
          .get("/images/last-public-images", {
            params: { amount: 10, offset: 0 },
          })
          .then((res) => {
            set({ imageList: res.data.images });
          });
      },
    },
  }))
);
