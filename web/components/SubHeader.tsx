'use client'


import Link from "next/link"
import { ConnectButton } from "web3uikit"

const background = 'https://dapplottery.vercel.app/_next/static/media/background.a7d45fa2.jpg'

const SubHeader = () => {
  return (
    <div
      style={{ background: `url('${background}') fixed no-repeat top/cover` }}
      className="flex flex-row items-center justify-between text-white px-10 py-5"
    >
      <div>
        <Link href="/" className="text-xl font-bold">
          DappLottery
        </Link>
      </div>

      <div className="hidden lg:flex items-center space-x-6 font-semibold">
        <p>Home</p>
        <p>How To Play</p>
        <p>All Lottery</p>
        <p>Contact</p>
      </div>

      <ConnectButton moralisAuth={false}/>
    </div>
  )
}

export default SubHeader