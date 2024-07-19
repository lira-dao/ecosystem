import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../theme/theme';
import { useParams } from 'react-router-dom';
import { useFarmingStaker } from '../hooks/useFarmingStaker';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { x } from '@xstyled/styled-components';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { SwapHeader } from '../components/swap/SwapHeader';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';


export function Harvest() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const {
    pendingRewards,
    tokens,
    write,
    isPending,
    havePendingRewards,
    confirmed,
    reset,
    pendingRewardsAmounts,
  } = useFarmingStaker(params.staker as EthereumAddress, 'harvest');

  useEffect(() => {
    if (confirmed) {
      enqueueSnackbar('Harvest confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      reset();
      pendingRewards.refetch();
    }
  }, [confirmed]);

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box width="100%" maxWidth="480px" padding={4}>

        <SwapHeader title="Harvest" />

        <Box display="flex" justifyContent="center" mt={4}>
          <List sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper' }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: 'transparent' }}>
                  <img width={40} src={tokens[0]?.icon} alt={tokens[0]?.name} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={tokens[0]?.name} secondary={`${pendingRewardsAmounts[0]} ${tokens[0]?.symbol}`} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: 'transparent' }}>
                  <img width={40} src={tokens[1]?.icon} alt={tokens[1]?.name} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={tokens[1]?.name} secondary={`${pendingRewardsAmounts[1]} ${tokens[1]?.symbol}`} />
            </ListItem>
          </List>
        </Box>

        <x.div display="flex" mt={4} h="80px" alignItems="center" justifyContent="center">
          <PrimaryButtonWithLoader
            isLoading={isPending}
            isDisabled={!havePendingRewards}
            text="Harvest"
            onClick={() => write()}
          />
        </x.div>
      </Box>
    </ThemeProvider>
  );
}
