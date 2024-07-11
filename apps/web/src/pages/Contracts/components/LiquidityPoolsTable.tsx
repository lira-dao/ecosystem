import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Link,
  Box,
  Typography
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

import { EthereumAddress, tokens , dexPairs } from '@lira-dao/web3-utils';
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


interface Pair {
  name: string;
  address: EthereumAddress;
  arbiscanLink: string;
  dexScreenerLink: string;
}

const liraDaoPools: Pair[] = Object.keys(dexPairs[arbitrumOneChainId]).map((key: string) => {
  const pair = dexPairs[arbitrumOneChainId][key as EthereumAddress];
  return {
    name: pair.symbol,
    address: pair.address,
    arbiscanLink: `https://arbiscan.io/address/${pair.address}`,
    dexScreenerLink: `https://dexscreener.com/arbitrum/${pair.address}`,
  };
});

const LiquidityPoolsTable: React.FC = () => {
  const handleCopyToClipboard = (address: EthereumAddress) => navigator.clipboard.writeText(address);
  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table aria-label="pools table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '35%' }}>Pair</TableCell>
              <TableCell style={{ width: '50%' }}>Address</TableCell>
              <TableCell style={{ width: '15%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {liraDaoPools.map((pair: Pair) => (
              <TableRow key={pair.address}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" noWrap>
                      {pair.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" noWrap>
                      {pair.address}
                    </Typography>
                    <CopyButton onClick={() => handleCopyToClipboard(pair.address)}>
                      Copy
                    </CopyButton>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <a
                      href={pair.arbiscanLink}
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
                      href={pair.dexScreenerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={dexScreenerLogo}
                        alt="dexscreener icon"
                        width={20}
                      />
                    </a>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default LiquidityPoolsTable;
