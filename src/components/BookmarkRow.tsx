import React, { FC } from 'react'
import { Bookmark } from '../types'

const BookmarkRow:FC<{bookmark: Bookmark}> = ({bookmark}) => {
  return (
    <li>
      {bookmark.time} - {bookmark.desc}
    </li>
  )
}

export default BookmarkRow