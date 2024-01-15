import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {erc20Abi} from "../consts/abi";
import {Button} from "@mui/material";
import {parseEther} from "viem";

export function ApproveButton(props) {

  const {
    toast,
    refetchApproval,
    chain,
    minApproval,
    coq,
    game
  } = props;

  const {
    config,
  } = usePrepareContractWrite({
    address: coq,
    abi: erc20Abi,
    functionName: 'approve',
    chainId: chain,
    args: [game, parseEther(minApproval)],
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
        disabled={!write || isLoading}
        onClick={() => write ? write() : {}}
        variant="outlined"
        style={{marginBottom: 10, color:'#CD7123', borderColor:'#CD7123', marginTop: 10}}
      >
        Approve $COQ
      </Button>
    </div>
  )
}