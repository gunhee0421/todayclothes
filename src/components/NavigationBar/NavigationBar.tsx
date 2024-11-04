import { History, Plus, RotateCw, Search, User } from 'lucide-react'
import { variants } from './style'
import { useRouter } from 'next/navigation'

type Color = 'zinc' | 'so_hot' | 'hot' | 'fresh' | 'cloud' | 'cold' | 'so_cold'

interface NavigationBarProps {
  color: Color
  openModal: () => void // Ensure this prop is defined
}

const NavigationBar: React.FC<NavigationBarProps> = ({ color, openModal }) => {
  const router = useRouter()

  const handleSearchClick = () => {}

  const handlePlusClick = () => {
    router.push('/plan')
  }

  const handleUserClick = () => {
    router.push('/history')
  }

  const handleRotateClick = () => {
    openModal()
  }

  return (
    <div
      className={`flex w-full max-w-lg items-center justify-between rounded-[2.5rem] px-[2.5rem] py-[0.7rem] shadow-base sm:px-[3.5rem] sm:py-[0.5rem] ${variants[color].bg}`}
    >
      <Search
        className={`size-[1.6rem] cursor-pointer sm:size-[2.5rem] ${variants[color].text}`}
        onClick={handleSearchClick}
      />
      {color === 'zinc' ? (
        <RotateCw
          className="size-[1.6em] cursor-pointer text-zinc-600 sm:size-[2.3em]"
          onClick={handleRotateClick}
        />
      ) : (
        <Plus
          className={`cursor-pointer ${variants[color].text} size-[2rem] sm:size-[3.5rem]`}
          onClick={handlePlusClick}
        />
      )}
      <User
        className={`cursor-pointer ${variants[color].text} ${variants[color].fill} size-[1.6rem] sm:size-[2.5rem]`}
        onClick={handleUserClick}
      />
    </div>
  )
}

export default NavigationBar
