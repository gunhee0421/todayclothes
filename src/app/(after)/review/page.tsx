import { Suspense } from 'react'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import ReviewComponent from '@/components/Review/Review'

const Review = () => {
  return (
    <Suspense fallback={<LoadingAvatar />}>
      <ReviewComponent />
    </Suspense>
  )
}

export default Review
