'use client'

import { useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "@/doc"
import Header from "@/components/Header"

export default function CreatePage() {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [prize, setPrize] = useState("0")
  const [ticketPrice, setTicketPrice] = useState("0")
  const [expiresAt, setExpiresAt] = useState("")
  const [description, setDescription] = useState("")

  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  // These get re-rendered every time due to our connect button!

  const chainId = parseInt(chainIdHex!)
  console.log('chainId', chainId, chainIdHex)
  // console.log(`ChainId is ${chainId}`)
  const raffleAddress = chainId in contractAddresses ? (contractAddresses as any)[chainId][0] : null
console.log('raffleAddress', raffleAddress)

const {
  runContractFunction: createLottery,
  data: enterTxResponse,
  isLoading,
  isFetching,
} = useWeb3Contract({
  abi: abi,
  contractAddress: raffleAddress,
  functionName: "createLottery",
  params: {},
})

const handleSuccess = async (tx: any) => {
  try {
      await tx.wait(1)
      console.log('yes, dd')
      onReset()
  } catch (error) {
      console.log(error)
  }
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title || !description || !imageUrl || !prize || !ticketPrice || !expiresAt) return
    const params = {
      title,
      description,
      image: imageUrl,
      totalTickets: prize,
      ticketPrice,
      expiresAt: new Date(expiresAt).getTime(),
    }

    console.log('fasonghe yue')
    await createLottery({
      // onComplete:
      // onError:

      params: {
        params
      },
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    })
  }

  const onReset = () => {
    setTitle('')
    setDescription('')
    setImageUrl('')
    setPrize('')
    setTicketPrice('')
    setExpiresAt('')
  }
  return (
    <div className="min-h-screen bg-slate-100">
        <Header />
        <div className="flex flex-col justify-center items-center mt-20">
          <div className=" flex flex-col items-center justify-center my-5">
            <h1 className="text-2xl font-bold text-slate-800 py-5">Create Jackpots</h1>
            <p className="text-center text-sm text-slate-600">
              We bring a persolan and effective every project we work on. <br />
              which is why our client love why they keep coming back.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <input
                className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                id="imageUrl"
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                id="prize"
                type="number"
                step={0.01}
                min={0.01}
                placeholder="Prize"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <input
                className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                id="ticketPrice"
                type="number"
                step={0.01}
                min={0.01}
                placeholder="Ticket price"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <input
                className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                className="w-full bg-[#0c2856] hover:bg-[#1a396c] text-white font-bold
                py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit Jackpot
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
