import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatUnits, parseUnits } from 'viem';
import { PacmanLoader } from 'react-spinners';
import BigNumber from 'bignumber.js';
import { useTheme, x } from '@xstyled/styled-components';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { SwapSection } from '../components/swap/SwapSection';
import { useFarmingStaker } from '../hooks/useFarmingStaker';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSnackbar } from 'notistack';


export function Stake() {
  const th = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [value, setValue] = useState<string>('');

  const {
    balance,
    allowance,
    approve,
    write,
    reset,
    confirmed,
    isPending,
    stakeError,
  } = useFarmingStaker(params.farm as EthereumAddress, 'stake', value);

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
      balance.refetch();
      setValue('');
    }
  }, [confirmed]);

  const onSetPercentage = (percentage: bigint) => {
    switch (percentage) {
      case 25n:
      case 50n:
      case 75n:
        setValue(formatUnits(((balance.data || 0n) * percentage) / 100n, 18));
        break;
      case 100n:
        setValue(formatUnits(balance.data || 0n, 18));
        break;
    }
  };

  return (
    <x.div w="100%" maxWidth="480px" padding={4}>
      <x.div display="flex" justifyContent="center" mt={2}>
        <x.p fontSize="3xl">Stake LP</x.p>
      </x.div>

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">Deposit</x.p>
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
                  <x.p color="gray155">{new BigNumber(formatUnits(balance.data ?? 0n, 18)).toFixed(6, 1)}</x.p>
                </x.div>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      {stakeError && stakeError === 'PENDING_REWARDS' && (
        <x.div>
          <x.p color="red-400">You have pending rewards. Please harvest your current rewards before staking additional
            tokens.
          </x.p>
        </x.div>
      )}

      {needAllowance && (
        <x.div display="flex" mt={4} mb={2} h="80px" alignItems="center" justifyContent="center">
          {isAllowDisabled ? (
            <PacmanLoader color={th?.colors.gray155} />
          ) : (
            <PrimaryButton
              disabled={isAllowDisabled}
              onClick={() => approve.write()}
            >Approve</PrimaryButton>
          )}
        </x.div>
      )}

      {!needAllowance && (
        <x.div display="flex" mt={needAllowance ? 2 : 4} h="80px" alignItems="center" justifyContent="center">
          {isRemoveDisabled ? (
            <PacmanLoader color={th?.colors.gray155} />
          ) : (
            <PrimaryButton disabled={!value} onClick={() => write()}>Stake</PrimaryButton>
          )}
        </x.div>
      )}
    </x.div>
  );
}
