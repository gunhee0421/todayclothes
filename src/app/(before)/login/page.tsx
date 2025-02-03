'use client'

import { RootState } from '@/redux/store'
import Link from 'next/link'
import { useSelector } from 'react-redux'

const Login = () => {
  const language = useSelector((state: RootState) => state.language)

  const textContent =
    language === 'ko'
      ? {
          welcome:
            '고민 없이 하루를 시작하는\n가장 편하고 빠른 방법,\n오늘의 옷장에 오신 걸 환영합니다.',
          signupPrompt: '5초 가입으로 하루를 가장 빠르게 시작해보세요',
          google: '구글로 시작하기',
          kakao: '카카오로 시작하기',
        }
      : {
          welcome:
            "Welcome to Today's Closet,\n\nThe easiest way to start your day\nwithout any hesitation",
          signupPrompt:
            'Sign up in just 5 seconds and get your day off to a quick start!',
          google: 'Start with Google',
          kakao: 'Start with Kakao',
        }

  return (
    <div className="flex min-h-screen w-full max-w-[37.5rem] flex-col items-center justify-center bg-gray-100 px-[2.25rem]">
      <div className="flex w-full flex-col gap-[13.5rem] sm:gap-[22rem]">
        <div className="flex w-full animate-fadein flex-col gap-[1rem] py-[2rem]">
          <p className="font-notosanko text-[1.25rem] font-bold sm:text-[1.75rem]">
            {textContent.welcome.split('\n').map((text, index) => (
              <span key={index}>
                {text}
                <br />
              </span>
            ))}
          </p>
          <p className="font-notosanko text-[0.9rem] font-medium sm:text-lg">
            {textContent.signupPrompt}
          </p>
        </div>

        <div className="flex w-full flex-col gap-[1.5rem] px-[1.5rem] py-[3rem]">
          <Link
            // href={`${process.env.NEXT_PUBLIC_SOCIAL_LOGIN_GOOGLE}?redirect_uri=${
            //   process.env.VERCEL
            //     ? 'https://todayclothes.vercel.app'
            //     : 'http://localhost:3000/auth/token'
            // }`}
            href={'/home'}
          >
            <button className="flex w-full items-center justify-between rounded-[0.25rem] bg-white px-[1rem] py-[0.625rem] hover:bg-slate-50">
              <img src="/icon/google.svg" alt="google" width="24" height="24" />
              <p className="flex-1 font-notosanko text-[0.75rem] font-medium">
                {textContent.google}
              </p>
            </button>
          </Link>

          <Link
            // href={`${process.env.NEXT_PUBLIC_SOCIAL_LOGIN_KAKAO}?redirect_uri=${
            //   process.env.VERCEL
            //     ? 'https://todayclothes.vercel.app'
            //     : 'http://localhost:3000/auth/token'
            // }`}
            href={'/home'}
          >
            <button className="flex w-full items-center rounded-[0.25rem] bg-yellow-300 px-[1rem] py-[0.625rem] hover:bg-yellow-200">
              <img src="/icon/kakao.svg" alt="kakao" width="24" height="24" />
              <p className="flex-1 font-notosanko text-[0.75rem] font-medium">
                {textContent.kakao}
              </p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
