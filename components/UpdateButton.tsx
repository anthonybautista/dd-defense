import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {gameAbi} from "../consts/abi";
import {Button} from "@mui/material";

export function UpdateButton(props) {

  const {
    toast,
    refetchDefense,
    refetchStats,
    refetchCooldown,
    chain,
    game,
    tokenId,
    selectedMove,
    currentDefense,
  } = props;

  const {
    config,
  } = usePrepareContractWrite({
    address: game,
    abi: gameAbi,
    functionName: 'updateDefense',
    args: [tokenId, selectedMove],
    chainId: chain,
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success("Defense Updated!");
      refetchDefense();
      refetchCooldown();
      refetchStats();
    },
    onError(error) {
      toast.error(error);
    }
  })

  return (
    <div>
      <Button
        disabled={!write || isLoading || currentDefense === selectedMove}
        onClick={() => write ? write() : {}}
        variant="outlined"
        style={{marginBottom: 10, color:'#CD7123', borderColor:'#CD7123', marginTop: 10}}
      >
        Update Defense
      </Button>
    </div>
  )
}