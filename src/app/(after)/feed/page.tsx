'use client'

import { useActivityHistory } from '@/api/services/recommend/quries'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import { FeedCard } from '@/components/Card/FeedCard'
import Header from '@/components/Header/Header'

export default function Feed() {
  const feed = useActivityHistory({ refetchOnMount: true }).data?.result

  return (
    <>
      {feed ? (
        <div className="flex min-h-screen flex-col gap-[0.625rem] bg-white p-9">
          <Header />

          <div className="flex flex-1 flex-col justify-between gap-[2.25rem]">
            {history.length > 0 &&
              feed.map((item, idx) => <FeedCard key={idx} {...item} />)}
            {history.length === 0 && (
              <div className="flex h-[600px] items-center justify-center font-jalnan text-h4 sm:text-h2">
                기록이 없습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <LoadingAvatar />
      )}
    </>
  )
}
