'use client'

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { Main } from "@/components/Main";
import Header from "@/components/Header";


export default function Home() {
  
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Header />
        <Main />
      </NotificationProvider>
    </MoralisProvider>
   
  );
}
