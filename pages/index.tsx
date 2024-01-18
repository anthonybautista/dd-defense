'use client';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import logo from '/static/Logo.png';
import mintBG from '/static/Header2.png';
import ddgif from '/static/dikdikgif.gif';
import ring from '/static/Boxing_Ring.png';
import bang from '../static/ICON BANG.png';
import smash from '../static/ICON SMASH.png';
import thrust from '../static/ICON THRUST.png';
import React, {useEffect, useState} from "react";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAccount, useContractEvent, useContractRead,} from 'wagmi'
import {dikdikAbi, erc20Abi, gameAbi, pepeAbi} from "../consts/abi";
import {Button, ButtonGroup, Divider, Grid, Menu, MenuItem} from "@mui/material";
import InfoBox from "../components/InfoBox";
import BattleResult from "../components/BattleResult";

type Attack = {
  attack: number;
  defense: number;
  successful: number;
  complete: number;
  attackerTokenId: bigint;
  defenderTokenId: bigint;
  stake: bigint;
  spoils: bigint;
  id: bigint;
  attackerOwner: `0x${string}`;
  defenderOwner: `0x${string}`;
}

type Stats = {
  bang: bigint;
  smash: bigint;
  thrust: bigint;
  total: bigint;
}

const Home: NextPage = () => {
  const chain = 43114;
  const pepes = '0x40801889321743cD0Dcb6E4C15eaa584b36564DC';
  const dikdiks = '0x8Fe7EB2b9d26a73Ea8C8234aAcD0de81FcbA50F5';
  const coq = '0x420FcA0121DC28039145009570975747295f2329';
  const game = '0xe2046556bb9d2581Ed5B2d7B38009921e4c5627E';
  const mintPrice = 6900000;
  const [mintAmount, setMintAmount] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isDefender, setIsDefender] = useState(true);
  const [selectedToken, setSelectedToken] = useState("Select NFT");
  const [coqApproved, setCoqApproved] = useState(0);
  const [coqMintApproved, setCoqMintApproved] = useState(0);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [userDikDiks, setUserDikDiks] = useState<bigint[]>([]);
  const [userPepes, setUserPepes] = useState<bigint[]>([]);
  const [supply, setSupply] = useState(0);
  const { address } = useAccount();
  const mintAmounts = [1,2,3,4,5,6,7,8,9,10];
  const [defenderStats, setDefenderStats] = useState<Stats>({thrust:BigInt(0), bang:BigInt(0), smash:BigInt(0), total:BigInt(0)})
  const [isClient, setIsClient] = useState(false)

  const attacksForAttacker = (token) => {
    return attacks.filter(a => Number(token) === Number(a.attackerTokenId));
  }

  const attacksForDefender = (token) => {
    return attacks.filter(a => Number(token) === Number(a.defenderTokenId));
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleTokenClose = (selection: string) => {
    setSelectedToken(selection);
    setAnchorEl2(null);
  };

  const open = Boolean(anchorEl);
  const openToken = Boolean(anchorEl2);

  const handleAmountClose = (selection: number) => {
    setMintAmount(selection);
    setAnchorEl(null);
  };

  const safeAddress = () => {
    return address ? address : '0x0000000000000000000000000000000000000000';
  }

  const {refetch: refetchPepes} = useContractRead({
    address: pepes,
    abi: pepeAbi,
    functionName: 'walletOfOwner',
    args: [safeAddress()],
    chainId: chain,
    onSuccess(data: bigint[]) {
      console.log(data)
      setUserPepes(data);
    },
  })

  const {refetch: refetchDikDiks} = useContractRead({
    address: dikdiks,
    abi: dikdikAbi,
    functionName: 'tokensOfOwner',
    args: [safeAddress()],
    chainId: chain,
    onSuccess(data: bigint[]) {
      console.log(data)
      setUserDikDiks(data);
    },
  })

  const {refetch: refetchSupply} = useContractRead({
    address: dikdiks,
    abi: dikdikAbi,
    functionName: 'totalSupply',
    chainId: chain,
    onSuccess(data) {
      setSupply(Number(data));
    },
  })

  const {refetch: refetchAttacks} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'getAttacks',
    chainId: chain,
    onSuccess(data: Attack[]) {
      console.log(data)
      setAttacks(data);
    },
  })

  const {refetch: refetchApproval} = useContractRead({
    address: coq,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [safeAddress(), game],
    chainId: chain,
    onSuccess(data) {
      setCoqApproved(Number(data))
    },
  })

  const {refetch: refetchMintApproval} = useContractRead({
    address: coq,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [safeAddress(), dikdiks],
    chainId: chain,
    onSuccess(data) {
      console.log(data)
      setCoqMintApproved(Number(data))
    },
  })

  const {refetch: refetchStats} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'defenderStats',
    chainId: chain,
    onSuccess(data: Stats) {
      console.log(data)
      setDefenderStats(data);
    },
  })

  useContractEvent({
    address: game,
    abi: gameAbi,
    eventName: 'AttackCompleted',
    chainId: chain,
    listener(log) {
      console.log(log)
      refetchAttacks();
      refetchStats();
    },
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Dik Dik Defense</title>
        <meta
          content="Dik Diks are magical creatures that must defend themselves from agressive coqs."
          name="Dik Dik Defense"
        />
        <meta property="og:url" content="https://www.dikdikdefense.com/"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Dik Dik Defense"/>
        <meta property="og:description" content="Deep in the Hardwood Forest lived a magical creature known as the Dik Dik."/>
        <meta property="og:image" content="https://cdn.blockviper.com/og/dikdik_og.jpg"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="twitter:domain" content="dikdikdefense.com"/>
        <meta property="twitter:url" content="https://www.dikdikdefense.com/"/>
        <meta name="twitter:title" content="Dik Dik Defense"/>
        <meta name="twitter:description" content="Deep in the Hardwood Forest lived a magical creature known as the Dik Dik."/>
        <meta name="twitter:image" content="https://cdn.blockviper.com/og/dikdik_og.jpg"/>
        <link href="/static/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ToastContainer
          position="top-right"
          theme="dark"
        />

        <div id="logo">
          <Image
            width={300}
            height={300}
            src={logo}
            id="logo"
            alt="Dik Dik Defense Logo"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <ConnectButton />
        <br/>

        <p className={styles.description}>
          Deep in the Hardwood Forest lived a magical creature known as the Dik Dik.
        </p>

        <Image
          width={300}
          height={300}
          src={ddgif}
          id="logo"
          alt="Dik Dik Examples GIF"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
        />

        <p className={styles.description}>
          These cute, deer-like animals
          lived peaceful and happy lives until they were threatened by a group of agressive coqs.
        </p>

        <p className={styles.description}>
          Mint a Dik Dik for 6.9 million $COQ, and defend yourself against attackers for a chance to earn $COQ. Read
          more here: &nbsp;
          <a className={styles.fancyLink}
             href="https://docs.dikdiknft.com"
             target="_blank" rel="noopener noreferrer">Game Rules and Info.</a>
        </p>

        <div className={styles.grid}>

          <div className={styles.card}>
            <Image
              className={styles.mintBg}
              src={mintBG}
              alt={'Hardwood Forest with Dik Dik'}
              fill
              style={{objectFit:'cover', objectPosition:'center'}}
            />
            <div
              style={{
                backgroundColor:'#0D0B0C',
                position:'relative',
                zIndex:1,
                width:175,
                margin:'auto',
                borderRadius:5,
                padding:5,
              }}
            >
              <h2>Mint a Dik Dik</h2>
              <p>Total Minted:</p>
              <p>{supply} / 420</p>
              <Divider style={{borderColor:'#CD7123', marginTop:10}}/>
              <Button
                disabled
                variant="outlined"
                style={{marginBottom: 10, color:'#CD7123', borderColor:'#CD7123', marginTop: 10}}
              >
                SOLD OUT
              </Button>
            </div>
          </div>

          <div className={styles.ringCard}>
            <Image
              className={styles.ringBg}
              src={ring}
              alt={'The COQ Ring'}
              fill
              style={{objectFit:'cover', objectPosition:'center'}}
            />
            <div
              style={{
                backgroundColor:'#0D0B0C',
                position:'relative',
                zIndex:1,
                width:300,
                margin:'auto',
                borderRadius:5,
                padding:5,
                paddingBottom:10,
                marginBottom:10
              }}
            >
              <h2 className={styles.ringH2}>Enter the COQ Ring</h2>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Button
                  style={{
                    borderColor:'#CD7123',
                    color:`${isDefender ? '#0D0B0C' : '#CD7123'}`,
                    backgroundColor:`${isDefender ? '#CD7123' : '#0D0B0C'}`
                  }}
                  onClick={() => {setIsDefender(true);handleTokenClose('Select NFT');}}
                >
                  Defend
                </Button>
                <Button style={{
                  borderColor:'#CD7123',
                  color:`${isDefender ? '#CD7123' : '#0D0B0C'}`,
                  backgroundColor:`${isDefender ? '#0D0B0C' : '#CD7123'}`
                  }}
                  onClick={() => {setIsDefender(false);handleTokenClose('Select NFT');}}
                >
                  Attack
                </Button>
              </ButtonGroup>
              <p>Current Defenders</p>
              <div className={styles.statsDiv}>
                <Button className={styles.statsImageOne} disabled>
                  <Image
                    src={bang}
                    alt={'BANG!'}
                    fill
                  />
                </Button>
                <p className={styles.statsAmountOne}>{Number(defenderStats[0])}</p>
                <Button className={styles.statsImageTwo} disabled>
                  <Image
                    src={smash}
                    alt={'SMASH!'}
                    fill
                  />
                </Button>
                <p className={styles.statsAmountTwo}>{Number(defenderStats[1])}</p>
                <Button className={styles.statsImageThree} disabled>
                  <Image
                    src={thrust}
                    alt={'THRUST!'}
                    fill
                  />
                </Button>
                <p className={styles.statsAmountThree}>{Number(defenderStats[2])}</p>
              </div>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div
                  style={{
                    position:'relative',
                    zIndex:2,
                    minHeight:600,
                    margin:'auto',
                    borderRadius:5,
                    padding:5,
                    paddingBottom:10
                  }}
                >
                  <div
                    style={{
                      backgroundColor:'#0D0B0C',
                      position:'relative',
                      zIndex:1,
                      width:'80%',
                      margin:'auto',
                      borderRadius:5,
                      padding:5,
                    }}
                  >
                    <h4 className={styles.ringH2}>{`Select ${isDefender ? 'Defender' : 'Attacker'}`}</h4>
                    {
                      address && isClient ?
                        <div>
                          <Button
                            id="token-button"
                            aria-controls={openToken ? 'token-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openToken ? 'true' : undefined}
                            onClick={handleClick2}
                            variant="outlined"
                            style={{marginBottom: 10, color:'#CD7123', borderColor:'#CD7123', marginTop: 10}}
                          >
                            {selectedToken}
                          </Button>
                          <Menu
                            id="token-menu"
                            anchorEl={anchorEl2}
                            open={openToken}
                            onClose={() => handleTokenClose('Select NFT')}
                            MenuListProps={{
                              'aria-labelledby': 'token-button',
                            }}
                          >
                            {
                              isDefender ?
                                userDikDiks.map((t) => (
                                  <MenuItem onClick={() => handleTokenClose(Number(t).toString())} key={Number(t)}>{Number(t)}</MenuItem>
                                ))
                                :
                                userPepes.map((t) => (
                                  <MenuItem onClick={() => handleTokenClose(Number(t).toString())} key={Number(t)}>{Number(t)}</MenuItem>
                                ))
                            }
                          </Menu>
                        </div>
                      :
                        <p>Not Connected!</p>
                    }
                    {
                      selectedToken !== 'Select NFT' ?
                        <InfoBox
                          id={selectedToken}
                          isDefender={isDefender}
                          toast={toast}
                          totalDefenders={Number(defenderStats[3])}
                          chain={chain}
                          coqApproved={coqApproved}
                          refetchApproval={refetchApproval}
                          refetchStats={refetchStats}
                          coq={coq}
                          game={game}
                        />
                        :
                        <div></div>
                    }
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div
                  style={{
                    position:'relative',
                    zIndex:2,
                    minHeight:600,
                    margin:'auto',
                    borderRadius:5,
                    padding:5,
                    paddingBottom:10
                  }}
                >
                  <div
                    style={{
                      backgroundColor:'#0D0B0C',
                      position:'relative',
                      zIndex:1,
                      width:'80%',
                      margin:'auto',
                      borderRadius:5,
                      padding:5,
                    }}
                  >
                    {
                      selectedToken !== 'Select NFT' ?
                        <div>
                          <h4 className={styles.ringH2}>
                            {`${isDefender ? 'Dik Dik #' : 'Pepe Portrait #'}${selectedToken} Recent Battles`}
                          </h4>
                          {
                            isDefender ?
                              attacksForDefender(selectedToken).map((a) => (
                                <BattleResult
                                  attack={a.attack}
                                  defense={a.defense}
                                  successful={a.successful}
                                  spoils={
                                    !a.successful ? Number(a.stake) * 0.8 / 10**18 : 0
                                  }
                                  isDefender={isDefender}
                                  id={a.id}
                                  key={a.id}
                                />
                              ))
                            :
                              attacksForAttacker(selectedToken).map((a) => (
                                <BattleResult
                                  attack={a.attack}
                                  defense={a.defense}
                                  successful={a.successful}
                                  spoils={Number(a.spoils) / 10**18}
                                  isDefender={isDefender}
                                  id={a.id}
                                  key={a.id}
                                />
                              ))
                          }
                        </div>
                      :
                        <h4 className={styles.ringH2}>{`No ${isDefender ? 'Defender' : 'Attacker'} Selected`}</h4>
                    }

                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <div>
          <p>
            Dev:&nbsp;
            <a className={styles.fancyLink}
               href="https://x.com/xrpant"
               target="_blank" rel="noopener noreferrer">@xrpant</a>
            &nbsp; | Art:&nbsp;
            <a className={styles.fancyLink}
               href="https://x.com/0xBrie"
               target="_blank" rel="noopener noreferrer">@0xBrie</a>
            &nbsp; | Project:&nbsp;
            <a className={styles.fancyLink}
               href="https://x.com/dikdikNFT"
               target="_blank" rel="noopener noreferrer">@dikdikNFT</a>
          </p>
        </div>
        <div>
          <p style={{fontWeight:'bold'}}>
            This protocol has not been audited. Play at your own risk.<br/>
            DO NOT stake more than you are willing to lose.
            DO NOT engage with crypto assets or protocols that are not legal in your jurisdiction.
          </p>
        </div>
        <div>
          <a className={styles.fancyLink}
             href="https://docs.dikdiknft.com"
             target="_blank" rel="noopener noreferrer">Docs</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
