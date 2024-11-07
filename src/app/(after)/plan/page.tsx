'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useForm, Controller } from 'react-hook-form'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ko'
import 'dayjs/locale/en'
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from 'react-google-places-autocomplete'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { useWeatherContext } from '@/providers/WeatherProvider'
import { ActivityStyle, ActivityType } from '@/api'
import { translateActivityStyle } from '@/components/Info/translation'
import { DatePicker } from '@mui/x-date-pickers'
import { useState, useEffect } from 'react'
import { geocodeByLatLng } from 'react-google-places-autocomplete'
import {
  Gender,
  PlaceCoordinates,
  TimeOfDay,
} from '@/api/services/recommend/model'

type Language = 'en' | 'ko'

interface Option {
  label: string
  value: {
    place_id: string
  }
}

interface FormValues {
  activityType: ActivityType.Indoor | ActivityType.Outdoor | null
  activityStyle: ActivityStyle | null
  startTime: Dayjs | null
  selectedPlace: Option | null
  placeCoordinates: PlaceCoordinates // 수정된 부분
  gender: Gender | null
  timeOfDay: TimeOfDay | null // 수정된 부분
}

const Plan: React.FC = () => {
  const language = useSelector((state: RootState) => state.language) as Language
  const router = useRouter()
  const weatherData = useWeatherContext()
  const today = dayjs()
  const selectableDates = [
    today,
    today.add(1, 'day'),
    today.add(2, 'day'),
    today.add(3, 'day'),
  ]
  const isDateSelectable = (date: Dayjs | null) => {
    return selectableDates.some((d) => d.isSame(date, 'day'))
  }

  const { control, handleSubmit, setValue, reset, watch } = useForm<FormValues>(
    {
      defaultValues: {
        activityType: ActivityType.Indoor, // 기본값: 실내
        activityStyle: ActivityStyle.Casual, // 기본값: 캐주얼
        startTime: dayjs(), // 기본값: 현재 시간
        selectedPlace: null,
        placeCoordinates: { lat: null, lon: null },
        gender: Gender.Female, // 기본값: 여성
        timeOfDay: TimeOfDay.Morning, // 기본값: 아침
      },
    },
  )

  const activityStyles = [
    ActivityStyle.Casual,
    ActivityStyle.Sporty,
    ActivityStyle.Business,
    ActivityStyle.Formal,
    ActivityStyle.Street,
    ActivityStyle.Outdoor,
  ]

  const watchedValues = watch([
    'activityType',
    'activityStyle',
    'startTime',
    'selectedPlace',
  ])

  const isFormValid = watchedValues.every((value) => value !== null)

  // Google Maps API 로드 확인 함수
  const isGoogleMapsLoaded = () =>
    typeof window !== 'undefined' &&
    typeof window.google !== 'undefined' &&
    typeof window.google.maps !== 'undefined'

  // 현재 위치 정보를 가져오는 함수
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          // 기본값으로 좌표를 먼저 설정
          setValue('placeCoordinates', {
            lat: latitude,
            lon: longitude,
          })

          // Google Maps API가 로드되었는지 확인 후에만 geocodeByLatLng 호출
          if (latitude && longitude && isGoogleMapsLoaded()) {
            try {
              // 좌표를 사용하여 주소를 가져오기
              const results = await geocodeByLatLng({
                lat: latitude,
                lng: longitude,
              })

              if (results.length > 0) {
                const address = results[0]
                setValue('selectedPlace', {
                  label: address.formatted_address,
                  value: { place_id: address.place_id },
                })
              }
            } catch (error) {
              console.error('Error fetching address:', error)
            }
          } else {
            console.error('Google Maps API is not loaded.')
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const handlePlaceChange = async (newValue: Option | null) => {
    setValue('selectedPlace', newValue)

    const placeId = newValue?.value?.place_id
    if (placeId) {
      const results = await geocodeByPlaceId(placeId)

      if (results[0]?.geometry?.location) {
        setValue('placeCoordinates', {
          lat: results[0].geometry.location.lat(),
          lon: results[0].geometry.location.lng(),
        })
      }
    } else {
      console.error('Invalid placeId:', placeId)
    }
  }

  const handleLog = (data: FormValues) => {
    const { activityType, activityStyle, startTime } = data
    const now = dayjs()

    weatherData.setWeatherData({
      location: {
        lat: data.placeCoordinates.lat || 0,
        lon: data.placeCoordinates.lon || 0,
      },
      startTime: data.startTime?.format('YYYY-MM-DDTHH:mm:ss') || '',
      type: data.activityType,
      style: data.activityStyle,
      timezone: data.timeOfDay as TimeOfDay,
      gender: data.gender as Gender,
    })
    router.push('/recommend')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-[600px] rounded-[16px] p-[32px]">
        <h2 className="mb-[36px] text-center font-notosanko text-[20px] font-semibold leading-normal tracking-[-0.1px]">
          {language === 'ko'
            ? '오늘의 주요 일정을 입력해주세요.'
            : 'What are your main plans for today?'}
        </h2>

        <form onSubmit={handleSubmit(handleLog)}>
          {/* Activity Location */}
          <div>
            <label className="font-notosanko text-[12px] font-medium leading-normal text-zinc-400">
              {language === 'ko' ? '활동 장소' : 'Activity Location'}
            </label>
            <div className="w-[536px] pb-[40px] pt-[8px]">
              <Controller
                name="selectedPlace"
                control={control}
                render={({ field }) => (
                  <GooglePlacesAutocomplete
                    selectProps={{
                      value: field.value,
                      onChange: handlePlaceChange,
                      placeholder:
                        language === 'ko'
                          ? '활동 장소를 선택해주세요.'
                          : 'Enter activity location.',
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          height: '3rem',
                          backgroundColor: 'rgb(241 241 244)',
                          border: '0px solid',
                          borderRadius: '8px',
                          color: '#3C4350',
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: '#3C4350',
                        }),
                      },
                    }}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
                  />
                )}
              />
            </div>
          </div>

          {/* Activity Time */}
          <label className="w-full font-notosanko text-[12px] font-medium leading-normal text-zinc-400">
            {language === 'ko' ? '활동 시간' : 'Activity Time'}
          </label>
          <div className="flex pb-[40px] pt-[8px]">
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={language === 'ko' ? 'ko' : 'en'} // Set locale dynamically
                >
                  <DatePicker
                    {...field}
                    value={field.value || dayjs()} // Default to today's date if not set
                    disablePast
                    shouldDisableDate={(date) => !isDateSelectable(date)}
                    sx={{
                      backgroundColor: 'rgb(241, 241, 244)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '100%',
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </div>

          {/* Time of Day */}
          <div>
            <label className="font-notosanko text-[12px] font-medium leading-normal text-zinc-400">
              {language === 'ko' ? '활동 시간대' : 'Time of Day'}
            </label>
            <Controller
              name="timeOfDay"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-[8px] pb-[40px] pt-[8px]">
                  {[
                    TimeOfDay.Morning,
                    TimeOfDay.Afternoon,
                    TimeOfDay.Evening,
                    TimeOfDay.Night,
                  ].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => field.onChange(time)}
                      className={`rounded-[16px] px-2 py-4 font-notosanko font-medium ${
                        field.value === time
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {language === 'ko'
                        ? time === TimeOfDay.Morning
                          ? '아침'
                          : time === TimeOfDay.Afternoon
                            ? '낮'
                            : time === TimeOfDay.Evening
                              ? '저녁'
                              : '밤'
                        : time}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div>
            <label className="font-notosanko text-[12px] font-medium leading-normal text-zinc-400">
              {language === 'ko' ? '성별' : 'Gender'}
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex gap-[16px] pb-[40px] pt-[8px]">
                  <button
                    type="button"
                    onClick={() => field.onChange(Gender.Female)}
                    className={`flex-1 rounded-[16px] px-2 py-4 font-notosanko font-medium ${
                      field.value === Gender.Female
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {language === 'ko' ? '여성' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange(Gender.Male)}
                    className={`flex-1 rounded-[16px] px-2 py-4 font-notosanko font-medium ${
                      field.value === Gender.Male
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {language === 'ko' ? '남성' : 'Male'}
                  </button>
                </div>
              )}
            />
          </div>

          <div>
            <label className="font-notosanko text-[12px] font-medium leading-normal text-zinc-400">
              {language === 'ko' ? '활동 종류' : 'Activity Type'}
            </label>
            <Controller
              name="activityType"
              control={control}
              render={({ field }) => (
                <div className="flex gap-[16px] pb-[40px] pt-[8px]">
                  <button
                    type="button"
                    onClick={() => field.onChange(ActivityType.Indoor)}
                    className={`flex-1 rounded-[16px] px-2 py-4 font-notosanko font-medium ${
                      field.value === ActivityType.Indoor
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {language === 'ko' ? '실내' : 'Indoors'}
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange(ActivityType.Outdoor)}
                    className={`flex-1 rounded-[16px] px-2 py-4 font-notosanko font-medium ${
                      field.value === ActivityType.Outdoor
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {language === 'ko' ? '실외' : 'Outdoors'}
                  </button>
                </div>
              )}
            />
          </div>

          <div>
            <label className="font-notosanko text-[12px] font-medium leading-normal text-zinc-400">
              {language === 'ko' ? '활동 분위기' : 'Activity Style'}
            </label>
            <Controller
              name="activityStyle"
              control={control}
              render={({ field }) => (
                <div className="mb-[36px] grid grid-cols-2 gap-[8px] gap-x-[16px] pt-[8px]">
                  {activityStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => field.onChange(style)}
                      className={`rounded-[16px] px-2 py-4 font-notosanko font-medium ${
                        field.value === style
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {translateActivityStyle(style, language)}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-[12px]">
            <button
              type="button"
              onClick={() => router.push('/home')}
              className="flex-1 rounded-[8px] bg-red-100 py-2 font-notosanko text-red-600"
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={`flex-1 rounded-[8px] py-2 font-notosanko text-white ${
                !isFormValid ? 'bg-gray-300' : 'bg-red-500'
              }`}
              disabled={!isFormValid}
            >
              {language === 'ko' ? '생성' : 'Generate'}
            </button>
          </div>
        </form>

        {/* Toast container for notifications */}
        <ToastContainer />
      </div>
    </div>
  )
}

export default Plan
