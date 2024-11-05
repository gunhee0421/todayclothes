import { SetStateAction, useMemo } from 'react'
import { weatherSegments } from '../Date/getRecommendData'
import { useDispatch } from 'react-redux'
import { BackGroundWeather, WeatherSave } from '../Info/Weather'
import {
  cloudImage,
  coldImage,
  freshImage,
  hotImage,
  so_coldImage,
  so_hotImage,
} from '../Avatar/AvatarImg'
import Slider from 'react-slick'
import { HomeAvatar } from '../Avatar/Avatar'
import { activityHistoryInfo } from '@/api/services/recommend/model'
import Image from 'next/image'

export const HistoryAvatarCarousel: React.FC<{
  data: activityHistoryInfo
}> = ({ data }) => {
  const dispatch = useDispatch()

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const getImageArray = (temp: string) => {
    if (temp == null) return so_hotImage
    switch (temp) {
      case 'fresh':
        return freshImage
      case 'cloud':
        return cloudImage
      case 'so_hot':
        return so_hotImage
      case 'hot':
        return hotImage
      case 'cold':
        return coldImage
      case 'so_cold':
        return so_coldImage
      default:
        return []
    }
  }

  const ImageArray = ['', '', '', '']

  return (
    <Slider {...settings}>
      {ImageArray.map((item) => (
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <Image
            src={item}
            alt="캐릭터 아바타"
            height={150}
            width={50}
            className="h-full w-full"
          />
        </div>
      ))}
    </Slider>
  )
}
