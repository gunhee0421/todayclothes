'use client'

import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import {
  freshImage,
  coldImage,
  so_coldImage,
  so_hotImage,
  hotImage,
  cloudImage,
} from './AvatarImg'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { clearTimeout } from 'timers'

export const HomeAvatar = () => {
  const temp = useSelector((data: RootState) => data.currentTemp)

  const getImageArray = () => {
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

  const imageArray = getImageArray()

  const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)]

  return (
    <div className="flex h-full flex-shrink items-center justify-center sm:px-[2rem] sm:py-[1.25rem] md:px-[3rem] md:py-[1.75rem] lg:px-[4rem] lg:py-[2.5rem] xl:px-[6rem] xl:py-[3rem] 2xl:px-[8rem] 2xl:py-[5rem]">
      {randomImage ? (
        <Image src={randomImage} alt="Avatar" width={200} height={450} />
      ) : (
        <p>No Image</p>
      )}
    </div>
  )
}
export const LoadingAvatar = () => {
  const language = useSelector((state: RootState) => state.language)

  const imageArray = [
    ...so_hotImage,
    ...hotImage,
    ...freshImage,
    ...cloudImage,
    ...coldImage,
    ...so_coldImage,
  ]
  const RandomImage = useMemo(() => {
    const image = imageArray[Math.floor(Math.random() * imageArray.length)]
    return image
  }, [])

  return (
    <div className="flex flex-col items-center justify-end pt-[10vh]">
      {RandomImage && (
        <Image
          src={RandomImage}
          alt="Avatar"
          width={200}
          height={450}
          style={{ height: '60vh' }}
        />
      )}
      <p className="text-center align-middle font-notosanko text-[24px] font-bold">
        {language === 'en' ? (
          <>
            Generating styles...
            <br />
            Please wait a moment.
          </>
        ) : (
          <>
            오늘의 옷장에서 옷을 찾고 있어요.
            <br />
            조금만 기다려주세요!
          </>
        )}
      </p>
      <div className="mt-12 flex space-x-2">
        <div className="h-4 w-4 animate-dot rounded-full bg-gray-500 opacity-0 delay-100" />
        <div className="h-4 w-4 animate-dot rounded-full bg-gray-500 opacity-0 delay-200" />
        <div className="h-4 w-4 animate-dot rounded-full bg-gray-500 opacity-0 delay-300" />
      </div>
    </div>
  )
}
