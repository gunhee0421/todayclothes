'use client'

import { coordinate, WeatherResponse } from '@/api/services/weather/model'
import { useTodayWeatherQuery } from '@/api/services/weather/quries'
import { HomeAvatar, LoadingAvatar } from '@/components/Avatar/Avatar'
import Header from '@/components/Header/Header'
import { TodayWeatherInfo, WeatherSave } from '@/components/Info/Weather'
import LocationRequired from '@/components/LocationRequired/LocationRequried'
import NavigationBar from '@/components/NavigationBar/NavigationBar'
import PlansModal from '@/components/Modal/PlansModal'
import { useModal } from '@/hooks/useModal/useModal'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const HomePage = () => {
  const { isVisible, openModal, closeModal } = useModal()
  const [geolocation, setGeolocation] = useState<coordinate | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [navigatorError, setNavigatorError] = useState<boolean>(false)
  const background = useSelector((state: RootState) => state.currentTemp)
  const [city, setCity] = useState<string | null>(null)
  const dispatch = useDispatch()

  const { data: todayWeather, isFetching } = useTodayWeatherQuery(
    geolocation as coordinate,
    {
      enabled: !!geolocation,
      retry: 3,
    },
  )

  // 현재 브라우저 좌표 탐색
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            // lat: position.coords.latitude,
            // lon: position.coords.longitude,
            // 40.690638694267854, -74.04410854678733 뉴욕
            // 33.2627221, 131.3530363 일본
            lat: 33.2627221,
            lon: 131.3530363,
          })
        },
        (error) => {
          setNavigatorError(true)
        },
      )
    }
  }, [geolocation == null])
  // 체감 온도에 해당하는 온도 설정(so_hot, hot...)
  useEffect(() => {
    if (todayWeather) {
      WeatherSave(todayWeather, dispatch)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [todayWeather])

  useEffect(() => {
    const Location = async () => {
      try {
        console.log(geolocation?.lat, geolocation?.lon)
        if (geolocation) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geolocation.lat},${geolocation.lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
          )
          const data = await response.json()

          console.log(data)

          const cityName = data.plus_code.compound_code.split(' ')

          setCity(cityName[cityName.length - 1])
        }
      } catch (error) {
        console.log(error)
      }
    }
    Location()
  }, [geolocation])

  if (navigatorError) {
    return (
      <div className={`flex min-h-screen flex-col gap-9 bg-rose-100 p-9`}>
        <Header />
        <LocationRequired />
        <HomeAvatar />
        <NavigationBar color="so_hot" openModal={openModal} />
      </div>
    )
  }

  return (
    <>
      {!loading && background ? (
        <div
          className={`flex min-h-screen flex-col justify-between p-9 bg-${!loading ? background : 'white'}`}
        >
          <div className="flex flex-col gap-9">
            <Header />
            <TodayWeatherInfo
              todayWeather={todayWeather as WeatherResponse}
              city={city as string}
            />
          </div>
          <HomeAvatar />
          <NavigationBar color={background} openModal={openModal} />
          {isVisible && (
            <PlansModal isVisible={isVisible} closeModal={closeModal} />
          )}
        </div>
      ) : (
        <div>
          <LoadingAvatar />
        </div>
      )}
    </>
  )
}

export default HomePage
