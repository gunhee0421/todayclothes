'use client'

import { useActivityHistory } from '@/api/services/recommend/quries'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import { HistoryCard } from '@/components/Card/Card'
import Header from '@/components/Header/Header'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export default function HistoryPage() {
  const language = useSelector((state: RootState) => state.language)
  const history = useActivityHistory('/event', { refetchOnMount: true }).data
    ?.result

  return (
    <>
      {history ? (
        <div className="flex min-h-screen flex-col gap-9 bg-white p-9">
          <div>
            <Header />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-6">
            {history.length > 0 &&
              history.map((item, idx) => <HistoryCard key={idx} {...item} />)}
            {history.length === 0 && (
              <div className="flex h-[600px] items-center justify-center font-jalnan text-h4 sm:text-h2">
                {language === 'ko' ? '기록이 없습니다.' : 'No records.'}
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
