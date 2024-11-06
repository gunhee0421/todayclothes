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

export const HomeAvatarCarousel: React.FC<{
  data: weatherSegments[]
  setCurrentTemp: React.Dispatch<SetStateAction<number>>
}> = ({ data, setCurrentTemp }) => {
  const dispatch = useDispatch()

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => {
      setCurrentTemp(next)
      WeatherSave(data[next], dispatch)
    },
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

  const ImageArray = useMemo(() => {
    if (!data) return []
    return data.map((item) => {
      const Array = getImageArray(BackGroundWeather(item.temp))
      return Array[Math.floor(Math.random() * Array.length)]
    })
  }, [])

  return (
    <Slider {...settings}>
      {ImageArray.map((item) => (
        <HomeAvatar RandomImage={item} />
      ))}
    </Slider>
  )
}
