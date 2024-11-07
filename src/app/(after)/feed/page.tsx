'use client'

import { useActivityFeed } from '@/api/services/recommend/quries'
import { FeedCard } from '@/components/Card/FeedCard'
import Header from '@/components/Header/Header'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export default function Feed() {
  const language = useSelector((state: RootState) => state.language)
  const size = 5
  const { data } = useActivityFeed({ refetchOnMount: true }, size)

  const feed = data?.pages.flatMap((page) => page.result) || []

  return (
    <div className="flex min-h-screen flex-col gap-[0.625rem] bg-white p-9">
      <Header />

      <div className="flex flex-1 flex-col justify-between gap-[2.25rem]">
        {feed.length > 0 ? (
          feed.map((item, idx) => <FeedCard key={idx} {...item} />)
        ) : (
          <div className="flex h-[600px] items-center justify-center font-jalnan text-h4 sm:text-h2">
            {language === 'ko' ? '기록이 없습니다.' : 'No records.'}
          </div>
        )}
      </div>
    </div>
  )
}
