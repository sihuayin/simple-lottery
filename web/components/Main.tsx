'use client'

import { useMoralis, useWeb3Contract } from "react-moralis";
import LotteryEntrance from "./LotteryEntrance";
import Jackpots from "./LotteryList";
import { contractAddresses, abi } from "../doc"
import { useEffect, useState } from "react";
import { describe } from "node:test";

const supportedChains: string[] = ["31337", "11155111"]
export const Main = () => {
  const [ data, setData] = useState([])
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  // These get re-rendered every time due to our connect button!

    const chainId = parseInt(chainIdHex!)
    console.log('chainId', chainId, chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null
  console.log('raffleAddress', raffleAddress)

  const { runContractFunction: getLotteries } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getLotteries",
    params: {},
  })

  useEffect(() => {
    const get = async () => {
      const values = await getLotteries()
      console.log(values, '-> values, raffleAddress')
      setData(values)
    }
    get()
  }, [getLotteries, raffleAddress])
  
  return (
    <div className="px-8">
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(chainId +"") ? (
          <div className="flex flex-row">
            {/* <LotteryEntrance className="p-8" /> */}
            <Jackpots jackpots={data} />
          </div>
        ) : (
          <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
        )}
        </div>
      ) : (
          <div>Please connect to a Wallet</div>
        )}
    </div>
  )
}
