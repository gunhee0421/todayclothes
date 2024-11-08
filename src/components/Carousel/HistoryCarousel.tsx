import Slider from 'react-slick'
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
  }

  return (
    <Slider {...settings}>
      {imageArray.map((imgSrc, index) => (
        <div key={index} className="flex h-[50vh] items-center justify-center">
          <Image
            src={imgSrc || ''}
            alt={`Image ${index + 1}`}
            height={500}
            width={500}
            className="h-full w-full"
          />
        </div>
      ))}
    </Slider>
  )
}
