import { FC, useEffect, useState } from 'react';
import { getCurrentTab, getYTVideoId } from '../helpers';
import { Bookmark } from '../types';
import BookmarkRow from './BookmarkRow';

const BookmarksList:FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isYT, setIsYT] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log({bookmarks, isYT, loading})
  useEffect(()=>{
    (async ()=>{
      
       const tab = await getCurrentTab();
       const videoId = getYTVideoId(tab?.url || "");
       const isYT = !!tab?.url?.includes("youtube.com/watch") && !!videoId;
       setIsYT(isYT)
       setLoading(false);

       if (isYT) {
        const storageResponse = await chrome.storage.sync.get([videoId]);
        const videoBookmarks:Bookmark[] = JSON.parse(storageResponse[videoId] || "[]");
        setBookmarks(videoBookmarks);
       }
       
    })()
  }, [])

  if(loading){
    return <div>Loading...</div>
  }
  if(!isYT){
    return <div>Isn't youtube video page</div>
  }
  if(!bookmarks.length){
    return <div>Bookmarks not found</div>
  }

  return (
    <ul>
      {bookmarks.map(bookmark=>(
        <BookmarkRow bookmark={bookmark} key={bookmark.time} />
      ))}
    </ul>
  )
}

export default BookmarksList