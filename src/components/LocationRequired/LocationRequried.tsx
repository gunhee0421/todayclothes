import { RootState } from '@/redux/store'
import { X } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import { useSelector } from 'react-redux'

const LocationRequired: React.FC<{
  setClick: React.Dispatch<SetStateAction<boolean>>
}> = ({ setClick }) => {
  const language = useSelector((state: RootState) => state.language)

  return (
    <div className="flex h-[120px] w-full flex-shrink-0 items-center justify-center rounded-[8px] bg-white shadow-md">
      {language === 'ko' ? (
        <div className="font-notosanko text-[24px] font-bold">
          <div className="flex flex-row items-center justify-between">
            <p>
              <span className="font-toss">📍</span> 위치 정보가 필요합니다.
            </p>
            <X size={25} onClick={() => setClick(true)} />
          </div>
          <p className="text-[22px] font-medium">
            날씨 정보를 확인하려면 위치 사용에 동의해주세요.
          </p>
        </div>
      ) : (
        <div className="font-notosanko text-[22px] font-bold">
          <span className="font-toss">📍</span> Location Access Required
          <p className="text-[18px] font-medium">
            Please enable location services for weather information.
          </p>
        </div>
      )}
    </div>
  )
}

export default LocationRequired
