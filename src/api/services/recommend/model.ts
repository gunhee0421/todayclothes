export enum ActivityType {
  Indoor = 'INDOORS',
  Outdoor = 'OUTDOORS',
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
}

export enum TimeOfDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
}

export enum ActivityStyle {
  Casual = 'CASUAL',
  Business = 'BUSINESS',
  Street = 'STREET',
  Formal = 'FORMAL',
  Sporty = 'SPORTY',
  Outdoor = 'OUTDOOR',
}

export enum Feedback {
  Perfect = 'PERFECT',
  Too_Hot = 'HOT',
  Too_Cold = 'COLD',
}

export interface PlaceCoordinates {
  lat: number | null
  lon: number | null
}

export interface ActivityWeatherInfo {
  location: string
  startTime: string
  type: ActivityType
  style: ActivityStyle
  timezone: TimeOfDay
  gender: Gender
  weather: number
  wind: number
  rain: number
  humidity: number
  feelsLike: number
  temp: number
}

export interface activityHistoryInfo {
  clothesId: number
  imgPath: string | null
  myImgPaths: string[]
  location: string
  type: ActivityType
  style: ActivityStyle
  review: WeatherReview | null
  weather: number
  wind: number
  rain: number
  humidity: number
  feelsLike: number
  temp: number
}

export interface activityHistoryResponse {
  code: number
  message: string
  result: activityHistoryInfo[] | []
}

export interface ActivityWeatherResponse {
  code: number
  message: string
  result: {
    location: string
    imgPath: string
    comment: string
    type: ActivityType
    style: ActivityStyle
    weather: number
    wind: number
    rain: number
    humidity: number
    feelsLike: number
    temp: number
  }
}

export interface WeatherReview {
  feedback: Feedback
}

export interface ActivityReview {
  clothesId: string
  feedback: Feedback
  imageFile?: File
}

export interface ActivityReviewResponse {
  code: number
  message: string
  result: null
}

export interface DefaultResponse {
  code: string
}
