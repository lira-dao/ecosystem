import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFarmingStaker } from '../hooks/useFarmingStaker';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { SectionHeader } from '../components/swap/SectionHeader';
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
    <Box width="100%" maxWidth="480px" padding={4}>

      <SectionHeader title="Harvest" />

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

      <Box display="flex" mt={4} height="80px" alignItems="center" justifyContent="center">
        <PrimaryButtonWithLoader
          isLoading={isPending}
          isDisabled={!havePendingRewards}
          text="Harvest"
          onClick={() => write()}
        />
      </Box>
    </Box>
  );
}
