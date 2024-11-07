import { SetStateAction, useMemo, useRef } from 'react'
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
  const imageArray = [data.imgPath, ...data.myImgPaths].filter(Boolean)

  const settings = {
    dots: true,
    infinite: imageArray.length > 1,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => {
      // 슬라이드 이동 후 포커스를 현재 활성 슬라이드에만 유지
      const slides = document.querySelectorAll('.slick-slide')
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== index ? 'true' : 'false')
        slide.toggleAttribute('inert', i !== index)
      })
    },
  }

  return (
    <Slider {...settings}>
      {imageArray.map((imgSrc, index) => (
        <div key={index} className="flex h-[50vh] items-center justify-center">
          <Image
            src={imgSrc || ''}
            alt={`Image ${index + 1}`}
            height={150}
            width={50}
            className="h-full w-full"
          />
        </div>
      ))}
    </Slider>
  )
}
