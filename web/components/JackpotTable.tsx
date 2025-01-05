'use client'

import { useRouter } from "next/navigation"
import Countdown from "./Countdown"
import Link from "next/link"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "@/doc"
import { useEffect, useState } from "react"
import { useGeneratorModal } from "@/store/store"
import { useContract } from "@/hooks/useContract"

const JackpotTable = ({ jackpotId }: any) => {
  const show = useGeneratorModal((state: any) => state.show)
  const router = useRouter()
  let participants = []

  const [jackpot] = useContract("getLottery", { id: jackpotId}, true) as any
  const [luckNumbers] = useContract("getLotteryLuckyNumbers", { id: jackpotId}, true) as any
  const [data] = useContract("getLotteryParticipants", { id: jackpotId}, true)
  if (data) {
    participants = (data as any[]).map(v => v.lotteryNumber)
  }

  const { Moralis, isWeb3Enabled, chainId: chainIdHex,  account, ...others} = useMoralis()
  // These get re-rendered every time due to our connect button!
  console.log('account', account)
  console.log('others', others)
  const chainId = parseInt(chainIdHex!)
  console.log('chainId', chainId, chainIdHex)
  // console.log(`ChainId is ${chainId}`)
  const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null


  const { runContractFunction: buyTicket } = useWeb3Contract({
    msgValue: Number(jackpot?.ticketPrice)
  })

  const handlePurchase = async (luckyNumberId: number) => {
    if (!account) return 'Connect your wallet'
    
    await buyTicket({
      params: {
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "buyTicket",
        params: { id: jackpotId, luckyNumberId },
        
      },
      onError: (error) => console.log(error),
      onSuccess: (data) => console.log(data, '-> data')
    })
  }

  const onGenerate = () => {
    if ((luckNumbers as any[]).length > 0) return alert('Already generated')
    show('scale-100')
  }

  return (
    <div className="py-10 px-5 bg-slate-100">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <h4 className="text-4xl text-slate-700 text-center font-bold pb-3">
          Buy Lottery Tickets Online
        </h4>
        <p className="text-lg text-gray-600 font-semibold capitalize">{jackpot?.title}</p>
        <p className="text-sm text-gray-500 w-full sm:w-2/3">{jackpot?.description}</p>
        <p className="text-sm font-medium text-black w-full sm:w-2/3">
          {Number(jackpot?.participants)} participants
        </p>
      </div>

      <div className="flex flex-col justify-center items-center space-y-4 mb-6">
        {jackpot?.expiresAt ? <Countdown timestamp={Number(jackpot?.expiresAt)} /> : null}

        <div className="flex justify-center items-center space-x-2">
          {account?.toLocaleLowerCase() == jackpot?.owner?.toLocaleLowerCase() ? (
            <button
              disabled={Date.now() > Number(jackpot?.expiresAt)}
              onClick={onGenerate}
              className="flex flex-nowrap border py-2 px-4 rounded-full bg-amber-500
            hover:bg-rose-600 font-semibold"
            >
              Generate Lucky Numbers
            </button>
          ) : null} 

          <Link
            href={`/results/` + jackpot?.id}
            className="flex flex-nowrap border py-2 px-4 rounded-full bg-[#0c2856]
            hover:bg-[#1a396c] cursor-pointer font-semibold text-white"
          >
            Draw Result
          </Link>
        </div>
      </div>

      <div className="bg-white text-sm overflow-x-auto flex flex-col w-full sm:w-3/4 mx-auto p-5 rounded-md">
        <div className="pb-4 text-center">
          <p className="semibold text-2xl">Select Your winning Lottery Numbers</p>
        </div>

        <table className="table-auto">
          <thead className="max-h-80 overflow-y-auto block">
            <tr className="flex justify-between text-left">
              <th className="px-4 py-2 ">#</th>
              <th className="px-4 py-2 ">Ticket Price</th>
              <th className="px-4 py-2 ">Draw Date</th>
              <th className="px-4 py-2 ">Ticket Number</th>
              <th className="px-4 py-2 ">Action</th>
            </tr>
          </thead>
          <tbody className="max-h-80 overflow-y-auto block">
            {luckNumbers?.map((luckyNumber: string, i: number) => (
              <tr className="flex justify-between border-b text-left" key={i}>
                <td className="px-4 py-2 font-semibold">{i + 1}</td>
                <td className="px-4 py-2 font-semibold">
                  <div className="flex justify-center items-center space-x-1">
                    <span>图标</span>
                    <span>{Number(jackpot?.ticketPrice)}</span>
                  </div>
                </td>
                <td className="px-4 py-2 font-semibold">{Number(jackpot?.expiresAt)}</td>
                <td className="px-4 py-2 font-semibold">{luckyNumber}</td>
                <td className="px-4 py-2 font-semibold">
                  <button
                    onClick={() => handlePurchase(i)}
                    className={`bg-black ${
                      participants.includes(luckyNumber)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-rose-600'
                    } text-white text-sm py-2 px-4 rounded-full`}
                  >
                    BUY NOW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JackpotTable
