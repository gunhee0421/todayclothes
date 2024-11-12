'use client'

import { WeatherResponse } from '@/api'
import { formatDate } from '../Date/formatDate'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useTranslate } from '@/hooks/useTranslate/useTranslate'
import { setTemp } from '@/redux/slice/CurrentTempSlice'
import { activityHistoryInfo } from '@/api/services/recommend/model'
import { translateActivityStyle, translateActivityType } from './translation'
import { getWeatherDescription } from './condition'
import { weatherSegments } from '../Date/getRecommendData'

type Language = 'en' | 'ko'

export const WeatherSave = (data: weatherSegments, dispatch: any) => {
  const temp = data.temp

  if (temp >= 29) {
    dispatch(setTemp('so_hot'))
  } else if (22 <= temp && temp < 29) {
    dispatch(setTemp('hot'))
  } else if (15 <= temp && temp < 22) {
    dispatch(setTemp('fresh'))
  } else if (9 <= temp && temp < 15) {
    dispatch(setTemp('cloud'))
  } else if (1 <= temp && temp < 9) {
    dispatch(setTemp('cold'))
  } else {
    dispatch(setTemp('so_cold'))
  }
}
export const BackGroundWeather = (temp: number) => {
  if (temp >= 29) {
    return 'so_hot'
  } else if (22 <= temp && temp < 29) {
    return 'hot'
  } else if (15 <= temp && temp < 22) {
    return 'fresh'
  } else if (9 <= temp && temp < 15) {
    return 'cloud'
  } else if (1 <= temp && temp < 9) {
    return 'cold'
  } else {
    return 'so_cold'
  }
}

export const TodayWeatherInfo: React.FC<{
  todayWeather: weatherSegments
  city: string
  index: number
}> = ({ todayWeather, city, index }) => {
  const language = useSelector((state: RootState) => state.language)
  const { translatedText, translate } = useTranslate()

  // 날씨 정보 호출 후, 언어 번역
  useEffect(() => {
    if (city !== null) {
      translate(city, 'en')
    }
  }, [city])

  return (
    <div className="flex h-[97px] w-full max-w-lg content-center items-start self-stretch">
      {
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-col gap-[0.5rem]">
            <h1 className="font-notosanko text-[1.5rem] font-medium transition-all duration-500 sm:text-weatherTitle">
              {language !== 'ko' && translatedText
                ? translatedText[0]?.translations[0]?.text
                : city}
            </h1>
            <p className="font-notosanko text-[0.8rem] text-weatherSubColor sm:text-weatherSub">
              {formatDate(language)}
            </p>
            <span className="font-notosanko text-[1rem] font-[500] sm:text-weatherTem">
              {language !== 'ko' && todayWeather.timeOfDay
                ? todayWeather.timeOfDay.en
                : todayWeather.timeOfDay?.ko || ''}
            </span>
          </div>
          <div className="flex flex-col items-end justify-center gap-[0.5rem]">
            <h1 className="text-right font-notosanko text-[1.05rem] font-bold transition-all duration-500 sm:text-[1.5rem]">
              {index == 0 ? (
                <>
                  {language == 'en' ? 'Low: ' : '최저: '}{' '}
                  {Math.round(todayWeather.minTemp)}°C{' '}
                  <span className="">/</span>{' '}
                  {language == 'en' ? 'High:' : '최고: '}
                  {Math.round(todayWeather.maxTemp)}°C
                </>
              ) : (
                <>
                  {language == 'en' ? 'Temp: ' : '온도: '} {todayWeather.temp}°C
                </>
              )}
            </h1>
            <p className="font-notosanko text-[0.8rem] font-semibold text-weatherSpanColor transition-all duration-500 sm:text-weatherSpan">
              {language == 'en' ? 'Feels Like:' : '체감온도:'}{' '}
              {todayWeather.feels_like}°C
            </p>
            <p className="text-right font-notosanko text-[0.8rem] text-gray-700 transition-all duration-500 sm:text-[1rem]">
              <span className="font-toss">🌧️</span>{' '}
              {Math.round(todayWeather.rain * 100)}%{' '}
              <span className="font-toss">💧</span>{' '}
              {Math.round(todayWeather.hydrate)}%{' '}
              <span className="font-toss">💨</span>{' '}
              {Math.round(todayWeather.wind * 3.6)}
              km/h
            </p>
          </div>
        </div>
      }
    </div>
  )
}

// HistoryWeatherInfo에 따른 Info 컴포넌트
export const HistoryWeatherInfo: React.FC<activityHistoryInfo> = (props) => {
  const language = useSelector((state: RootState) => state.language) as Language
  const { translatedText, translate } = useTranslate()
  const { description, emoji } = getWeatherDescription(props.weather, language)

  useEffect(() => {
    if (props.location && language == 'ko') {
      translate(props.location, 'en')
    }
  }, [props, language])

  return (
    <div className="flex h-fit w-full max-w-lg content-center items-start self-stretch">
      <div className="flex w-full flex-row justify-between font-notosanko">
        <div className="flex flex-col gap-[0.5rem]">
          <h1 className="font-notosanko text-[1.5rem] font-medium sm:text-weatherTitle">
            {language !== 'ko' && translatedText
              ? translatedText[0]?.translations[0]?.text
              : props.location}
          </h1>
          <span className="font-notosanko text-[0.8rem] text-weatherSubColor sm:text-weatherSub">
            {formatDate(language)}
          </span>
          <span className="font-notosanko text-[1rem] sm:text-weatherTem">
            {translateActivityType(props.type, language)},{' '}
            {translateActivityStyle(props.style, language)}
          </span>
        </div>
        <div className="flex flex-col items-end justify-center gap-[0.5rem]">
          <h1 className="text-right font-notosanko text-[1.05rem] font-bold transition-all duration-500 sm:text-[1.5rem]">
            <span className="font-toss">{emoji}</span> {Math.round(props.temp)}
            °C ({description})
          </h1>
          <p className="font-notosanko text-[0.8rem] font-semibold text-weatherSpanColor sm:text-weatherSpan">
            {language === 'en' ? 'Feels Like: ' : '체감온도: '}{' '}
            {Math.round(props.feelsLike)}°C
          </p>
          <p className="text-right font-notosanko text-[0.8rem] text-gray-700 sm:text-[1rem]">
            <span className="font-toss">🌧️</span> {Math.round(props.rain * 100)}
            % <span className="font-toss">💧</span> {Math.round(props.humidity)}
            % <span className="font-toss">💨</span>{' '}
            {Math.round(props.wind * 3.6)}
            km/h
          </p>
        </div>
      </div>
    </div>
  )
}
