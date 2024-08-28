import React from 'react';
import { Box, Link, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles';

type FeeProps = {
  feeAmount: number;
  feePercentage: number;
};

const Fee: React.FC<FeeProps> = ({ feeAmount, feePercentage }) => {
  const theme = useTheme();

  const tooltipContent = (
    <Box>
      <Typography variant="caption">
        This fee applies to select token pairs to ensure optimal trading experience on Lira Dex. It is deducted from the output token and is already included in the quoted price.
      </Typography>
      <Link
        href="https://whitepaper.liradao.org/LIRA-DEX.md/LIRA-DEX"
        target="_blank"
        rel="noopener"
        sx={{
          mt: 1,
          display: 'block',
          color: theme.colors.green[400],
          textDecoration: 'none',
          fontWeight: 'bold',
          '&:hover': {
            color: 'white',
          },
        }}
      >
        Learn more
      </Link>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Typography variant="body1">
          Fee
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ({(feePercentage * 100).toFixed(2)}%)
        </Typography>
        <Tooltip title={tooltipContent}>
          <InfoIcon
            fontSize="small"
            sx={{ ml: 1, verticalAlign: 'middle', cursor: 'pointer' }}
          />
        </Tooltip>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        {feeAmount === 0 ? '$0.00' : feeAmount < 0.01 ? '< $0.01' : `$${feeAmount.toFixed(2)}`}
      </Typography>
    </Box>
  );
};

export default Fee;
