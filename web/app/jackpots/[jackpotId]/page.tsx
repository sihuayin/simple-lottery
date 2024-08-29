'use client'

import Header from "@/components/Header";
import { abi, contractAddresses } from "@/doc";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default function JackpotPage({ params }: { params: { jackpotId: string }}) {
  const [ data, setData] = useState({})
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  // These get re-rendered every time due to our connect button!

    const chainId = parseInt(chainIdHex!)
    console.log('chainId', chainId, chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null
  console.log('raffleAddress', raffleAddress)

  const { runContractFunction: getLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getLottery",
    params: {
      id: params.jackpotId
    },
  })

  useEffect(() => {
    const get = async () => {
      const values = await getLottery()
      console.log(values, '-> values, raffleAddress')
      setData(values)
    }
    get()
  }, [getLottery])
  return (
    <div className="min-h-screen">
      
      <div className="min-h-screen bg-slate-100">
        <Header />
        {/* <DrawTime jackpot={jackpot} luckyNumbers={luckyNumbers} participants={purchasedNumbers} /> */}
        {/* <Generator /> */}
        {data?.title}
      </div>
    </div>
  )
}