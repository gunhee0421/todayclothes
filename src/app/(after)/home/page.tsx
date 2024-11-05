'use client'

import { coordinate, WeatherResponse } from '@/api/services/weather/model'
import { useTodayWeatherQuery } from '@/api/services/weather/quries'
import { LoadingAvatar } from '@/components/Avatar/Avatar'
import Header from '@/components/Header/Header'
import { TodayWeatherInfo, WeatherSave } from '@/components/Info/Weather'
import LocationRequired from '@/components/LocationRequired/LocationRequried'
import NavigationBar from '@/components/NavigationBar/NavigationBar'
import PlansModal from '@/components/Modal/PlansModal'
import { useModal } from '@/hooks/useModal/useModal'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getRecommendData,
  getTimeData,
  weatherSegments,
} from '@/components/Date/getRecommendData'
import { HomeAvatarCarousel } from '@/components/Carousel/HomeCarousel'

const HomePage = () => {
  const { isVisible, openModal, closeModal } = useModal()
  const [geolocation, setGeolocation] = useState<coordinate | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [navigatorError, setNavigatorError] = useState<boolean>(false)
  const background = useSelector((state: RootState) => state.currentTemp)
  const [weatherSegments, setWeatherSegments] = useState<
    weatherSegments[] | []
  >([])
  const [city, setCity] = useState<string | null>(null)
  const [currentTemp, setCurrentTemp] = useState<number>(0)
  const [click, setClick] = useState<boolean>(false)
  const dispatch = useDispatch()

  const { data: todayWeather } = useTodayWeatherQuery(
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
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          setNavigatorError(true)
          setGeolocation({
            lat: 37.5665,
            lon: 126.978,
          })
        },
      )
    }
  }, [geolocation == null])
  // 체감 온도에 해당하는 온도 설정(so_hot, hot...)
  useEffect(() => {
    if (weatherSegments[currentTemp]) {
      WeatherSave(weatherSegments[currentTemp], dispatch)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [weatherSegments])

  useEffect(() => {
    const Location = async () => {
      try {
        if (geolocation) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geolocation.lat},${geolocation.lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
          )
          const data = await response.json()
          const cityName = data.plus_code.compound_code.split(' ')

          setCity(cityName[cityName.length - 1])
        }
      } catch (error) {
        console.log(error)
      }
    }
    Location()
  }, [geolocation])

  useEffect(() => {
    if (todayWeather) {
      setWeatherSegments(getTimeData(todayWeather))
    }
  }, [todayWeather])

  if (!loading && navigatorError && background) {
    return (
      <div
        className={`flex min-h-screen flex-col gap-9 p-9 bg-${!loading ? background : 'white'}`}
      >
        <div>
          <Header />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          {!click ? (
            <LocationRequired setClick={setClick} />
          ) : (
            <TodayWeatherInfo
              todayWeather={weatherSegments[currentTemp] as weatherSegments}
              city={city as string}
              index={currentTemp}
            />
          )}
          <HomeAvatarCarousel
            data={weatherSegments}
            setCurrentTemp={setCurrentTemp}
          />
          <NavigationBar color={background} openModal={openModal} />
          {isVisible && (
            <PlansModal isVisible={isVisible} closeModal={closeModal} />
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {!loading && background && !navigatorError ? (
        <div
          className={`flex min-h-screen flex-col gap-9 p-9 transition-all duration-500 ease-in-out bg-${!loading ? background : 'white'}`}
        >
          <div>
            <Header />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <TodayWeatherInfo
              todayWeather={weatherSegments[currentTemp] as weatherSegments}
              city={city as string}
              index={currentTemp}
            />
            <HomeAvatarCarousel
              data={weatherSegments}
              setCurrentTemp={setCurrentTemp}
            />
            <NavigationBar color={background} openModal={openModal} />
            {isVisible && (
              <PlansModal isVisible={isVisible} closeModal={closeModal} />
            )}
          </div>
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
