import { History, Plus, RotateCw, Search, User } from 'lucide-react'
import { variants } from './style'
import { useRouter } from 'next/navigation'

type Color = 'zinc' | 'so_hot' | 'hot' | 'fresh' | 'cloud' | 'cold' | 'so_cold'

interface NavigationBarProps {
  color: Color
  navigation?: boolean
}

const NavigationBar: React.FC<NavigationBarProps> = ({ color, navigation }) => {
  const router = useRouter()

  const handleRotateClick = () => {}

  const handleClick = (value: string) => {
    if (!navigation) {
      router.push(value)
    }
  }

  return (
    <div
      className={`z-10 flex w-full max-w-lg items-center justify-between rounded-[2.5rem] px-[2.5rem] py-[0.7rem] shadow-base transition-all duration-500 ease-in-out sm:px-[3.5rem] sm:py-[0.5rem] ${variants[color].bg} ${navigation ? 'opacity-50' : ''}`}
    >
      <Search
        className={`size-[1.6rem] sm:size-[2.5rem] ${variants[color].text} ${navigation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => handleClick('/feed')}
      />
      {color === 'zinc' ? (
        <RotateCw
          className={`size-[1.6em] text-zinc-600 sm:size-[2.3em] ${navigation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleRotateClick}
        />
      ) : (
        <Plus
          className={`${variants[color].text} size-[2rem] sm:size-[3.5rem] ${navigation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => handleClick('/plan')}
        />
      )}
      <User
        className={`${variants[color].text} ${variants[color].fill} size-[1.6rem] sm:size-[2.5rem] ${navigation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => handleClick('/history')}
      />
    </div>
  )
}

export default NavigationBar
