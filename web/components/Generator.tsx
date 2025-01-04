'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateLuckyNumbers } from '../utils/util'
import { abi, contractAddresses } from '@/doc'
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useGeneratorModal } from '@/store/store'
import { FaTimes } from 'react-icons/fa'

const Generator = ({ jackpotId }: { jackpotId: string }) => {
  const router = useRouter()
  const [luckyNumbers, setLuckyNumbers] = useState('')
  const generatorModal = useGeneratorModal((state: any) => state.generatorModal)
  const hide = useGeneratorModal((state: any) => state.hide)

  const { Moralis, isWeb3Enabled, chainId: chainIdHex,  account, ...others} = useMoralis()
  // These get re-rendered every time due to our connect button!
  console.log('account', account)
  console.log('others', others)
  const chainId = parseInt(chainIdHex!)
  console.log('chainId', chainId, chainIdHex)
  // console.log(`ChainId is ${chainId}`)
  const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null

  const numbers = generateLuckyNumbers(parseInt(luckyNumbers, 10))
  const { runContractFunction: importLuckyNumbers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "importLuckyNumbers",
    params: {
      id: jackpotId,
      luckyNumbers: numbers
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await importLuckyNumbers(
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => console.log(data, '-> data')
      }
    )

    setLuckyNumbers('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
      items-center justify-center bg-black bg-opacity-50
      transform transition-transform duration-300 ${generatorModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-[#0c2856] rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Generate Numbers</p>
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
              name="luckyNumbers"
              placeholder="Lucky Numbers e.g 19"
              onChange={(e) => setLuckyNumbers(e.target.value)}
              value={luckyNumbers}
            />
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white text-md py-2 px-5 rounded-full
              drop-shadow-xl bg-[#0c2856] hover:bg-[#1a396c]"
          >
            Generate and Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default Generator
