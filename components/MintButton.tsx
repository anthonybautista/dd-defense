import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {dikdikAbi} from "../consts/abi";
import {Button, Menu, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";

export function MintButton(props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    address,
    mintAmount,
    contract,
    toast,
    chain,
    refetchApproval,
    refetchSupply,
    refetchDikDiks
  } = props;

  const {
    config,
  } = usePrepareContractWrite({
    address: contract,
    abi: dikdikAbi,
    functionName: 'mint',
    args: [mintAmount],
    chainId: chain,
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success("Successfully Minted!");
      refetchApproval();
      refetchSupply();
      refetchDikDiks();
    },
    onError(error) {
      toast.error(error);
    }
  })

  return (
    <div>
        <Button
          variant="contained"
          style={{marginBottom: 10, backgroundColor:'#CD7123', borderColor:'#CD7123', color:'#0D0B0C'}}
          disabled={!address || !write || isLoading}
          onClick={() => write ? write() : {}}
        >
          {address && isClient ? 'Mint' : 'Not Connected'}
        </Button>
    </div>
  )
}