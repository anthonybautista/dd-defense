import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction, useContractRead,
} from 'wagmi'
import {gameAbi} from "../consts/abi";
import {Button, Menu, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";
import MoveButtons from "./MoveButtons";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import {toFixed} from "i18n-js/typings/helpers/toFixed";
import {parseEther} from "viem";
import {ApproveButton} from "./ApproveButton";

export function AttackerDashboard(props) {
  const [isClient, setIsClient] = useState(false)
  const [selectedMove, setSelectedMove] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [keyMod, setKeyMod] = useState('');
  const minApproval = "5000000";

  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    tokenId,
    toast,
    chain,
    numDefenders,
    coqApproved,
    refetchApproval,
    game,
    coq
  } = props;

const {refetch: refetchCooldown} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'cooldownForAttacker',
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
    functionName: 'attack',
    args: [tokenId, selectedMove],
    chainId: chain,
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success("Attack Made!");
      refetchCooldown();
      refetchApproval();
    },
    onError(error) {
      toast.error(error);
    }
  })

  return (
    <div>
      <p>Select Attack</p>
      <MoveButtons selectedMove={selectedMove} setSelectedMove={setSelectedMove} currentDefense={0} />
      {
        cooldown > 0 ?
          <div>
            <p style={{marginBottom:5}}>Cooldown Active</p>
            <div style={{margin:'auto', width:'75px', marginBottom:5}}>
              <CountdownCircleTimer
                isPlaying
                duration={900}
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
              coqApproved >= parseEther(minApproval) ?
                <Button
                  disabled={!write || isLoading || selectedMove === 0 || numDefenders < 5}
                  onClick={() => write ? write() : {}}
                  variant="outlined"
                  style={{marginBottom: 10, color:'#CD7123', borderColor:'#CD7123', marginTop: 10}}
                >
                  {numDefenders < 5 ? 'Not Enough Defenders' : 'Attack'}
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
      }
    </div>
  )
}