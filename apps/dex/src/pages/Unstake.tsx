import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { formatUnits, parseUnits } from 'viem';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { useTokenStaker } from '../hooks/useTokenStaker';
import { CurrencyInput } from '../components/swap/CurrencyInput';
import { ErrorMessage } from '../components/swap/ErrorMessage';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { SectionHeader } from '../components/swap/SectionHeader';


export function Unstake() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [value, setValue] = useState<string>('');

  const farms = useFarmingStakers();

  const {
    confirmed,
    error,
    isError,
    isPending,
    reset,
    stakeError,
    staked,
    stakedAmount,
    token,
    unstakeAmount,
    write,
  } = useTokenStaker(params.stakers || '', params.staker as EthereumAddress, 'unstake', value);

  const isRemoveDisabled = useMemo(() => isPending, [isPending]);

  const insufficientBalance = useMemo(() => new BigNumber(parseUnits(value, 18).toString()).gt(new BigNumber(staked.data?.[0].toString() || '0')), [stakedAmount, value]);

  useEffect(() => {
    if (confirmed) {
      enqueueSnackbar('Unstake confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      reset();
      staked.refetch();
      setValue('');
    }
  }, [confirmed]);

  const errorText = useMemo(() => {
    switch (stakeError) {
      case 'INVALID_BOOST_AMOUNT':
        return `Your boost is too high! You need to remove ${unstakeAmount} LDT from the boost to unstake ${new BigNumber(value)} ${token?.symbol}`;
      case 'PENDING_REWARDS':
        return 'You have pending rewards. Please harvest your current rewards before staking additional tokens.';
      default:
        return '';
    }
  }, [stakeError]);

  useEffect(() => {
    if (isError) {
      // @ts-ignore
      enqueueSnackbar(errorText || error?.shortMessage || 'Network error!', {
        autoHideDuration: 3000,
        variant: 'error',
      });
    }
  }, [error, errorText, isError]);

  const title = useMemo(() => {
    switch (params.stakers) {
      case 'farming':
        return 'Unstake LP';
      default:
        return 'Unstake';
    }
  }, [params.stakers]);

  const currentToken = useMemo(() => {
    if (params.stakers === 'farming' && farms && farms.length > 0) {
      const farm = farms.find(farm => farm.address === params.staker);
      if (farm) {
        return {
          address: farm.pair.address,
          symbol: 'LD-v2',
          decimals: 18,
          icon: '',
        };
      }
    }
    return token;
  }, [params.stakers, params.staker, farms, token]);

  const onSetPercentage = (percentage: string) => {
    if (staked.data) {
      setValue(percentage);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', borderRadius: '16px', p: 4 }}>
      <SectionHeader title={title} />

      <Box width="100%" mx="auto" sx={{ mb: 2 }}>
        <Card sx={{ p: 1, backgroundColor: 'background.paper' }}>
          <CurrencyInput
            balance={staked.data?.[0] || 0n}
            currency={currentToken}
            disabled={staked.data?.[0] === 0n}
            formattedBalance={new BigNumber(formatUnits(staked.data?.[0] ?? 0n, 18)).toFixed(6, 1)}
            id="lp-token"
            insufficientBalance={insufficientBalance}
            isDisabledCurrencySelector={true}
            onChangeValue={(e) => setValue(e.target.value)}
            onSetPercentage={(percentage: string) => onSetPercentage(percentage.toString())}
            selected={false}
            showPercentages
            title="Withdraw"
            value={value}
          />
        </Card>
      </Box>

      <Card>
        <CardContent sx={{ '&:last-child': { p: 2 } }}>
          <Box display="flex" justifyContent="space-between">
            <Typography>My Stake</Typography>
            <Typography>{stakedAmount} {token?.symbol}</Typography>
          </Box>
        </CardContent>
      </Card>

      {errorText && <ErrorMessage text={errorText} />}

      <Box
        sx={{
          display: 'flex',
          mt: 2,
          height: '80px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PrimaryButtonWithLoader
          isLoading={isRemoveDisabled}
          isDisabled={!value || !new BigNumber(parseUnits(value, 18).toString()).gt(0) || insufficientBalance}
          text="Unstake"
          onClick={() => write()}
        />
      </Box>
    </Box>
  );
}
