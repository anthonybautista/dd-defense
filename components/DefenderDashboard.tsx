import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction, useContractRead,
} from 'wagmi'
import {gameAbi} from "../consts/abi";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import MoveButtons from "./MoveButtons";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import {parseEther} from "viem";
import {ApproveButton} from "./ApproveButton";
import {UpdateButton} from "./UpdateButton";
import {RemoveButton} from "./RemoveButton";

type Defense = {
  defense: number;
  stake: bigint;
  stakeModifier: bigint;
  lastUpdate: bigint;
}

export function DefenderDashboard(props) {
  const [isClient, setIsClient] = useState(false)
  const [defense, setDefense] = useState<Defense>({defense:0,stake:BigInt(0),stakeModifier:BigInt(0),lastUpdate:BigInt(0)})
  const [modifier, setModifier] = useState<bigint>(BigInt(0));
  const [selectedMove, setSelectedMove] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [keyMod, setKeyMod] = useState('');
  const minApproval = "10000000";

  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    tokenId,
    toast,
    chain,
    refetchApproval,
    coqApproved,
    refetchStats,
    game,
    coq,
  } = props;

  const {refetch: refetchDefense} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'tokenIdToDefense',
    args: [tokenId],
    chainId: chain,
    onSuccess(data: Defense) {
      console.log(data)
      setDefense(data);
      setSelectedMove(data[0]);
    },
  })

  const {refetch: refetchModifier} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'stakeModifier',
    chainId: chain,
    onSuccess(data) {
      setModifier(data);
    },
  })

  const {refetch: refetchCooldown} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'cooldownForDefender',
    args: [tokenId],
    chainId: chain,
    onSuccess(data) {
      setCooldown(Number(data));
    },
  })

  const {
    config,
  } = usePrepareContractWrite({
    address: game,
    abi: gameAbi,
    functionName: 'defend',
    args: [tokenId, selectedMove],
    chainId: chain,
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success("Defense Set!");
      refetchDefense();
      refetchCooldown();
      refetchStats();
      refetchApproval();
    },
    onError(error) {
      toast.error(error);
    }
  })

  const getStake = () => {
    return (Number(defense[1]) + (Number(modifier) - Number(defense[2]))) / 10**18 / 1000000;
  }

  return (
    <div>
      <p>Select Counter-Attack</p>
      <MoveButtons selectedMove={selectedMove} setSelectedMove={setSelectedMove} currentDefense={defense[0]} />
      {
        cooldown > 0 ?
          <div>
            <p style={{marginBottom:5}}>Cooldown Active</p>
            <div style={{margin:'auto', width:'75px', marginBottom:5}}>
              <CountdownCircleTimer
                isPlaying
                duration={3600}
                initialRemainingTime={cooldown}
                colors={'#CD7123'}
                size={75}
                strokeWidth={5}
                onComplete={() => {
                  setKeyMod(keyMod+'1')
                  refetchCooldown();
                }}
                key={tokenId.toString() + keyMod}
              >
                {({ remainingTime }) => {
                  const minutes = Math.floor(remainingTime / 60)
                  const seconds = remainingTime % 60

                  return `${minutes}m:${seconds}s`
                }}
              </CountdownCircleTimer>
            </div>
          </div>
        :
          <div>
            {
              defense[0] === 0 ?
                <div>
                  {
                    coqApproved >= parseEther(minApproval) ?
                      <Button
                        disabled={!write || isLoading || selectedMove === 0}
                        onClick={() => write ? write() : {}}
                        variant="outlined"
                        style={{marginBottom: 10, color:'#CD7123', borderColor:'#CD7123', marginTop: 10}}
                      >
                        Set Counter-Attack
                      </Button>
                    :
                      <ApproveButton
                        toast={toast}
                        refetchApproval={refetchApproval}
                        chain={chain}
                        minApproval={minApproval}
                        coq={coq}
                        game={game}
                      />
                  }
                </div>
              :
                <div>
                  <UpdateButton
                    toast={toast}
                    refetchDefense={refetchDefense}
                    refetchStats={refetchStats}
                    refetchCooldown={refetchCooldown}
                    chain={chain}
                    game={game}
                    tokenId={tokenId}
                    selectedMove={selectedMove}
                    currentDefense={defense[0]}
                  />
                  <RemoveButton
                    toast={toast}
                    refetchDefense={refetchDefense}
                    refetchStats={refetchStats}
                    refetchCooldown={refetchCooldown}
                    chain={chain}
                    game={game}
                    tokenId={tokenId}
                  />
                </div>
            }
          </div>
      }
      <p>Current Stake: {defense[0] === 0 ? 0 : getStake().toFixed(3)} mil $COQ</p>
    </div>
  )
}