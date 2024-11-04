import { WeatherResponse } from '@/api'

export interface weatherSegments {
  tempCode: number
  maxTemp: number
  minTemp: number
  temp: number
  feels_like: number
  rain: number
  hydrate: number
  wind: number
}

export function getRecommendData(todayWeather: WeatherResponse) {
  // 6시간 단위로 데이터를 그룹화할 배열
  const weatherSegments: weatherSegments[] = []
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

    weatherSegments.push({
      tempCode: averages.tempCode,
      temp: parseFloat(averages.temp.toFixed(2)),
      maxTemp: parseFloat(averages.maxTemp.toFixed(2)),
      minTemp: parseFloat(averages.minTemp.toFixed(2)),
      feels_like: parseFloat(averages.feels_like.toFixed(2)),
      rain: parseFloat(averages.rain.toFixed(2)),
      hydrate: parseFloat(averages.hydrate.toFixed(2)),
      wind: parseFloat(averages.wind.toFixed(2)),
    })
  }

  return weatherSegments
}
