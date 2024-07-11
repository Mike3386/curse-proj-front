import React, { useEffect, useState } from 'react'
import { useLastPublicImagesStore } from './store';
import { useLocation } from 'wouter';
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from '../LoadingSpinner';
import UserRating from '../Rating';
import ScrollToTop from 'react-scroll-to-top';
import Views from '../Views';
import FavouriteToggle from '../Favourite-toggle';
import { useAuthStore } from '../../authStore';
import { Tag, useSearchStore } from '../menu/state';
import OverlayFS from '../overlay-fs';
import PublicImageShow from '../PublicImageShow';
import { Box, Autocomplete, TextField, Checkbox, Select, MenuItem, SelectChangeEvent, Icon } from '@mui/material';
import search from '../menu/icons8-search.svg';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CommentIcon from '../../svg/comment.svg';
import CommentsCount from '../commentsCount';
import SortIcon from '../../svg/sort.svg';
import OneIcon from '../../svg/one.svg';
import AllIcon from '../../svg/all.svg';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


function LastPublicImages() {
  const {
    searchTypeMain, 
    setComments,
    changeSearchType,
    load,
    setRating,
    images,
    fullCount,
    reset,
    loadMore,
    makeFavourite,
    removeFavourite
  } = useLastPublicImagesStore(state => ({
    ...state.actions,
    images: state.imageList,
    fullCount: state.fullCount,
    searchTypeMain: state.searchType
  }));

  const {id, isAuthUser, user} = useAuthStore(state => ({
    id: state.authUser?.id,
    isAuthUser: !!state.authUser,
    user: state.authUser,
  }))

  const [isLoading, setIsLoading] = useState(false);

  const [location, setLocation] = useLocation();

  useEffect(() => {
    // setIsLoading(true)
    // !images.length && !isLoading && load()

    return () => {
      reset()
    }
  }, [])

  const {searchType, setSearchType, setFilter, fetchTags, filter, tagsAutoComplete, selectedTags, setSelectedTags, isLoadingTags} = useSearchStore(state => ({
    setFilter: state.setTagFilterText,
    fetchTags: state.getTags,
    filter: state.tagFilterText,
    tagsAutoComplete: state.tags,
    selectedTags: state.selectedTags,
    setSelectedTags: state.setSelectedTags,
    isLoadingTags: state.isLoadingTags,
    searchType: state.searchType,
    setSearchType: state.setSearchType,
  }))

  const [selectedImage, setSelectedImage] = useState<any>()

  useEffect(() => {
    load()
  }, [selectedTags.length]);

  return (<div className='LastPublicImages'>
    {
            !user?.isAdmin && (location === '' || location === '/') && (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Box sx={{
                // marginLeft: 'auto',
                // marginRight: 'auto',
                display: 'flex',
                flexDirection: 'row',
                textTransform: 'capitalize',
                minWidth: '250px',
                maxWidth: '250px',
                width: '100%'
              }}>
            <img src={search} alt='' width={'30px'} height={'30px'} style={{marginRight: '5px'}}/>
            <Autocomplete
              renderOption={(props, option, { selected }) => (
                <li {...props} onClick={(e) => {
                      if (!selectedTags.find(tag => tag.id === option.id)) setSelectedTags([...selectedTags, option])
                      else setSelectedTags(selectedTags.filter(tag => tag.id !== option.id));
                    }}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={!!selectedTags.find(tag => tag.id === option.id)}
                  />
                  {option.name}
                </li>
              )}              
              id="size-small-outlined"
              loading={isLoadingTags}
              multiple
              disableCloseOnSelect
              size="small"
              noOptionsText={isLoadingTags && !tagsAutoComplete.length ? 'поиск тегов' : 'введите фильтр'}
              options={tagsAutoComplete}
              value={selectedTags}
              getOptionLabel={(option: Tag) => option.name}
              onOpen={() => fetchTags()}
              onChange={(e, value) => setSelectedTags(value)}
              autoCapitalize=''
              isOptionEqualToValue={(opt, val) => opt.name.toLowerCase() === val.id.toLowerCase()}
              classes={{
                popper: 'popper-custom'
              }}
              style={{
                width: '100%'
              }}
              
              ListboxProps={{
                style: {
                  minWidth: '200px',
                  textTransform: 'capitalize'
                }
              }}
              limitTags={5}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={'autocomplete-input-component'}
                  onChange={(e: any) => {
                    setFilter(e.target.value)
                    // fetchTags()
                  }}
                  value={filter}
                  variant="standard"
                  placeholder="Тэг"
                />
              )}
            />
            {
              <div className='search-mode' onClick={() => {
                setSearchType(!searchType)
                load()
              }}>
                <img src={searchType? AllIcon : OneIcon} alt=''/>
              </div>
            }
          </Box>
          <Box>
            <img src={SortIcon} alt='' height={20} width={20}/>
            <Select
              sx={{
                color:'white'
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchTypeMain}
              onChange={(event: SelectChangeEvent) => {
                changeSearchType(event.target.value as any);
              }}
              defaultValue={'uploadedAt'}
            >
              <MenuItem value={'uploadedAt'}>Загружено</MenuItem>
              <MenuItem value={'viewCount'}>Просмотры</MenuItem>
              <MenuItem value={'rate'}>Оценки</MenuItem>
            </Select>
          </Box>
          </Box>
          )
        }
    <InfiniteScroll
      className='infinite-scroll-public-images'
      dataLength={images.length} //This is important field to render the next data
      next={loadMore}
      hasMore={fullCount>images.length}
      loader={<LoadingSpinner/>}
      endMessage={images.length === 0 ? 'нет доступных изображений': 'вы долистали до конца'}
    >
      <OverlayFS isScrolable isOpen={!!selectedImage} onClose={() => {setSelectedImage(undefined)}}>
        <PublicImageShow setComments={setComments} setRating={setRating} makeFavourite={makeFavourite} removeFavourite={removeFavourite} selectedImage={selectedImage} setSelectedTags={setSelectedTags} selectedTags={selectedTags} />
      </OverlayFS>
      <div className='LastPublicImages'>
        {
          images.map(image => (
            <div key={image.id} className='LastPublicImages-preview'>
              <img src={image.link} alt='' onClick={() => {setSelectedImage(image)}} />
              <div className='control-bar'>
                <Views viewsCount={image.viewCount} />
                {
                  isAuthUser && <FavouriteToggle isFavourite={!!image.favouriteByUsers.find(us => us.id === id)} onClick={() => {
                    if (image.favouriteByUsers.find(us => us.id === id)) removeFavourite(image.id);
                    else makeFavourite(image.id);
                  }} />
                }
                <CommentsCount count={image.commentsCount} />
                <UserRating
                  currentRate={image.rate}
                  onRatingClick={(rate) => {
                    setRating(rate, image.id)
                  }}
                  isBlocked={image.userId === id}
                  defaultRating={image.userRating}
                />
              </div>
            </div>
          ))
        }
      </div>
      <ScrollToTop smooth />
    </InfiniteScroll>
  </div>)
}

export default LastPublicImages;
