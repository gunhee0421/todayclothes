'use client'

import { RootState } from '@/redux/store'
import { Camera, ImageIcon, XCircleIcon, XIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useActivityReview } from '@/api/services/recommend/quries'
import { Feedback } from '@/api/services/recommend/model'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

const ReviewComponent = () => {
  const language = useSelector((state: RootState) => state.language)
  const activityReview = useActivityReview()
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const clothesId = Number(searchParams.get('clothesId'))

  const { handleSubmit, setValue, watch } = useForm<{
    selectedFeel: Feedback | null
    selectedFile: File | null
    photoCount: number
  }>({
    defaultValues: {
      selectedFeel: Feedback.Perfect,
      selectedFile: null,
      photoCount: 0,
    },
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false) // 카메라가 켜졌는지 여부를 관리하는 상태
  const [photos, setPhotos] = useState<string[]>([])
  const [camera, setCamera] = useState(true)
  const [showText, setShowText] = useState(false)
  const maxPhotos = 4
  const photoCount = watch('photoCount') // 사진 수 카운트

  // 파일 선택 시 처리
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files &&
      event.target.files.length > 0 &&
      photos.length < maxPhotos
    ) {
      const file = event.target.files[0]
      const newPhoto = URL.createObjectURL(file)
      setPhotos([...photos, newPhoto])
      setValue('selectedFile', file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
    if (isCameraOn) {
      stopCamera()
    }
  }

  // 카메라 열기
  const startCamera = async () => {
    setIsCameraOn(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Error accessing the camera:', error)
    }
  }

  // 카메라 끄기
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraOn(false) // 카메라 상태를 끔으로 변경
  }

  // 사진 찍기 처리
  const takePhoto = async () => {
    if (videoRef.current) {
      // 비디오에서 이미지를 가져오기 위한 새 캔버스 생성
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 비디오의 크기를 캔버스에 맞춥니다.
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      // context가 null이 아닌 경우에만 이미지를 그립니다.
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        // 캔버스에서 Blob을 생성합니다.
        const imageBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png')
        })

        if (imageBlob) {
          const photoFile = new File([imageBlob], 'photo.png', {
            type: 'image/png',
          })
          setValue('selectedFile', photoFile) // 촬영한 사진을 selectedFile에 설정
          setPhotos((prevPhotos) => [
            ...prevPhotos,
            URL.createObjectURL(photoFile), // 새 사진 URL을 photos 배열에 추가
          ])
          setValue('photoCount', photoCount + 1) // 사진 수 증가
          stopCamera() // 사진을 찍은 후 카메라를 닫습니다.
          console.log('photo taken and added to photos')
        }
      }
    }
  }

  const handleCameraClick = async () => {
    if (isCameraOn) {
      stopCamera()
    } else {
      await startCamera()
    }
  }

  const handleDeletePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index))
  }

  useEffect(() => {
    navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then((permissionStatus) => {
        setCamera(permissionStatus.state === 'granted')
        // 권한 상태가 변경될 때마다 업데이트
        permissionStatus.onchange = () => {
          setCamera(permissionStatus.state === 'granted')
        }
      })
      .catch(() => {
        setCamera(false) // 권한 확인이 실패할 경우 false로 설정
      })
  }, [])

  useEffect(() => {
    if (!camera && isCameraOn) {
      stopCamera()
    }
  }, [camera, isCameraOn])

  async function blobUrlToFile(
    blobUrl: string,
    fileName: string,
  ): Promise<File> {
    const response = await fetch(blobUrl) // Blob URL을 실제 Blob으로 변환
    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
  }

  const onSubmit = async (data: { selectedFeel: Feedback | null }) => {
    const { selectedFeel } = data

    const formData = new FormData()

    const reviewReq = {
      clothesId: clothesId,
      feedback: selectedFeel || Feedback.Perfect,
    }

    formData.append(
      'reviewReq',
      new Blob([JSON.stringify(reviewReq)], { type: 'application/json' }),
    )

    // Blob URL을 File 객체로 변환하여 추가
    for (const photoUrl of photos.slice(0, 4)) {
      const file = await blobUrlToFile(photoUrl, 'photo.png')
      formData.append('imageFiles', file)
    }

    try {
      await activityReview.mutateAsync(formData, {
        onSuccess: () => {
          console.log('Success:', formData)
          queryClient.invalidateQueries({ queryKey: ['activityHistory'] })
          router.push('/history')
        },
      })
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <>
      {isCameraOn && camera ? (
        <div className="fixed inset-0 z-50 flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="h-full w-full object-cover"
          />
          <div className="flex w-full items-center justify-between bg-black px-6 py-8">
            <XIcon
              size={'3.5rem'}
              className="cursor-pointer text-white"
              onClick={stopCamera}
            />
            <button
              className="flex cursor-pointer rounded-full bg-white p-1"
              onClick={takePhoto}
            >
              <div className="rounded-full border border-black bg-white p-6" />
            </button>
            <div className="bg-white p-6"></div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen w-full max-w-[37.5rem] items-center justify-between bg-white p-[2rem]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between gap-9 self-stretch font-notosanko"
          >
            <div className="flex flex-col gap-[2rem]">
              <p className="text-center text-[20px] font-semibold">
                {language === 'ko'
                  ? '오늘의 옷차림은 어떠셨나요?'
                  : 'How did your outfit feel?'}
              </p>
              <div className="flex flex-col gap-[40px]">
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-medium text-zinc-400">
                    {language === 'ko' ? '옷차림 평가하기' : 'Outfit Feels'}
                  </p>
                  <div className="flex flex-col gap-4">
                    {['Perfect', 'Too_Hot', 'Too_Cold'].map((feel) => (
                      <button
                        key={feel}
                        type="button"
                        onClick={() => {
                          const currentFeel = watch('selectedFeel')
                          const selectedFeel =
                            Feedback[feel as keyof typeof Feedback]

                          // 현재 선택된 상태와 같으면 "완벽함"으로 설정하지 않고 그대로 유지
                          setValue(
                            'selectedFeel',
                            currentFeel === selectedFeel
                              ? currentFeel
                              : selectedFeel,
                          )
                        }}
                        className={`flex items-center justify-center rounded-[16px] p-4 ${
                          watch('selectedFeel') ===
                          Feedback[feel as keyof typeof Feedback]
                            ? 'bg-zinc-600 text-white'
                            : 'bg-zinc-100'
                        }`}
                      >
                        {language === 'ko'
                          ? feel === 'Perfect'
                            ? '완벽함'
                            : feel === 'Too_Hot'
                              ? '너무 더움'
                              : feel === 'Too_Cold'
                                ? '너무 추움'
                                : ''
                          : feel.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div className="flex flex-col gap-4 self-stretch">
                <p className="text-[12px] font-medium text-zinc-400">
                  {language === 'ko'
                    ? '오늘의 옷차림을 기록으로 남겨보세요(선택)'
                    : "Photo of today's outfit(Optional)"}
                </p>

                <div className="grid grid-cols-2 gap-[0.5rem]">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full rounded-md border border-zinc-200"
                    >
                      <img
                        src={photo}
                        alt={`사진 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <XCircleIcon
                        size={'2rem'}
                        onClick={() => handleDeletePhoto(index)}
                        className="absolute right-1 top-1 transform cursor-pointer p-1 text-zinc-700 transition-transform duration-200 hover:scale-125"
                      />
                    </div>
                  ))}
                  {photos.length < maxPhotos && (
                    <div className="flex aspect-square w-full flex-col items-center justify-center gap-[0.8rem] rounded-[0.75rem] border border-zinc-200">
                      <div className="flex items-center gap-[0.3rem]">
                        <div className="relative">
                          <Camera
                            size={'1.875rem'}
                            onClick={camera ? handleCameraClick : undefined}
                            onMouseOver={() => !camera && setShowText(true)}
                            onMouseLeave={() => setShowText(false)}
                            className={`cursor-pointer ${camera ? 'text-zinc-500' : 'cursor-not-allowed text-zinc-300'}`}
                          />
                          {!camera && showText && (
                            <div className="absolute -left-1 -top-11 z-10 w-[10rem] whitespace-normal break-words rounded bg-black px-2 py-1 text-xs text-white">
                              카메라 접근 권한이 허용되지 않았습니다.
                            </div>
                          )}
                        </div>
                        <ImageIcon
                          size={'1.6875rem'}
                          onClick={handleImageClick}
                          className="cursor-pointer text-zinc-500"
                        />
                      </div>
                      <p className="text-[1rem] font-medium text-zinc-400">
                        ({photos.length}/{maxPhotos})
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="flex-1 rounded-[8px] bg-zinc-100 px-4 py-2"
                onClick={() => {
                  router.push('/history')
                }}
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!watch('selectedFeel')}
                className={`flex-1 rounded-[6px] px-4 py-2 ${!watch('selectedFeel') ? 'bg-zinc-50 text-zinc-400' : 'bg-zinc-600 text-white'}`}
              >
                {language === 'ko' ? '작성' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
export default ReviewComponent
