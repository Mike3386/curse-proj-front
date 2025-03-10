import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import axios from 'axios'
import { useAuthStore } from '../../../authStore'

interface ImageData {
  id: string,
  link: string,
  userId: string,
  user?: {
    email: string,
  }
  tags: [
    {
      id: string,
      name: string
    }
  ]
}

interface UserImagesState {
  imagesData?: ImageData[]
  pages: number
  setImageData: (imageData: ImageData) => void
  loadImages: () => void
  limit: number
  offset: number
  flush: () => void
  currentPage: number,
  setCurrentPage: (page: number) => void
  delete: (id: string) => void
  blockUser: (id: string) => void
}

export interface User {
  id: string,
  email: string,
}

export const useUserImagesStore = create<UserImagesState>()(immer(
    (set, get) => ({
      imagesData: [],
      pages: 0,
      limit: 10,
      offset: 0,
      currentPage: 1,
      setCurrentPage: (page: number) => {
        set({currentPage: page});
        get().loadImages();
      },
      setImageData: (imageData: any) => {
        
      },
      flush:() => {
        set({
          imagesData: [],
          pages: 0,
          limit: 30,
          offset: 0,
        })
      },
      loadImages: () => {
        axios.get(`/admin/images`, {params: {limit: get().limit, offset: (get().currentPage - 1) * get().limit}, headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`
        }})
        .then(res=> {
          set({imagesData: res.data.images, pages: Math.ceil(res.data.count/get().limit)})
        })
      },
      delete: (id: string) => {
        axios.delete(`/admin/images/${id}`, { headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`
        }})
        .then(res=> {
          if (get().imagesData?.length === 1 && get().currentPage !== 1)
            set({currentPage: get().currentPage - 1})
          get().loadImages()
        })
      },
      blockUser: (id: string) => {
        axios.postForm(`/admin/images/users/${id}/block`, {}, { headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`
        }})
        .then(res=> {
          if (get().imagesData?.length === 1 && get().currentPage !== 1)
            set({currentPage: get().currentPage - 1})
          get().loadImages()
        })
      }
    }),
  )
)
