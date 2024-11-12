'use client'

import { useActivityFeed } from '@/api/services/recommend/quries'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import { FeedCard } from '@/components/Card/FeedCard'
import Header from '@/components/Header/Header'
import { RootState } from '@/redux/store'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

export default function Feed() {
  const language = useSelector((state: RootState) => state.language)
  const size = 5
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivityFeed({ refetchOnMount: true }, size)

  const feed = data?.pages.flatMap((page) => page.result) || []

  // IntersectionObserver 설정
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 },
    )

    observer.observe(observerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, fetchNextPage])

  if (isLoading) {
    return <LoadingAvatar />
  }

  return (
    <>
      {feed ? (
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
            {/* 다음 페이지 로드를 위한 관찰 대상 요소 */}
            <div ref={observerRef} />
            {isFetchingNextPage && <LoadingAvatar />}
          </div>
        </div>
      ) : (
        <LoadingAvatar />
      )}
    </>
  )
}
