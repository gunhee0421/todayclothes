import { RootState } from '@/redux/store'
import { X } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import { useSelector } from 'react-redux'

const LocationRequired: React.FC<{
  setClick: React.Dispatch<SetStateAction<boolean>>
}> = ({ setClick }) => {
  const language = useSelector((state: RootState) => state.language)

  return (
    <>
      {language === 'ko' ? (
        <div className="flex h-full w-full flex-col rounded-[4px] bg-white px-3 py-2 font-notosanko text-[0.75rem] font-bold shadow-md sm:rounded-[8px] sm:px-6 sm:py-4 sm:text-[24px]">
          <div className="flex flex-row items-center justify-between">
            <p>
              <span className="font-toss">📍</span> 위치 정보가 필요합니다.
            </p>
            <X
              size={12}
              onClick={() => setClick(true)}
              className="cursor-pointer sm:size-6"
            />
          </div>
          <p className="text-[0.625rem] font-bold sm:text-[22px]">
            날씨 정보를 확인하려면 위치 사용에 동의해주세요.
          </p>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col rounded-[4px] bg-white px-3 py-2 font-notosanko text-[0.75rem] font-bold shadow-md sm:rounded-[8px] sm:px-6 sm:py-4 sm:text-[24px]">
          <div className="flex flex-row items-center justify-between">
            <p>
              <span className="font-toss">📍</span> Location Access Required
            </p>
            <X
              size={12}
              onClick={() => setClick(true)}
              className="cursor-pointer sm:size-6"
            />
          </div>
          <p className="text-[0.5rem] font-bold sm:text-[1rem]">
            Please enable location services for weather information.
          </p>
        </div>
      )}
    </>
  )
}

export default LocationRequired
