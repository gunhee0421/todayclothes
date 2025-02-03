// WeatherProvider.tsx
'use client'

import { ActivityStyle, ActivityType } from '@/api'
import { Gender, TimeOfDay } from '@/api/services/recommend/model'
import React, { createContext, ReactNode, useContext, useState } from 'react'

// WeatherData 타입 정의
type WeatherData = {
  location: {
    lat: number
    lon: number
  } | null
  startTime?: string
  endTime?: string
  type: ActivityType | null
  style: ActivityStyle | null
  timezone: TimeOfDay
  gender: Gender
}

// WeatherContext와 Provider 생성
const WeatherContext = createContext({
  weatherData: null as WeatherData | null,
  setWeatherData: (data: WeatherData) => {},
})

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData }}>
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeatherContext = () => useContext(WeatherContext)
