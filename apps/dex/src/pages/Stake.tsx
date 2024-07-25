import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatUnits, parseUnits } from 'viem';
import { PacmanLoader } from 'react-spinners';
import BigNumber from 'bignumber.js';
import { x } from '@xstyled/styled-components';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { SwapSection } from '../components/swap/SwapSection';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSnackbar } from 'notistack';
import { useTokenStaker } from '../hooks/useTokenStaker';
import { SwapHeader } from '../components/swap/SwapHeader';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ErrorMessage } from '../components/swap/ErrorMessage';


export function Stake() {
  const th = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [value, setValue] = useState<string>('');
  console.log();
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

  const onSetPercentage = (percentage: bigint) => {
    switch (percentage) {
      case 25n:
      case 50n:
      case 75n:
        if (params.stakers === 'boosting') {
          setValue(formatUnits(((remainingBoostValue) * percentage) / 100n, 18));
        } else {
          setValue(formatUnits(((balance.data || 0n) * percentage) / 100n, 18));
        }
        break;
      case 100n:
        if (params.stakers === 'boosting') {
          setValue(formatUnits(remainingBoostValue, 18));
        } else {
          setValue(formatUnits(balance.data || 0n, 18));
        }
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
    <Box width="100%" maxWidth="480px" padding={2}>
      <SwapHeader title={title} />

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">Deposit</x.p>
              </x.div>

              <NumericalInput
                id="currencyA"
                disabled={isAllowDisabled || isRemoveDisabled}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <x.div w="100%" display="flex" mt={2} justifyContent="space-between">
                <x.div display="flex">
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentage(25n)}
                  >25%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentage(50n)}
                  >50%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentage(75n)}
                  >75%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentage(100n)}
                  >100%
                  </x.p>
                </x.div>
                <x.div>
                  <x.p color="gray155">{new BigNumber(formatUnits(balance.data ?? 0n, 18)).toFixed(6, 1)}</x.p>
                </x.div>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

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
        <x.div display="flex" mt={4} mb={2} h="80px" alignItems="center" justifyContent="center">
          {isAllowDisabled ? (
            <PacmanLoader color={th.colors.green[100]} />
          ) : (
            <PrimaryButton
              variant="contained"
              size="large"
              disabled={isAllowDisabled && (!new BigNumber(value).isPositive() || !new BigNumber(value).gt(0))}
              onClick={() => approve.write()}
            >Approve</PrimaryButton>
          )}
        </x.div>
      )}

      {!needAllowance && (
        <x.div display="flex" mt={needAllowance ? 2 : 4} h="80px" alignItems="center" justifyContent="center">
          {isRemoveDisabled ? (
            <PacmanLoader color={th.colors.green[100]} />
          ) : (
            <PrimaryButton
              variant="contained"
              size="large"
              disabled={!new BigNumber(value).isPositive() || !new BigNumber(value).gt(0)}
              onClick={() => write()}
            >Stake</PrimaryButton>
          )}
        </x.div>
      )}
    </Box>
  );
}
