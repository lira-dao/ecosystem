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

import { dexAddress } from '@lira-dao/web3-utils';

import { arbitrumOneChainId } from '../../../constants';
import CopyButton from './CopyButton';
import arbitrumLogo from '../../../img/arbitrum-shield.png';


interface Token {
  name: string;
  address: string;
  arbiscanLink: string;
}

const dexAddresses: Token[] = [
  {
    name: "Lira DEX Factory",
    address: dexAddress[arbitrumOneChainId].factory,
    arbiscanLink: `https://arbiscan.io/address/${dexAddress[arbitrumOneChainId].factory}`
  },
  {
    name: "LIRA DEX Router",
    address: dexAddress[arbitrumOneChainId].router,
    arbiscanLink: `https://arbiscan.io/address/${dexAddress[arbitrumOneChainId].router}`
  }
];

const DexContractsTable: React.FC = () => {
  const handleCopyToClipboard = (address: string) => navigator.clipboard.writeText(address);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="dex table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '35%' }}>Contract</TableCell>
            <TableCell style={{ width: '50%' }}>Address</TableCell>
            <TableCell style={{ width: '15%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dexAddresses.map((dexAddress) => (
            <TableRow key={dexAddress.address}>
              <TableCell>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="body2">
                    {dexAddress.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Typography variant="body2" noWrap>
                    {dexAddress.address}
                  </Typography>
                  <CopyButton onClick={() => handleCopyToClipboard(dexAddress.address)}>
                    Copy
                  </CopyButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <a
                    href={dexAddress.arbiscanLink}
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
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DexContractsTable;
