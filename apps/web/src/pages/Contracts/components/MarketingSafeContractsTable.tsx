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

const marketingSafeAddresses: Wallet[] = [
  { name: 'Marketing Safe', address: '0xfe302984015FD1308448e8dfaB7898907f20c39c', arbiscanLink: 'https://arbiscan.io/address/0xfe302984015FD1308448e8dfaB7898907f20c39c' },
  { name: 'Wallet Federico', address: '0xDCfEE97113be3fb92C7E5F588e17Ec52b0F0cB6A', arbiscanLink: 'https://arbiscan.io/address/0xDCfEE97113be3fb92C7E5F588e17Ec52b0F0cB6A' },
  { name: 'Wallet Erwin', address: '0x6d44EA07013D3614C98b9a494f97163eA28ce0Be', arbiscanLink: 'https://arbiscan.io/address/0x6d44EA07013D3614C98b9a494f97163eA28ce0Be' },
  { name: 'Wallet Jacopo', address: '0x99d16B139f5c9A0844B72619fb36D5Fb2fEa8B1e', arbiscanLink: 'https://arbiscan.io/address/0x99d16B139f5c9A0844B72619fb36D5Fb2fEa8B1e' },
  { name: 'Wallet Nicholas', address: '0x862149B7ee3C554597D78d469D43C334eaBE09Ac', arbiscanLink: 'https://arbiscan.io/address/0x862149B7ee3C554597D78d469D43C334eaBE09Ac' },
  { name: 'Wallet Gabriele', address: '0x178314CA22892d87bb3E377AbC2B0F22D8BF537c', arbiscanLink: 'https://arbiscan.io/address/0x178314CA22892d87bb3E377AbC2B0F22D8BF537c' }
];

const MarketingSafeContractsTable: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleCopyToClipboard = (address: string) => navigator.clipboard.writeText(address);

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table aria-label="marketing safe table">
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
            {open && marketingSafeAddresses.map((wallet) => (
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

export default MarketingSafeContractsTable;
