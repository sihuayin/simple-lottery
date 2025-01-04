'use client'

import { MoralisProvider } from "react-moralis";
const CreateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MoralisProvider initializeOnMount={false}>
      { children }
      </MoralisProvider>
  )
}


export default CreateLayout