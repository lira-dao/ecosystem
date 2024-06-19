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


interface Staker {
  name: string;
  address: string;
  arbiscanLink: string;
}

const stakerAddresses: Staker[] = [
  {
    name: "LP Staker TBb",
    address: "0x7aFfdD28D244FeBfB4A6e8db14D5aA42AB8396Ce",
    arbiscanLink: "https://arbiscan.io/address/0x7aFfdD28D244FeBfB4A6e8db14D5aA42AB8396Ce"
  },
  {
    name: "LP Staker TBs",
    address: "0x0a84C2f54E3C7A00eb57922eEDB03440429E123b",
    arbiscanLink: "https://arbiscan.io/address/0x0a84C2f54E3C7A00eb57922eEDB03440429E123b"
  },
  {
    name: "LP Staker TBg",
    address: "0xFA8c04138407756dDAe054287df603b3aed39662",
    arbiscanLink: "https://arbiscan.io/address/0xFA8c04138407756dDAe054287df603b3aed39662"
  }
];

const StakerContractsTable: React.FC = () => {
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
            {stakerAddresses.map((staker) => (
              <TableRow key={staker.address}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2">
                      {staker.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body2" noWrap>
                      {staker.address}
                    </Typography>
                    <CopyButton onClick={() => handleCopyToClipboard(staker.address)}>
                      Copy
                    </CopyButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <a
                      href={staker.arbiscanLink}
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

export default StakerContractsTable;
