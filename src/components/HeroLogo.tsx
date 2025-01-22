import svgIcon from '../assets/bugmuggle.svg'

export default function HeroIcon () {
  return <div className="flex items-center gap-3">
    <img src={svgIcon} alt='bugmuggle' className='w-6 h-6 bg-white bg-opacity-80 rounded-md' />
    <p className='font-bold'>BugMuggle</p>
  </div>
}