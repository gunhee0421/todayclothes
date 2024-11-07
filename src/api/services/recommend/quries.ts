import {
  MutationOptions,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { ActivityService } from './service'
import {
  activityHistoryResponse,
  ActivityReviewResponse,
  ActivityWeatherInfo,
  ActivityWeatherResponse,
} from './model'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { CustomQueryOptions } from '@/api/type'

export const activityOptions = {
  activityWeatherInfo: (
    client: QueryClient,
    access: string | null,
    refresh: string | null,
    dispatch: any,
  ) => ({
    mutationFn: (dto: ActivityWeatherInfo) =>
      ActivityService.activityInfo(client, access, refresh, dispatch, dto),
  }),
  activityWeatherHistory: (
    client: QueryClient,
    access: string | null,
    refresh: string | null,
    dispatch: any,
    path: string, // path 인수 추가
  ) => ({
    queryKey: ['activityHistory'], // path를 queryKey에 포함하여 캐시를 분리
    queryFn: () =>
      ActivityService.activityHistory(client, access, refresh, dispatch, path),
  }),
  activityReview: (
    client: QueryClient,
    access: string | null,
    refresh: string | null,
    dispatch: any,
  ) => ({
    mutationFn: (formData: FormData) =>
      ActivityService.activityReview(
        client,
        access,
        refresh,
        dispatch,
        formData,
      ),
  }),
  activityFeed: (
    client: QueryClient,
    access: string | null,
    refresh: string | null,
    dispatch: any,
    size: number,
  ) => ({
    queryKey: ['activityFeed'],
    queryFn: ({ pageParam = 0 }) =>
      ActivityService.activityHistory(
        client,
        access,
        refresh,
        dispatch,
        `/event/all?page=${pageParam}&size=${size}`,
      ),
    getNextPageParam: (lastPage: any) => {
      // 다음 페이지가 존재하는 경우에만 증가
      return lastPage.result && lastPage.result.length === size
        ? lastPage.page + 1
        : undefined
    },
    initialPageParam: 0,
  }),
}

export const useActivityInfo = (
  options: MutationOptions<
    ActivityWeatherResponse,
    Error,
    ActivityWeatherInfo
  > = {},
) => {
  const queryClient = useQueryClient()

  const access = useSelector((state: RootState) => state.login.accessToken)
  const refresh = useSelector((state: RootState) => state.login.refreshToken)
  const dispatch = useDispatch()

  return useMutation<ActivityWeatherResponse, Error, ActivityWeatherInfo>({
    ...activityOptions.activityWeatherInfo(
      queryClient,
      access,
      refresh,
      dispatch,
    ),
    ...options,
  })
}
export const useActivityHistory = (
  path: string, // path 인수 추가
  options: CustomQueryOptions<activityHistoryResponse> = {},
) => {
  const queryClient = useQueryClient()
  const access = useSelector((state: RootState) => state.login.accessToken)
  const refresh = useSelector((state: RootState) => state.login.refreshToken)
  const dispatch = useDispatch()

  return useQuery<activityHistoryResponse>({
    ...activityOptions.activityWeatherHistory(
      queryClient,
      access,
      refresh,
      dispatch,
      path, // path 전달
    ),
    ...options,
  })
}

export const useActivityReview = (
  options: MutationOptions<ActivityReviewResponse, Error, FormData> = {},
) => {
  const queryClient = useQueryClient()

  const access = useSelector((state: RootState) => state.login.accessToken)
  const refresh = useSelector((state: RootState) => state.login.refreshToken)
  const dispatch = useDispatch()

  return useMutation<ActivityReviewResponse, Error, FormData>({
    ...activityOptions.activityReview(queryClient, access, refresh, dispatch),
    ...options,
  })
}

export const useActivityFeed = (
  options: CustomQueryOptions<activityHistoryResponse> = {},
  size: 5,
) => {
  const queryClient = useQueryClient()
  const access = useSelector((state: RootState) => state.login.accessToken)
  const refresh = useSelector((state: RootState) => state.login.refreshToken)
  const dispatch = useDispatch()

  const queryOptions = activityOptions.activityFeed(
    queryClient,
    access,
    refresh,
    dispatch,
    size,
  )

  return useInfiniteQuery(queryOptions) // queryOptions를 직접 전달
}
