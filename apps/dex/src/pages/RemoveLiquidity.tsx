import { useParams } from 'react-router-dom';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits, parseUnits } from 'viem';
import { useTheme, x } from '@xstyled/styled-components';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { SwapSection } from '../components/swap/SwapSection';
import { useBalance } from '../hooks/useBalance';
import { useEffect, useMemo, useState } from 'react';
import { useAllowance } from '../hooks/useAllowance';
import BigNumber from 'bignumber.js';
import { useApprove } from '../hooks/useApprove';
import { useRemoveLiquidity } from '../hooks/useRemoveLiquidity';
import { useSnackbar } from 'notistack';
import { useDexAddresses } from '../hooks/useDexAddresses';
import { SwapHeader } from '../components/swap/SwapHeader';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';


export function RemoveLiquidity() {
  const th = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const dexAddresses = useDexAddresses();

  const [value, setValue] = useState<number | string>('');
  const [isRemoveDisabled, setIsRemoveDisabled] = useState<boolean>(false);

  const balance = useBalance(params.address as EthereumAddress);
  const allowance = useAllowance(params.address as EthereumAddress, dexAddresses.router);
  const approve = useApprove(params.address as EthereumAddress, dexAddresses.router, parseUnits(value.toString(), 18));

  const remove = useRemoveLiquidity(params.address as EthereumAddress, parseUnits(value.toString(), 18));

  const needAllowance = useMemo(
    () => new BigNumber(value).gt(0) && allowance.data !== undefined &&
      allowance.data < parseUnits(value.toString(), 18),
    [allowance.data, value]);

  const isAllowDisabled = useMemo(() => approve.isPending || allowance.isPending, [approve, allowance]);

  useEffect(() => {
    if (approve.confirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      allowance.refetch();
      remove.refetch();
    }
  }, [approve.confirmed]);

  useEffect(() => {
    if (remove.isPending) {
      setIsRemoveDisabled(true);
    } else {
      setIsRemoveDisabled(false);
    }
  }, [remove.isPending]);

  useEffect(() => {
    if (remove.confirmed) {
      enqueueSnackbar('Remove liquidity confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      remove.reset();
      balance.refetch();
      allowance.refetch();
      setValue('');
    }
  }, [remove.confirmed]);

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
      <SwapHeader title="Remove Liquidity" />

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">Withdraw</x.p>
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

      {(!!value && !needAllowance) && (
        <x.div display="flex">
          <x.div w="50%" display="flex" flexDirection="column" alignItems="center">
            <x.p>{remove.token0?.symbol}</x.p>
            <x.p>{new BigNumber(remove.amountA.toString()).div(new BigNumber(10).pow(remove.token0?.decimals ?? 18)).toFixed(6, 1)}</x.p>
            <x.div my={2} />
            <x.p>{remove.token0?.symbol} Min</x.p>
            <x.p>{new BigNumber(remove.amountAMin.toString()).div(new BigNumber(10).pow(remove.token0?.decimals ?? 18)).toFixed(6, 1)}</x.p>
          </x.div>

          <x.div w="50%" display="flex" flexDirection="column" alignItems="center">
            <x.p>{remove.token1?.symbol}</x.p>
            <x.p>{new BigNumber(remove.amountB.toString()).div(new BigNumber(10).pow(remove.token1?.decimals ?? 18)).toPrecision(6, 1)}</x.p>
            <x.div my={2} />
            <x.p>{remove.token1?.symbol} Min</x.p>
            <x.p>{new BigNumber(remove.amountBMin.toString()).div(new BigNumber(10).pow(remove.token1?.decimals ?? 18)).toPrecision(6, 1)}</x.p>
          </x.div>
        </x.div>
      )}

      {needAllowance && (
        <x.div display="flex" mt={4} mb={2} h="80px" alignItems="center" justifyContent="center">
          <PrimaryButtonWithLoader
            isLoading={isAllowDisabled}
            isDisabled={isAllowDisabled}
            text="Approve"
            onClick={() => approve.write()}
          />
        </x.div>
      )}

      {!needAllowance && (
        <x.div display="flex" mt={needAllowance ? 2 : 4} h="80px" alignItems="center" justifyContent="center">
          <PrimaryButtonWithLoader
            isLoading={isRemoveDisabled}
            isDisabled={!value}
            text="Remove"
            onClick={() => remove.write()}
          />
        </x.div>
      )}

    </x.div>
  );
}
