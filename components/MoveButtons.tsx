import {Button} from "@mui/material";
import * as React from "react";
import Image from "next/image";
import styles from '../styles/Home.module.css';
import bang from '../static/ICON BANG.png';
import smash from '../static/ICON SMASH.png';
import thrust from '../static/ICON THRUST.png';

const MoveButtons: (props) => JSX.Element = (props) => {
  const { selectedMove, setSelectedMove, currentDefense } = props;

  return (
    <div>
      <div className={styles.moveButtons}>
        <Button
          className={styles.moveOne}
          style={{backgroundColor:`${selectedMove === 1 ? '#CD7123' : '#0D0B0C'}`}}
          onClick={() => {setSelectedMove(1)}}
        >
          <Image
            src={bang}
            alt={'BANG!'}
            fill
          />
        </Button>
        <Button
          className={styles.moveTwo}
          style={{backgroundColor:`${selectedMove === 2 ? '#CD7123' : '#0D0B0C'}`}}
          onClick={() => setSelectedMove(2)}
        >
          <Image
            src={smash}
            alt={'SMASH!'}
            fill
          />
        </Button>
        <Button
          className={styles.moveThree}
          style={{backgroundColor:`${selectedMove === 3 ? '#CD7123' : '#0D0B0C'}`}}
          onClick={() => setSelectedMove(3)}
        >
          <Image
            src={thrust}
            alt={'THRUST!'}
            fill
          />
        </Button>
      </div>
    </div>
  );
};

export default MoveButtons;

