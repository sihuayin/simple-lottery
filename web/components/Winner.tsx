'use client'

import { abi, contractAddresses } from "@/doc"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useWinnerModal } from "@/store/store"

const Winners = ({ resultId }: { resultId: string }) => {
  const router = useRouter()
  const [numberOfwinners, setNumberOfwinners] = useState('')
  const winnersModal = useWinnerModal((state: any) => state.winnersModal)
  const hide = useWinnerModal((state: any) => state.hide)


  const { chainId: chainIdHex } = useMoralis()
   const chainId = parseInt(chainIdHex!)
   const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null
   const { runContractFunction: performDraw } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "randomlySelectWinners",
    params: { id: resultId, numOfWinners: numberOfwinners},
  })
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await performDraw({
      onError: (error) => console.log(error),
      onSuccess: (data) => console.log(data, '-> data')
    })
    setNumberOfwinners('')
    hide()
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
      items-center justify-center bg-black bg-opacity-50
      transform transition-transform duration-300 ${winnersModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-[#0c2856] rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Emerging Winners</p>
            <button
              onClick={() => hide()}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl p-2.5 my-5"
          >
            <input
              className="block w-full bg-transparent
              border-0 text-sm text-slate-500 focus:outline-none
              focus:ring-0"
              type="number"
              step={1}
              min={1}
              name="numberOfwinners"
              placeholder="Winners e.g 3"
              onChange={(e) => setNumberOfwinners(e.target.value)}
              value={numberOfwinners}
            />
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white text-md py-2 px-5 rounded-full
              drop-shadow-xl bg-[#0c2856] hover:bg-[#1a396c]"
          >
            Draw Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default Winners
