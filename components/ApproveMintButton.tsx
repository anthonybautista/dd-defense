import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {erc20Abi} from "../consts/abi";
import {Button, Menu, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";
import {parseEther} from "viem";

export function ApproveMintButton(props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    address,
    mintPrice,
    mintAmount,
    token,
    spender,
    toast,
    chain,
    refetchApproval,
    ticker
  } = props;

  const {
    config,
  } = usePrepareContractWrite({
    address: token,
    abi: erc20Abi,
    functionName: 'approve',
    chainId: chain,
    args: [spender, parseEther((mintPrice * mintAmount).toString())],
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success("Successfully Approved!");
      refetchApproval();
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
          {address && isClient ? `Approve ${ticker}` : 'Not Connected'}
        </Button>
    </div>
  )
}