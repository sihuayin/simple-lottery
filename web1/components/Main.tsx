'use client'

import { useMoralis } from "react-moralis";
import LotteryEntrance from "./LotteryEntrance";

const supportedChains: string[] = ["31337", "11155111"]
export const Main = () => {
  const { isWeb3Enabled, chainId } = useMoralis();
  return (
    <div className="px-8">
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId || '31337').toString()) ? (
          <div className="flex flex-row">
            <LotteryEntrance className="p-8" />
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
