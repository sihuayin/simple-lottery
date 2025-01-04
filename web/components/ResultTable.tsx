'use client'

import { useEffect, useState } from "react"
import Countdown from "./Countdown"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Link from "next/link"
import { abi, contractAddresses } from "@/doc"
import { truncate } from "@/utils/util"
import Identicon from 'react-identicons'
import { FaEthereum } from 'react-icons/fa'
import { useWinnerModal } from "@/store/store"

const ResultTable = ({ jackpotId }: { jackpotId: string }) => {
  const show = useWinnerModal((state: any) => state.show)
  const [jackpot, setJackpot] = useState<any>({})
  const [participants, setParticipants] = useState<any[]>([])
  const [result, setResult] = useState<any>({})
   const { isWeb3Enabled, chainId: chainIdHex,  account } = useMoralis()
   const chainId = parseInt(chainIdHex!)
   const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null
   const { runContractFunction: getParticipants } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getLotteryParticipants",
    params: { id: jackpotId},
  })

  const { runContractFunction: getLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getLottery",
    params: { id: jackpotId},
  })

  const { runContractFunction: getLotteryResult } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getLotteryResult",
    params: { id: jackpotId},
  })

  useEffect(() => {
      if (!isWeb3Enabled) {
        return
      }
      const get = async (params: any) => {
        const values = await getLottery({
          params,
          onError: (error) => console.log(error),
          onSuccess: (data) => console.log(data, '-> data')
        })
        console.log(values, 'Jacktop-> values, raffleAddress')
        setJackpot(values)
      }
      get({ id: jackpotId})
  }, [getLottery, jackpotId, isWeb3Enabled])

  useEffect(() => {
    if (!isWeb3Enabled) {
      return
    }
    const get = async (params: any) => {
      const values = await getLotteryResult({
        params,
        onError: (error) => console.log(error),
        onSuccess: (data) => console.log(data, '-> data')
      })
      console.log(values, 'setResult-> values, raffleAddress')
      setResult(values)
    }
    get({ id: jackpotId})
  }, [getLotteryResult, jackpotId, isWeb3Enabled])

  useEffect(() => {
    if (!isWeb3Enabled) {
      return
    }
    const get = async (params: any) => {
      const values = await getParticipants({
        params,
        onError: (error) => console.log(error),
        onSuccess: (data) => console.log(data, '-> data')
      })
      console.log(values, 'getParticipants-> values, raffleAddress')
      if (values && Array.isArray(values)) {
        setParticipants(values)
      }
    }
    get({ id: jackpotId})
  }, [getParticipants, jackpotId, isWeb3Enabled])
  
  const onDraw = () => {
    // if (Number(jackpot?.expiresAt) > Date.now()) {
    //   alert('Still counting down')
    // }
    show('scale-100')
  }
  

  return (
    <div className="py-10 px-5 bg-slate-100">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <h4 className="text-4xl text-slate-700 text-center font-bold pb-3">Lottery Result</h4>
        <p className="text-lg text-gray-600 font-semibold capitalize">{jackpot?.title}</p>
        <p className="text-sm text-gray-500 w-full sm:w-2/3">{jackpot?.description}</p>
        <p className="text-sm text-gray-500 w-full sm:w-2/3">
          Result for <span className="font-medium text-green-600">{Number(jackpot?.winners)} winners</span>{' '}
          out of{' '}
          <span className="font-medium text-black">{Number(jackpot?.participants)} participants</span>{' '}
          <span className="font-medium text-gray-600">
            {result?.winners?.length > 0 ? 'Drawn' : 'Not Drawn'}
          </span>
        </p>
      </div>

      <div className="flex flex-col justify-center items-center space-y-4 mb-6">
        {jackpot?.expiresAt ? <Countdown timestamp={Number(jackpot?.expiresAt)} /> : null}

        <div className="flex justify-center items-center space-x-2">
          {account?.toLocaleLowerCase() == jackpot?.owner?.toLocaleLowerCase()  ? (
            <button
              onClick={onDraw}
              className="flex flex-nowrap border py-2 px-4 rounded-full bg-green-500
            hover:bg-rose-600 font-semibold"
            >
              Perform Draw
            </button>
          ) : null}

          <Link
            href={`/jackpots/` + jackpot?.id}
            className="flex flex-nowrap border py-2 px-4 rounded-full bg-[#0c2856]
            hover:bg-[#1a396c] cursor-pointer font-semibold text-white"
          >
            Jackpot
          </Link>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row ">
        <div
          className="bg-white flex flex-col w-full sm:w-3/4 mx-auto
        p-5 rounded-md"
        >
          <h4 className="text-2xl font-bold text-slate-700 text-center">Winners & Lossers</h4>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {participants?.map((participant, i) => (
              <div
                key={i}
                className="flex justify-start items-center border-b border-gray-100 py-2 space-x-2"
              >
                <Identicon
                  size={30}
                  string={participant.account}
                  className="rounded-full h-12 w-12"
                />
                <div className="flex justify-center items-center space-x-2 text-sm">
                  <p className="font-semibold text-lg text-slate-500">
                    {truncate(participant.account || '', 4, 4, 11)}
                  </p>
                  <p className="text-slate-500">{participant.lotteryNumber}</p>
                  {result?.winners?.includes(participant.lotteryNumber) ? (
                    <p className="text-green-500 flex justify-start items-center">
                      + <FaEthereum /> {Number(result?.sharePerWinner)} {' winner'}
                    </p>
                  ) : (
                    <p className="text-red-500 flex justify-start items-center">
                      - <FaEthereum /> {Number(jackpot?.ticketPrice)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultTable
