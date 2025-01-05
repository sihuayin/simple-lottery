'use client'

import { useMoralis } from "react-moralis";
import Jackpots from "@/components/jackpots"

import { useContract } from "@/hooks/useContract"; 

const supportedChains: string[] = ["31337", "11155111"]
export const Main = () => {
  const [data] = useContract("getLotteries", {}, true)
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  const chainId = parseInt(chainIdHex!);
  return (
    <div className="px-8">
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(chainId +"") ? (
          <div className="flex flex-row">
            {/* <LotteryEntrance className="p-8" /> */}
            <Jackpots jackpots={data as any[]} />
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
