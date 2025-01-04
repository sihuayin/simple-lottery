'use client'
import React from "react";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

export default function CreateLayout({ children }: { children: React.ReactNode}) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </MoralisProvider>
  )
}