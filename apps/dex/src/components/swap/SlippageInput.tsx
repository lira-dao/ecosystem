import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

type SlippageInputProps = {
  slippage: number;
  setSlippage: (value: number) => void;
  expectedOutput: string;
  outputToken: string;
};

const SlippageInput: React.FC<SlippageInputProps> = ({
  slippage,
  setSlippage,
  expectedOutput,
  outputToken,
}) => {
  const [inputValue, setInputValue] = useState(slippage.toString());

  useEffect(() => {
    setInputValue(slippage.toString());
  }, [slippage]);

  const handleSlippageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setSlippage(Math.round(parsedValue * 10) / 10);
    }
  };

  const calculateMinimumOutput = () => {
    const minOutput = parseFloat(expectedOutput) * (1 - slippage / 100);
    return isNaN(minOutput) ? '0' : minOutput.toFixed(6);
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
        }}
      >
        <Typography variant="body1">
          Slippage Tolerance
          <Tooltip title="Your transaction will revert if the price changes unfavorably by more than this percentage.">
            <InfoIcon
              fontSize="small"
              sx={{ ml: 1, verticalAlign: "middle" }}
            />
          </Tooltip>
        </Typography>
        <TextField
          type="number"
          inputProps={{
            min: 0,
            max: 100,
            step: 0.1,
          }}
          value={inputValue}
          onChange={handleSlippageChange}
          onBlur={() => setInputValue(slippage.toString())}
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          sx={{ width: "100px" }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        Minimum received: {calculateMinimumOutput()} {outputToken}
      </Typography>
    </Box>
  );
};

export default SlippageInput;