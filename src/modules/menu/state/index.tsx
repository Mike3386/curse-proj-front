import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import axios from 'axios'
import { useAuthStore } from '../../../authStore'
import {useLocation} from 'wouter'
import { toast } from 'react-toastify'

export interface Tag {
  id: string,
  name: string,
}

interface Image {

}

interface SearchState {
  tags: Tag[]
  selectedTags: Tag[]
  setSelectedTags: (tags: Tag[]) => void
  images: Image[]
  getTags: () => void
  tagFilterText: string,
  setTagFilterText: (text: string) => void
  isLoadingTags: boolean,
  searchType: boolean,
  setSearchType: (type: boolean) => void,
}


export const useSearchStore = create<SearchState>()(immer(
    (set, get) => ({
      searchType: false,
      setSearchType: (type: boolean) => {
        set({searchType: type});
      },
      tags: [],
      selectedTags: [],
      images: [],
      tagFilterText: '',
      isLoadingTags: false,
      getTags: () => {
        set({isLoadingTags: true});
        axios.get(`/tags/autocomplete`, {params: {
          // selectedIds: get().selectedTags.map(tag => tag.id),
          name: get().tagFilterText}, headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`
        }})
        .then(res=> {
          set({tags: res.data})
        })
        .finally(() => {
          set({isLoadingTags: false});
        })
      },
      setTagFilterText: (text: string) => {
        set({tagFilterText: text})
      },
      setSelectedTags: (tags: Tag[]) => {
        set({selectedTags: tags})
      }
    }),
  )
)
