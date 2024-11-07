import { activityHistoryInfo } from '@/api/services/recommend/model'
import React from 'react'
import { HistoryWeatherInfo } from '../Info/Weather'
import { HistoryAvatarCarousel } from '../Carousel/HistoryCarousel'
import { FeedCarousel } from '../Carousel/FeedCarousel'

export const FeedCard: React.FC<activityHistoryInfo> = (props) => {
  return (
    <div className="flex flex-1 flex-col justify-between gap-[0.75rem]">
      <HistoryWeatherInfo {...props} />
      <HistoryAvatarCarousel data={props} />
    </div>
  )
}
