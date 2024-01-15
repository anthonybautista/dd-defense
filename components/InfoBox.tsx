import {Button} from "@mui/material";
import * as React from "react";
import Image from "next/image";
import {DefenderDashboard} from "./DefenderDashboard";
import {AttackerDashboard} from "./AttackerDashboard";

const InfoBox: (props) => JSX.Element = (props) => {
  const {
    id,
    isDefender,
    toast,
    totalDefenders,
    chain,
    coqApproved,
    refetchApproval,
    refetchStats,
    coq,
    game
  } = props;

  return (
    <div>
      <Image
        src={
          isDefender ?
            `https://dikdiks-api-anthonybautist2.replit.app/api/image/${id}`
          :
            `https://gateway.pinata.cloud/ipfs/QmerHSeAHhZyL3veq5D1HLVWmgfEXbPmozH54uxmKwjAZ5/${id}.png`
        }
        alt={isDefender ? `Dik Dik #${id}` : `Pepe Portrait #${id}`}
        height={300}
        width={300}
      />
      {
        isDefender ?
          <DefenderDashboard
            tokenId={id}
            toast={toast}
            chain={chain}
            coqApproved={coqApproved}
            refetchApproval={refetchApproval}
            refetchStats={refetchStats}
            coq={coq}
            game={game}
          />
          :
          <AttackerDashboard
            tokenId={id}
            toast={toast}
            chain={chain}
            numDefenders={totalDefenders}
            coqApproved={coqApproved}
            refetchApproval={refetchApproval}
            coq={coq}
            game={game}
          />
      }
    </div>
  );
};

export default InfoBox;

