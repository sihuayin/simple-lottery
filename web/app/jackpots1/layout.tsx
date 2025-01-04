'use client'

import { MoralisProvider } from "react-moralis";
const JackpotLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MoralisProvider initializeOnMount={false}>
      { children }
      </MoralisProvider>
  )
}


export default JackpotLayout