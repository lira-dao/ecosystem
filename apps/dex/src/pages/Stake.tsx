import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { useSnackbar } from 'notistack';
import { formatUnits, parseUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { useTokenStaker } from '../hooks/useTokenStaker';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/swap/SectionHeader';
import { ErrorMessage } from '../components/swap/ErrorMessage';
import { CurrencyInput } from '../components/swap/CurrencyInput';


export function Stake() {
  const th = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [value, setValue] = useState<string>('');

  const farms = useFarmingStakers();

  const {
    allowance,
    approve,
    balance,
    confirmed,
    error,
    isError,
    isPending,
    maxBoost,
    refetch,
    remainingBoost,
    remainingBoostValue,
    reset,
    stakeError,
    stakedAmount,
    token,
    write,
    staked,
  } = useTokenStaker(params.stakers || '', params.staker as EthereumAddress, 'stake', value);

  const isAllowDisabled = useMemo(() => approve.isPending || allowance.isPending, [approve, allowance]);

  const isRemoveDisabled = useMemo(() => isPending, [isPending]);

  const insufficientBalance = useMemo(() => new BigNumber(parseUnits(value, 18).toString()).gt(new BigNumber(balance.data?.toString() || '0')), [stakedAmount, value]);

  const needAllowance = useMemo(
    () => new BigNumber(value).gt(0) && allowance !== undefined &&
      (allowance.data || 0n) < parseUnits(value, 18),
    [allowance, value]);

  useEffect(() => {
    if (approve.confirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      allowance.refetch();
    }
  }, [approve.confirmed]);

  useEffect(() => {
    if (confirmed) {
      enqueueSnackbar('Stake confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      reset();
      refetch();
      setValue('');
    }
  }, [confirmed]);

  useEffect(() => {
    if (isError) {
      // @ts-ignore
      enqueueSnackbar(error?.shortMessage || 'Network error!', {
        autoHideDuration: 3000,
        variant: 'error',
      });
    }
  }, [isError]);

  const onSetPercentage = (percentage: string) => {
    if (staked.data) {
      setValue(percentage);
    }
  };

  const title = useMemo(() => {
    switch (params.stakers) {
      case 'farming':
        return 'Stake LP';
      default:
        return 'Stake';
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

  const errorText = useMemo(() => {
    switch (stakeError) {
      case 'MINIMUM_STAKE_AMOUNT':
        return `The minimum stake amount is 1 treasury token, you have staked ${stakedAmount} ${token?.symbol}. You must stake at least ${new BigNumber(10).pow(18).minus(staked?.data?.[0].toString() ?? 0).div(new BigNumber(10).pow(18)).toFormat(2, 1)} ${token?.symbol}`;
      case 'PENDING_REWARDS':
        return 'You have pending rewards. Please harvest your current rewards before staking additional tokens.';
      default:
        return '';
    }
  }, [stakeError]);

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', borderRadius: '16px', p: 4 }}>
      <SectionHeader title={title} />

      <Box width="100%" mx="auto" sx={{ mb: 2 }}>
        <Card sx={{ p: 1, backgroundColor: 'background.paper' }}>
          <CurrencyInput
            balance={balance.data || 0n }
            currency={currentToken}
            disabled={false}
            formattedBalance={new BigNumber(formatUnits(balance.data ?? 0n, 18)).toFixed(6, 1)}
            id="lp-token"
            insufficientBalance={insufficientBalance}
            isDisabledCurrencySelector={true}
            onChangeValue={(e) => setValue(e.target.value)}
            onSetPercentage={(percentage: string) => onSetPercentage(percentage)}
            selected={false}
            showPercentages
            title="Deposit"
            value={value}
          />
        </Card>
      </Box>

      {params.stakers === 'boosting' && (
        <Card>
          <CardContent sx={{ '&:last-child': { p: 2 } }}>
            <Box display="flex" justifyContent="space-between">
              <Typography>My Boost</Typography>
              <Typography>{stakedAmount} {token?.symbol}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography>Remaining Boost</Typography>
              <Typography>{remainingBoost} {token?.symbol}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography>Max Boost</Typography>
              <Typography>{maxBoost} {token?.symbol}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {params.stakers !== 'boosting' && (
        <Card>
          <CardContent sx={{ '&:last-child': { p: 2 } }}>
            <Box display="flex" justifyContent="space-between">
              <Typography>My Stake</Typography>
              <Typography>{stakedAmount} {token?.symbol}</Typography>
            </Box>
            {params.stakers === 'staking' && (
              <Box display="flex" justifyContent="space-between">
                <Typography>Min Stake</Typography>
                <Typography>1 {token?.symbol}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {stakeError && <ErrorMessage text={errorText} />}

      {needAllowance && (
        <Box
          sx={{
            display: 'flex',
            mt: 4,
            mb: 2,
            height: '80px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isAllowDisabled ? (
            <PacmanLoader color={th.palette.success.light} />
          ) : (
            <PrimaryButton
              variant="contained"
              size="large"
              disabled={isAllowDisabled && (!new BigNumber(value).isPositive() || !new BigNumber(value).gt(0))}
              onClick={() => approve.write()}
            >
              Approve
            </PrimaryButton>
          )}
        </Box>
      )}

      {!needAllowance && (
        <Box
          sx={{
            display: 'flex',
            mt: 4,
            height: '80px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isRemoveDisabled ? (
            <PacmanLoader color={th.colors.green[100]} />
          ) : (
            <PrimaryButton
              variant="contained"
              size="large"
              disabled={!new BigNumber(value).isPositive() || !new BigNumber(value).gt(0)}
              onClick={() => write()}
            >
              Stake
            </PrimaryButton>
          )}
        </Box>
      )}
    </Box>
  );
}
