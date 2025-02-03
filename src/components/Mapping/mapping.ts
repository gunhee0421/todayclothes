import { ActivityStyle, ActivityType, Feedback } from '@/api'

export const typeMapping = (type: ActivityType) => {
  switch (type) {
    case ActivityType.Indoor:
      return 'INDOORS'
    case ActivityType.Outdoor:
      return 'OUTDOORS'
    default:
      return 'INDOORS' // 기본값 설정
  }
}

export const styleMapping = (style: ActivityStyle) => {
  switch (style) {
    case ActivityStyle.Business:
      return 'BUSINESS'
    case ActivityStyle.Formal:
      return 'FORMAL'
    case ActivityStyle.Street:
      return 'STREET'
    case ActivityStyle.Casual:
      return 'CASUAL'
    case ActivityStyle.Sporty:
      return 'SPORTY'
    case ActivityStyle.Outdoor:
      return 'OUTDOOR'
    default:
      return 'CASUAL' // 기본값 설정
  }
}

export const feedbackMapping = (feedback: Feedback) => {
  switch (feedback) {
    case Feedback.Perfect:
      return 'PERFECT'
    case Feedback.Too_Hot:
      return 'HOT'
    case Feedback.Too_Cold:
      return 'COLD'
    default:
      return 'PERFECT' // 기본값 설정
  }
}
