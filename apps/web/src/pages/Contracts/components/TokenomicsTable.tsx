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
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme_mui';

import CopyButton from './CopyButton';
import arbitrumLogo from '../../../img/arbitrum-shield.png';


interface Tokenomics {
  name: string;  // contract name
  address: string;
  arbiscanLink: string;
}

const tokenomicsAddresses: Tokenomics[] = [
  {
    name: "Token Distributor",
    address: "0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11",
    arbiscanLink: "https://arbiscan.io/address/0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11"
  },
  {
    name: "Reward Splitter",
    address: "0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE",
    arbiscanLink: "https://arbiscan.io/address/0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE"
  }
];

const TokenomicsTable: React.FC = () => {
  const handleCopyToClipboard = (address: string) => navigator.clipboard.writeText(address);

  return (
    <ThemeProvider theme={theme}>
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
            {tokenomicsAddresses.map((tokenomics) => (
              <TableRow key={tokenomics.address}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2">
                      {tokenomics.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" noWrap>
                      {tokenomics.address}
                    </Typography>
                    <CopyButton onClick={() => handleCopyToClipboard(tokenomics.address)}>
                      Copy
                    </CopyButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <a
                      href={tokenomics.arbiscanLink}
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

export default TokenomicsTable;
