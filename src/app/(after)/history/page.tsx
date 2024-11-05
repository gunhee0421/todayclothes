'use client'

import { ActivityStyle, ActivityType, Feedback } from '@/api'
import { useActivityHistory } from '@/api/services/recommend/quries'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import { HistoryCard } from '@/components/Card/Card'
import Header from '@/components/Header/Header'

export default function HistoryPage() {
  // const history = useActivityHistory({ refetchOnMount: true }).data?.result

  const history = {
    code: 200,
    message: '200',
    result: [
      {
        clothesId: 4,
        imgPath: null,
        myImgPaths: [],
        location: 'Seoul',
        review: null,
        type: ActivityType.Outdoor,
        style: ActivityStyle.Amekaji,
        weather: 3,
        wind: 3.5,
        rain: 0.0,
        humidity: 60.5,
        feelsLike: 18.5,
        temp: 20.0,
      },
      {
        clothesId: 3,
        imgPath: null,
        myImgPaths: [],
        location: 'Seoul',
        review: null,
        type: ActivityType.Outdoor,
        style: ActivityStyle.Casual,
        weather: 3,
        wind: 3.5,
        rain: 0.0,
        humidity: 60.5,
        feelsLike: 18.5,
        temp: 20.0,
      },
      {
        clothesId: 2,
        imgPath: null,
        myImgPaths: [
          'https://todayclothes-file.s3.ap-northeast-2.amazonaws.com/reviews/3182d7dd-c884-41eb-b0ea-42c775bf2b2eKakaoTalk_20240829_172303219.png',
          'https://todayclothes-file.s3.ap-northeast-2.amazonaws.com/reviews/726ac7e9-25bc-4cf3-b1a4-584d78de0139%ED%99%94%EB%A9%B4%20%EC%BA%A1%EC%B2%98%202024-09-17%20030637.jpg',
        ],
        location: 'Seoul',
        review: {
          feedback: Feedback.Perfect,
        },
        type: ActivityType.Indoor,
        style: ActivityStyle.BusinessCasual,
        weather: 3,
        wind: 3.5,
        rain: 0.0,
        humidity: 60.5,
        feelsLike: 18.5,
        temp: 20.0,
      },
      {
        clothesId: 1,
        imgPath: null,
        myImgPaths: [
          'https://todayclothes-file.s3.ap-northeast-2.amazonaws.com/reviews/b6774e2b-ff3a-4420-9399-e0d9a49b623dKakaoTalk_20240829_172303219.png',
        ],
        location: 'Seoul',
        review: {
          feedback: Feedback.Too_Hot,
        },
        type: ActivityType.Outdoor,
        style: ActivityStyle.Minimal,
        weather: 3,
        wind: 3.5,
        rain: 0.0,
        humidity: 60.5,
        feelsLike: 18.5,
        temp: 20.0,
      },
    ],
  }.result

  return (
    <>
      {history ? (
        <div className="flex min-h-screen flex-col gap-9 p-9">
          <div>
            <Header />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-6">
            {history.length > 0 &&
              history.map((item, idx) => <HistoryCard key={idx} {...item} />)}
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
