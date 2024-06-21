import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

import CopyButton from './CopyButton';
import arbitrumLogo from '../../../img/arbitrum-shield.png';


interface Wallet {
  name: string;
  address: string;
  arbiscanLink: string;
}

const teamSafeAddresses: Wallet[] = [
  { name: 'Team Safe', address: '0x67Ca1A1BF9C9253f9aE475aA63e6730F8d4f3885', arbiscanLink: 'https://arbiscan.io/address/0x67Ca1A1BF9C9253f9aE475aA63e6730F8d4f3885' },
  { name: 'Wallet F.Paletta', address: '0xC4d7588b089b1F1b9C1c4D70f5ae9de848aC8d2d', arbiscanLink: 'https://arbiscan.io/address/0xC4d7588b089b1F1b9C1c4D70f5ae9de848aC8d2d' },
  { name: 'Wallet E.Roio', address: '0xD2F5A6274401e860fd4F655424A0A3bf80732d92', arbiscanLink: 'https://arbiscan.io/address/0xD2F5A6274401e860fd4F655424A0A3bf80732d92' },
  { name: 'Wallet J.Iessi', address: '0x72710250265fAfbe9B56c37e5Fdabfa08b892830', arbiscanLink: 'https://arbiscan.io/address/0x72710250265fAfbe9B56c37e5Fdabfa08b892830' },
  { name: 'Wallet N.Angelucci', address: '0x0e0d31371e36cfF1476A19eEa0E77a2A072FB1A8', arbiscanLink: 'https://arbiscan.io/address/0x0e0d31371e36cfF1476A19eEa0E77a2A072FB1A8' },
  { name: 'Wallet G.Passeri', address: '0x0A70f73d2C4c927a606f5DdDf751254455e8cDdA', arbiscanLink: 'https://arbiscan.io/address/0x0A70f73d2C4c927a606f5DdDf751254455e8cDdA' }
];

const TeamSafeContractsTable: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleCopyToClipboard = (address: string) => navigator.clipboard.writeText(address);

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table aria-label="team safe table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '35%' }}>Name</TableCell>
              <TableCell style={{ width: '50%' }}>Address</TableCell>
              <TableCell style={{ width: '15%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow onClick={handleToggle} style={{ cursor: 'pointer' }}>
              <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                {open ? ' Hide Details' : ' Show Details'}
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
            {open && teamSafeAddresses.map((wallet) => (
              <TableRow key={wallet.address}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2">
                      {wallet.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" noWrap>
                      {wallet.address}
                    </Typography>
                    <CopyButton onClick={() => handleCopyToClipboard(wallet.address)}>
                      Copy
                    </CopyButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <a
                      href={wallet.arbiscanLink}
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
    </ThemeProvider>
  );
};

export default TeamSafeContractsTable;
