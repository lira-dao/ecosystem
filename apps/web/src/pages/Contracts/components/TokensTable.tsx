import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';

import { tokens } from '@lira-dao/web3-utils';
import {
  addLiraDaoToken,
  addLiraToken,
  addTreasuryBondBronzeToken,
  addTreasuryBondGoldToken,
  addTreasuryBondSilverToken,
} from '../../../utils/addLiraToken';  /* TODO: MOVE */

import { arbitrumOneChainId } from '../../../constants';
import CopyButton from './CopyButton';
import arbitrumLogo from '../../../img/arbitrum-shield.png';
import dexScreenerLogo from '../../../img/dex-screener.svg';
import metamaskFoxLogo from '../../../img/metamask-fox.svg';


interface Token {
  name: string;
  address: string;
  addTokenToWallet: () => void;
  arbiscanLink: string;
  dexScreenerLink: string;
}

const liraDaoTokens: Token[] = [
  {
    name: "Satoshi LIRA (LIRA)",
    address: tokens[arbitrumOneChainId].lira,
    arbiscanLink: "https://arbiscan.io/address/0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3",
    dexScreenerLink: "https://dexscreener.com/arbitrum/0x9F0818aF51fd217A88ccfEf21669979B2570091A",
    addTokenToWallet: addLiraToken
  },
  {
    name: "LIRA DAO Token (LDT)",
    address: tokens[arbitrumOneChainId].ldt,
    arbiscanLink: "https://arbiscan.io/address/0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f",
    dexScreenerLink: "https://dexscreener.com/arbitrum/0xc828f6c8bbf9a90db6db9839696ffbf6e06532f9",
    addTokenToWallet: addLiraDaoToken
  },
  {
    name: "Treasury Bond Bronze (TBb)",
    address: tokens[arbitrumOneChainId].tbb,
    arbiscanLink: "https://arbiscan.io/address/0x9C0385b4F1f3B277ab352B817fC56763081a503c",
    dexScreenerLink: "https://dexscreener.com/arbitrum/0xAfb2aaA7b90905f32fDb3E61010F0dc2705827ca",
    addTokenToWallet: addTreasuryBondBronzeToken
  },
  {
    name: "Treasury Bond Silver (TBs)",
    address: tokens[arbitrumOneChainId].tbs,
    arbiscanLink: "https://arbiscan.io/address/0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1",
    dexScreenerLink: "https://dexscreener.com/arbitrum/0xaFFEBBcbd0DD5AEDeCCdAB84b4103828780fD972",
    addTokenToWallet: addTreasuryBondSilverToken
  },
  {
    name: "Treasury Bond Gold (TBg)",
    address: tokens[arbitrumOneChainId].tbg,
    arbiscanLink: "https://arbiscan.io/address/0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5",
    dexScreenerLink: "https://dexscreener.com/arbitrum/0xe24dB13D645218672D4D5Fc15f572328b32946A4",
    addTokenToWallet: addTreasuryBondGoldToken
  }
];

const TokensTable: React.FC = () => {
  const handleCopyToClipboard = (address: string) => navigator.clipboard.writeText(address);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="tokens table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '35%' }}>Name</TableCell>
            <TableCell style={{ width: '50%' }}>Address</TableCell>
            <TableCell style={{ width: '15%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {liraDaoTokens.map((token) => (
            <TableRow key={token.address}>
              <TableCell>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="body2" noWrap>
                    {token.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="body2" noWrap>
                    {token.address}
                  </Typography>
                  <CopyButton onClick={() => handleCopyToClipboard(token.address)}>
                    Copy
                  </CopyButton>
                </Box>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                  <a
                    href={token.arbiscanLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: 'pointer', marginRight: 10 }}
                  >
                    <img
                      src={arbitrumLogo}
                      alt="arbitrum icon"
                      width={30}
                    />
                  </a>
                  <a
                    href={token.dexScreenerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: 'pointer', marginRight: 15 }}
                  >
                    <img
                      src={dexScreenerLogo}
                      alt="dexscreener icon"
                      width={20}
                    />
                  </a>
                  <img
                    src={metamaskFoxLogo}
                    alt="metamask icon"
                    width={30}
                    style={{ cursor: 'pointer' }}
                    onClick={() => token.addTokenToWallet()}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TokensTable;
