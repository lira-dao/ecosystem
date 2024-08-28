import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

type TradePriceImpactProps = {
  priceImpact: string;
};

const getImpactColor = (impact: number) => {
  if (impact === 0) return '#FFFFFF';

  if (impact >= 100) return '#8B0000';
  if (impact >= 75) return '#A00000';
  if (impact >= 50) return '#FF4D4D';
  if (impact >= 25) return '#FF6A6A';
  if (impact >= 10) return '#FFA726';
  if (impact >= 5) return '#FF8C42';
  if (impact > 1) return '#FFD166';

  return '#9E9E9E';
};

const formatImpactValue = (impact: number) => {
  if (impact === 0) return '0.00';

  if (impact >= 0.01) {
    return impact.toFixed(2);
  }

  // TODO: Evaluate, Show as many decimal places as necessary until a non-zero digit appears
  let formattedValue = impact.toPrecision(2);
  if (parseFloat(formattedValue) === 0) {
    formattedValue = impact.toExponential(2);
  }
  return formattedValue;
};

const TradePriceImpact: React.FC<TradePriceImpactProps> = ({ priceImpact }) => {
  const impact = parseFloat(priceImpact);

  const displayImpact = impact === 0 ? 0 : Math.abs(impact);
  const impactColor = getImpactColor(displayImpact);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="body1">
          Price Impact
          <Tooltip title="The impact your trade has on the market price of this pool.">
            <InfoIcon
              fontSize="small"
              sx={{ ml: 1, verticalAlign: 'middle' }}
            />
          </Tooltip>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: impactColor,
          }}
        >
          -{formatImpactValue(displayImpact)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default TradePriceImpact;
