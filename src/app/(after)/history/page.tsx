'use client'

import { useActivityHistory } from '@/api/services/recommend/quries'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import { HistoryCard } from '@/components/Card/Card'
import Header from '@/components/Header/Header'

export default function HistoryPage() {
  const history = useActivityHistory({ refetchOnMount: true }).data?.result

  return (
    <div className="flex min-h-screen flex-col gap-9 overflow-y-scroll bg-white p-9 scrollbar-hide sm:min-w-[600px]">
      {history ? (
        <>
          <Header />
          {history.length > 0 &&
            history.map((item, idx) => <HistoryCard key={idx} {...item} />)}
          {history.length === 0 && (
            <div className="flex h-[600px] items-center justify-center font-jalnan text-h4 sm:text-h2">
              기록이 없습니다.
            </div>
          )}
        </>
      ) : (
        <LoadingAvatar />
      )}
    </div>
  )
}
