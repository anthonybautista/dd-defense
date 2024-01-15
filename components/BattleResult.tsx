import {Button} from "@mui/material";
import * as React from "react";
import Image from "next/image";
import styles from '../styles/Home.module.css';
import cross from '../static/CROSS.png';
import tick from '../static/TICK.png';
import bang from "../static/ICON BANG.png";
import smash from "../static/ICON SMASH.png";
import thrust from "../static/ICON THRUST.png";

const InfoBox: (props) => JSX.Element = (props) => {
  const {
    attack,
    defense,
    successful,
    spoils,
    isDefender,
    id
  } = props;

  const moveMapping = {1: "BANG!", 2: "SMASH!", 3: "THRUST!"};

  const isSuccessful = () => {
    if(isDefender) {
      return !successful;
    }
    return successful;
  }

  const moveInfo = (move) => {
    if(move === 1) {
      return bang;
    } else if (move === 2) {
      return smash;
    }
    return thrust;
  }

  return (
    <div
      className={styles.result}
      style={{
        position:'relative',
        zIndex:2,
        margin:'auto',
        borderRadius:5,
        padding:5,
        paddingBottom:10,
        maxWidth: 375,
        borderColor: '#CD7123',
        borderWidth:2,
        borderStyle: "solid",
        marginBottom: 5
      }}
    >
      <p className={styles.resultIdText}>Id</p>
      <Button className={styles.resultIdValue} disabled>
        <p style={{color:"#CD7123"}}>{Number(id)}</p>
      </Button>
      <p className={styles.resultSuccessText}>Success</p>
      <Button className={styles.resultSuccessImage} disabled>
        <Image
          src={isSuccessful() ? tick : cross}
          alt={isSuccessful() ? "Success" : "Failure"}
          fill
        />
      </Button>
      <p className={styles.resultAttackText}>Attack</p>
      <Button className={styles.resultAttackImage} disabled>
        <Image
          src={moveInfo(attack)}
          alt={moveMapping[attack]}
          fill
        />
      </Button>
      <p className={styles.resultDefenseText}>Defense</p>
      <Button className={styles.resultDefenseImage} disabled>
        <Image
          src={moveInfo(defense)}
          alt={moveMapping[defense]}
          fill
        />
      </Button>
      <p className={styles.resultSpoilsText}>Spoils</p>
      <Button className={styles.resultSpoilsValue} disabled>
        <p style={{color:"#CD7123"}}>{(Number(spoils) / 1000000).toFixed(3)}M</p>
      </Button>
    </div>
  );
};

export default InfoBox;

