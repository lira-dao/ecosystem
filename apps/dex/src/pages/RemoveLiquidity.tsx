import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Typography } from '@mui/material';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits, parseUnits } from 'viem';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import { useAllowance } from '../hooks/useAllowance';
import { useApprove } from '../hooks/useApprove';
import { useBalance } from '../hooks/useBalance';
import { useDexAddresses } from '../hooks/useDexAddresses';
import { useRemoveLiquidity } from '../hooks/useRemoveLiquidity';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { SectionHeader } from '../components/swap/SectionHeader';
import { CurrencyInput } from '../components/swap/CurrencyInput';

export function RemoveLiquidity() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const [value, setValue] = useState<string>('');
  const [isRemoveDisabled, setIsRemoveDisabled] = useState<boolean>(false);

  const dexAddresses = useDexAddresses();

  const allowance = useAllowance(params.address as EthereumAddress, dexAddresses.router);
  const approve = useApprove(params.address as EthereumAddress, dexAddresses.router, parseUnits(value.toString(), 18));
  const balance = useBalance(params.address as EthereumAddress);

  const remove = useRemoveLiquidity(params.address as EthereumAddress, parseUnits(value.toString(), 18));

  const needAllowance = useMemo(
    () => new BigNumber(value).gt(0) && allowance.data !== undefined && allowance.data < parseUnits(value.toString(), 18),
    [allowance.data, value]
  );

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

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', borderRadius: '16px', p: 4 }}>
      <SectionHeader title="Remove Liquidity" />

      <Box width="100%" mx="auto">
        <Card sx={{ borderRadius: '8px', p: 1, backgroundColor: 'background.paper' }}>
          <CurrencyInput
            balance={balance.data || 0n}
            currency={{ symbol: "LP Token", decimals: 18 } as any}
            disabled={isRemoveDisabled || isAllowDisabled}
            formattedBalance={new BigNumber(formatUnits(balance.data || 0n, 18)).toFixed(6, 1)}
            id="lp-token"
            insufficientBalance={new BigNumber(value).gt(new BigNumber(formatUnits(balance.data || 0n, 18)))}
            isDisabledCurrencySelector={true}
            onChangeValue={(e) => setValue(e.target.value)}
            onSetPercentage={(value: string) => setValue(value)}
            selected={false}
            showPercentages
            title="Withdraw"
            value={value}
          />

          {(!!value && !needAllowance) && (
            <>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <Box sx={{ display: 'flex', p: 2 }}>
                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography>{remove.token0?.symbol}</Typography>
                  <Typography>
                    {new BigNumber(remove.amountA.toString()).div(new BigNumber(10).pow(remove.token0?.decimals ?? 18)).toFixed(6, 1)}
                  </Typography>
                  <Box my={2} />
                  <Typography>{remove.token0?.symbol} Min</Typography>
                  <Typography>
                    {new BigNumber(remove.amountAMin.toString()).div(new BigNumber(10).pow(remove.token0?.decimals ?? 18)).toFixed(6, 1)}
                  </Typography>
                </Box>

                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography>{remove.token1?.symbol}</Typography>
                  <Typography>
                    {new BigNumber(remove.amountB.toString()).div(new BigNumber(10).pow(remove.token1?.decimals ?? 18)).toFixed(6, 1)}
                  </Typography>
                  <Box my={2} />
                  <Typography>{remove.token1?.symbol} Min</Typography>
                  <Typography>
                    {new BigNumber(remove.amountBMin.toString()).div(new BigNumber(10).pow(remove.token1?.decimals ?? 18)).toFixed(6, 1)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Card>
      </Box>

      {needAllowance && (
        <Box sx={{ display: 'flex', marginTop: 4, marginBottom: 2, height: '80px', alignItems: 'center', justifyContent: 'center' }}>
          <PrimaryButtonWithLoader
            isLoading={isAllowDisabled}
            isDisabled={isAllowDisabled}
            text="Approve"
            onClick={() => approve.write()}
          />
        </Box>
      )}

      {!needAllowance && (
        <Box sx={{ display: 'flex', marginTop: needAllowance ? 2 : 4, height: '80px', alignItems: 'center', justifyContent: 'center' }}>
          <PrimaryButtonWithLoader
            isLoading={isRemoveDisabled}
            isDisabled={!value}
            text="Remove"
            onClick={() => remove.write()}
          />
        </Box>
      )}
    </Box>
  );
}
