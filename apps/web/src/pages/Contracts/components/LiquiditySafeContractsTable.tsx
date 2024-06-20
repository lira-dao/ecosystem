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
import theme from '../../../theme_mui';

import CopyButton from './CopyButton';
import arbitrumLogo from '../../../img/arbitrum-shield.png';


interface Wallet {
  name: string;
  address: string;
  arbiscanLink: string;
}

const liquiditySafeAddresses: Wallet[] = [
  { name: 'Liquidity Safe', address: '0x5C852c448e218e09510248201EA478741D902d3F', arbiscanLink: 'https://arbiscan.io/address/0x5C852c448e218e09510248201EA478741D902d3F' },
  { name: 'Wallet Federico', address: '0x88adac19584a893aff6D1D545C1E3F16decB2929', arbiscanLink: 'https://arbiscan.io/address/0x88adac19584a893aff6D1D545C1E3F16decB2929' },
  { name: 'Wallet Erwin', address: '0xA21af6c98ce1792eB68770dcf4F94b3d19daFabc', arbiscanLink: 'https://arbiscan.io/address/0xA21af6c98ce1792eB68770dcf4F94b3d19daFabc' },
  { name: 'Wallet Jacopo', address: '0x48A7C14F0B515c454EB74c5148d0eA19c42eE6ce', arbiscanLink: 'https://arbiscan.io/address/0x48A7C14F0B515c454EB74c5148d0eA19c42eE6ce' },
  { name: 'Wallet Nicholas', address: '0x6d62d10D72752baE9695e83BB5Ca62748eb3a411', arbiscanLink: 'https://arbiscan.io/address/0x6d62d10D72752baE9695e83BB5Ca62748eb3a411' },
  { name: 'Wallet Gabriele', address: '0x098F23E7416B03F1DB2828cBABCd1F72714bceF1', arbiscanLink: 'https://arbiscan.io/address/0x098F23E7416B03F1DB2828cBABCd1F72714bceF1' }
];

const LiquiditySafeContractsTable: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleCopyToClipboard = (address: string) => navigator.clipboard.writeText(address);

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table aria-label="liquidity safe table">
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
            {open && liquiditySafeAddresses.map((wallet) => (
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

export default LiquiditySafeContractsTable;
