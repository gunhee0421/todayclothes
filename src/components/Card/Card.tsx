import { activityHistoryInfo } from '@/api/services/recommend/model'
import React from 'react'
import { HistoryWeatherInfo } from '../Info/Weather'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Pencil } from 'lucide-react'
import { useActivityReview } from '@/api/services/recommend/quries'
import { useModal } from '@/hooks/useModal/useModal'
import ReviewModal from '../Modal/ReviewModal'
import { HistoryAvatarCarousel } from '../Carousel/HistoryCarousel'

type Language = 'en' | 'ko'

const getReviewEmoji = (review?: string) => {
  if (review === 'PERFECT') {
    return '👍'
  } else if (review === 'HOT') {
    return '🥵'
  } else if (review === 'COLD') {
    return '🥶'
  }
  return null
}

const getReviewFeedback = (
  review?: 'PERFECT' | 'HOT' | 'COLD',
  language: Language = 'en',
) => {
  const feedbacks = {
    en: {
      PERFECT: 'Perfect',
      HOT: 'Too Hot',
      COLD: 'Too Cold',
    },
    ko: {
      PERFECT: '완벽함',
      HOT: '너무 더움',
      COLD: '너무 추움',
    },
  }

  return review ? feedbacks[language][review] : null
}

export const HistoryCard: React.FC<activityHistoryInfo> = (props) => {
  const language = useSelector((state: RootState) => state.language) as Language
  const reviewEmoji = getReviewEmoji(props.review?.feedback)
  const { isVisible, openModal, closeModal } = useModal()

  const handleOnClick = () => {
    openModal()
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-6">
      <HistoryWeatherInfo {...props} />
      <HistoryAvatarCarousel data={props} />
      <div className="mt-2 flex items-center justify-between rounded-[16px] bg-zinc-100 p-4 font-notosanko text-[16px] sm:mt-4">
        {props.review?.feedback ? (
          <span className={`${props.review?.feedback ? 'text-zinc-400' : ''}`}>
            {language === 'en' ? 'Written Review' : '작성된 리뷰'}
          </span>
        ) : (
          <span>{language === 'en' ? 'Write Review' : '리뷰 작성하기'}</span>
        )}
        {props.review?.feedback ? (
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {getReviewFeedback(props.review?.feedback, language)}
            </span>
            <span className="font-toss text-[1.5rem]">{reviewEmoji}</span>
          </div>
        ) : (
          <Pencil
            className="cursor-pointer"
            onClick={handleOnClick}
            size={20}
          />
        )}
      </div>

      {isVisible && (
        <>
          <ReviewModal
            clothesId={props.clothesId.toString()}
            isVisible={isVisible}
            closeModal={closeModal}
          />
        </>
      )}
    </div>
  )
}
