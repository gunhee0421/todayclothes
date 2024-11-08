import { WeatherResponse } from '@/api'
import { TimeOfDay } from '@/api/services/recommend/model'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export interface weatherSegments {
  tempCode: number
  maxTemp: number
  minTemp: number
  temp: number
  feels_like: number
  rain: number
  hydrate: number
  wind: number
  timeOfDay?: { en: string; ko: string }
}
export function getRecommendData(
  todayWeather: WeatherResponse,
  startTime: string, // startTime은 ISO 8601 형식의 문자열
  timeRange:
    | TimeOfDay.Morning
    | TimeOfDay.Afternoon
    | TimeOfDay.Evening
    | TimeOfDay.Night,
) {
  const timeRanges: Record<string, [number, number]> = {
    MORNING: [6, 12],
    AFTERNOON: [12, 18],
    EVENING: [18, 24],
    NIGHT: [0, 6],
  }

  const [startHour, endHour] = timeRanges[timeRange]

  const startDate = new Date(startTime) // ISO 8601 문자열을 Date 객체로 변환
  const startDay = startDate.getDate() // 날짜만 추출 (시간은 무시)

  const filteredData = todayWeather.list.filter((data) => {
    const dataToDate = new Date(data.dt_txt)
    const dataDateKST = new Date(dataToDate.getTime() + 9 * 60 * 60 * 1000)

    const hour = dataDateKST.getHours() // 한국 시간 기준의 시간
    const day = dataDateKST.getDate() // 해당 날짜가 startTime의 날짜와 일치하는지 확인

    return day === startDay && hour >= startHour && hour < endHour
  })

  const totalAverages = filteredData.reduce(
    (acc: any, curr: any) => {
      acc.tempCode = curr.weather[0].id
      acc.temp += curr.main.temp
      acc.feels_like += curr.main.feels_like
      acc.rain += curr.pop
      acc.hydrate += curr.main.humidity
      acc.wind += curr.wind.speed

      if (curr.main.temp > acc.maxTemp) {
        acc.maxTemp = curr.main.temp
      }
      if (curr.main.temp < acc.minTemp) {
        acc.minTemp = curr.main.temp
      }

      return acc
    },
    {
      tempCode: 0,
      temp: 0,
      feels_like: 0,
      rain: 0,
      hydrate: 0,
      wind: 0,
      maxTemp: -Infinity,
      minTemp: Infinity,
    },
  )

  const count = filteredData.length

  if (count > 0) {
    totalAverages.temp /= count
    totalAverages.feels_like /= count
    totalAverages.rain /= count
    totalAverages.hydrate /= count
    totalAverages.wind /= count
  }

  return {
    tempCode: totalAverages.tempCode,
    temp: parseFloat(totalAverages.temp.toFixed(2)),
    maxTemp: parseFloat(totalAverages.maxTemp.toFixed(2)),
    minTemp: parseFloat(totalAverages.minTemp.toFixed(2)),
    feels_like: parseFloat(totalAverages.feels_like.toFixed(2)),
    rain: parseFloat(totalAverages.rain.toFixed(2)),
    hydrate: parseFloat(totalAverages.hydrate.toFixed(2)),
    wind: parseFloat(totalAverages.wind.toFixed(2)),
  }
}
export function getTimeData(todayWeather: WeatherResponse) {
  const weatherSegments: weatherSegments[] = []

  const totalAverages = todayWeather.list.reduce(
    (acc: any, curr: any) => {
      acc.tempCode = curr.weather[0].id
      acc.temp += curr.main.temp
      acc.feels_like += curr.main.feels_like
      acc.rain += curr.pop
      acc.hydrate += curr.main.humidity
      acc.wind += curr.wind.speed

      if (curr.main.temp > acc.maxTemp) {
        acc.maxTemp = curr.main.temp
      }
      if (curr.main.temp < acc.minTemp) {
        acc.minTemp = curr.main.temp
      }

      return acc
    },
    {
      tempCode: 0,
      temp: 0,
      feels_like: 0,
      rain: 0,
      hydrate: 0,
      wind: 0,
      maxTemp: -Infinity,
      minTemp: Infinity,
    },
  )

  const count = todayWeather.list.length

  if (count > 0) {
    totalAverages.temp /= count
    totalAverages.feels_like /= count
    totalAverages.rain /= count
    totalAverages.hydrate /= count
    totalAverages.wind /= count
  }

  // 전체 24시간 평균 데이터를 weatherSegments 배열의 맨 앞에 추가
  weatherSegments.unshift({
    tempCode: totalAverages.tempCode,
    temp: parseFloat(totalAverages.temp.toFixed(2)),
    maxTemp: parseFloat(totalAverages.maxTemp.toFixed(2)),
    minTemp: parseFloat(totalAverages.minTemp.toFixed(2)),
    feels_like: parseFloat(totalAverages.feels_like.toFixed(2)),
    rain: parseFloat(totalAverages.rain.toFixed(2)),
    hydrate: parseFloat(totalAverages.hydrate.toFixed(2)),
    wind: parseFloat(totalAverages.wind.toFixed(2)),
  })

  let currentHour = new Date().getHours()

  // `todayWeather.list`에서 6시간 단위로 데이터를 그룹화
  for (let i = 0; i < todayWeather.list.length; i += 6) {
    const segment = todayWeather.list.slice(i, i + 6)

    // 세그먼트의 평균을 계산
    const averages = segment.reduce(
      (acc: any, curr: any) => {
        acc.tempCode = curr.weather[0].id // 마지막 날씨 코드 사용
        acc.temp += curr.main.temp
        acc.feels_like += curr.main.feels_like
        acc.rain += curr.pop
        acc.hydrate += curr.main.humidity
        acc.wind += curr.wind.speed

        if (curr.main.temp > acc.maxTemp) {
          acc.maxTemp = curr.main.temp
        }
        if (curr.main.temp < acc.minTemp) {
          acc.minTemp = curr.main.temp
        }

        return acc
      },
      {
        tempCode: 0,
        temp: 0,
        feels_like: 0,
        rain: 0,
        hydrate: 0,
        wind: 0,
        maxTemp: -Infinity,
        minTemp: Infinity,
      },
    )

    const count = segment.length

    if (count > 0) {
      averages.temp /= count
      averages.feels_like /= count
      averages.rain /= count
      averages.hydrate /= count
      averages.wind /= count
    }

    let timeOfDay: { en: string; ko: string } | string = ''
    if (currentHour >= 0 && currentHour < 6) {
      timeOfDay = { en: 'Night', ko: '밤' }
    } else if (currentHour >= 6 && currentHour < 12) {
      timeOfDay = { en: 'Morning', ko: '아침' }
    } else if (currentHour >= 12 && currentHour < 18) {
      timeOfDay = { en: 'Afternoon', ko: '점심' }
    } else {
      timeOfDay = { en: 'Evening', ko: '저녁' }
    }

    currentHour += 6
    currentHour %= 24

    weatherSegments.push({
      tempCode: averages.tempCode,
      temp: parseFloat(averages.temp.toFixed(2)),
      maxTemp: parseFloat(averages.maxTemp.toFixed(2)),
      minTemp: parseFloat(averages.minTemp.toFixed(2)),
      feels_like: parseFloat(averages.feels_like.toFixed(2)),
      rain: parseFloat(averages.rain.toFixed(2)),
      hydrate: parseFloat(averages.hydrate.toFixed(2)),
      wind: parseFloat(averages.wind.toFixed(2)),
      timeOfDay: timeOfDay,
    })
  }

  return weatherSegments
}
