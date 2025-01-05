import { abi, contractAddresses } from '@/doc';
import { useEffect } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';

export function useContract(
  contractFunName: string,
  params: Record<string, unknown>,
  isAuto: boolean
) {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex!);
  console.log('chainId', chainId, chainIdHex);
  // console.log(`ChainId is ${chainId}`)
  const raffleAddress =
    chainId in contractAddresses
      ? (contractAddresses as any)[chainId][0]
      : null;
  console.log('raffleAddress', raffleAddress);

  const { data, runContractFunction, error, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: contractFunName,
    params,
  });

  useEffect(() => {
    if (!isAuto) {
      return;
    }
    if (!isWeb3Enabled) {
      return;
    }
    const get = async () => {
      const values = await runContractFunction({
        onError: (error) => console.log(error),
        onSuccess: (data) => console.log(data, '-> data'),
      });
      console.log(values, '-> ', contractFunName);
    };
    get();
  }, [runContractFunction, raffleAddress, isWeb3Enabled, isAuto]);

  return [data, error, isLoading, runContractFunction] as const;
}
