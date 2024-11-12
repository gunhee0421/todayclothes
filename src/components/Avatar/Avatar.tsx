'use client'

import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  freshImage,
  coldImage,
  so_coldImage,
  so_hotImage,
  hotImage,
  cloudImage,
} from './AvatarImg'
import Image from 'next/image'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { weatherSegments } from '../Date/getRecommendData'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { BackGroundWeather, WeatherSave } from '../Info/Weather'
import { WeatherResponse } from '@/api'

export const HomeAvatar: React.FC<{ RandomImage: string }> = ({
  RandomImage,
}) => {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      {RandomImage ? (
        <Image
          src={RandomImage}
          alt="캐릭터 아바타"
          height={150}
          width={50}
          className="h-full w-full"
        />
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      {RandomImage && (
        <Image
          src={RandomImage}
          alt="Avatar"
          width={200}
          height={450}
          style={{ height: '60vh' }}
        />
      )}
      <p className="text-center align-middle font-notosanko text-[12px] font-bold sm:text-[24px]">
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
