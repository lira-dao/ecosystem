import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatUnits, parseUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { x } from '@xstyled/styled-components';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { SwapSection } from '../components/swap/SwapSection';
import { useSnackbar } from 'notistack';
import { SwapHeader } from '../components/swap/SwapHeader';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTokenStaker } from '../hooks/useTokenStaker';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { ErrorMessage } from '../components/swap/ErrorMessage';


export function Unstake() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [value, setValue] = useState<string>('');

  const {
    isError,
    write,
    error,
    reset,
    confirmed,
    isPending,
    stakeError,
    stakedAmount,
    token,
    staked,
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
        return `Your boost is too high! You need to remove x LDT from the boost to unstake ${new BigNumber(value)} ${token?.symbol}`;
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

  const onSetPercentage = (percentage: bigint) => {
    switch (percentage) {
      case 25n:
      case 50n:
      case 75n:
        setValue(formatUnits(((staked.data?.[0] || 0n) * percentage) / 100n, 18));
        break;
      case 100n:
        setValue(formatUnits(staked.data?.[0] || 0n, 18));
        break;
    }
  };

  return (
    <Box width="100%" maxWidth="480px" padding={2}>
      <SwapHeader title={title} />

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">Withdraw</x.p>
                {insufficientBalance && <x.p color="red-400" userSelect="none">Insufficient balance</x.p>}
              </x.div>

              <NumericalInput
                id="currencyA"
                disabled={false}
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
                  <x.p color="gray155">{new BigNumber(formatUnits(staked.data?.[0] ?? 0n, 18)).toFixed(6, 1)}</x.p>
                </x.div>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <Card>
        <CardContent sx={{ '&:last-child': { p: 2 } }}>
          <Box display="flex" justifyContent="space-between">
            <Typography>My Stake</Typography>
            <Typography>{stakedAmount} {token?.symbol}</Typography>
          </Box>
        </CardContent>
      </Card>

      {errorText && <ErrorMessage text={errorText} />}

      <x.div display="flex" mt={4} h="80px" alignItems="center" justifyContent="center">
        <PrimaryButtonWithLoader
          isLoading={isRemoveDisabled}
          isDisabled={!value || !new BigNumber(parseUnits(value, 18).toString()).gt(0) || insufficientBalance}
          text="Unstake"
          onClick={() => write()}
        />
      </x.div>
    </Box>
  );
}
