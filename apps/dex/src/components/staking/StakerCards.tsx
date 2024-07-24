import { Staker } from '../../hooks/useTokenStakers';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useWeb3Modal } from '@web3modal/wagmi/react';


const getApr = (symbol?: string) => {
  switch (symbol) {
    case 'TBb':
      return '73.0 %';
    case 'TBs':
      return '182.5 %';
    case 'TBg':
      return '365.0 %';
    default:
      return '365%';
  }
};

interface Props {
  stakers: Staker[];
  isConnected: boolean;
}

export function StakerCards({ stakers, isConnected }: Props) {
  const th = useTheme();
  const navigate = useNavigate();
  const { open } = useWeb3Modal();

  return (
    <Grid container spacing={2}>

      {stakers.map(staker => (
        <Grid item xs={12} md={6} lg={4} key={staker.address}>
          <Card>
            <CardHeader
              avatar={
                <Box display="flex" mr={1}>
                  <img src={staker.tokens[0]?.icon} width={40} alt={`${staker.tokens[0]?.name} logo`} />
                </Box>
              }
              title={
                <Typography variant="h5">{staker.tokens[0]?.symbol}</Typography>
              }
            >
            </CardHeader>
            <CardContent>
              <Box>
                <Typography><span style={{ color: th.colors.green[400] }}>Promo</span> APR: <span style={{ color: th.colors.green[400] }}>{staker.apr} %</span></Typography>
              </Box>
              <Typography>Total Staked: {staker.totalStaked}</Typography>

              <Divider textAlign="left" sx={{ mt: 4, mb: 2 }}>STAKE</Divider>

              <Box display="flex" justifyContent="space-between">
                <Typography>My Deposit</Typography>
                <Typography>{staker.amount} {staker.tokens[0]?.symbol}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>My Balance</Typography>
                <Typography>{staker.balance} {staker.tokens[0]?.symbol}</Typography>
              </Box>

              <Box sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-around" alignItems="center">
                {isConnected ? (
                  <>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/staking/${staker.address}/stake`)}
                      sx={{ width: '49%', marginRight: '1%' }}
                    >Stake</Button>
                    <Button
                      color="error"
                      variant="outlined"
                      sx={{ width: '49%', marginLeft: '1%' }}
                      onClick={() => navigate(`/staking/${staker.address}/unstake`)}
                    >Unstake</Button>
                  </>
                ) : (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => open()}
                    sx={{ width: '100%' }}
                  >Connect Wallet</Button>
                )}
              </Box>

              <Box sx={{ my: 4 }} />

              <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Rewards</Typography>

                <Box>
                  <Typography
                    textAlign="right"
                    sx={{ textWrap: 'nowrap' }}
                  >{staker.rewards[1]} {staker.tokens[0]?.symbol}</Typography>
                  <Typography
                    textAlign="right"
                    sx={{ textWrap: 'nowrap' }}
                  >{staker.rewards[0]} {staker.tokens[1]?.symbol}</Typography>
                </Box>
              </Box>

              <Box sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-around" alignItems="center">
                {isConnected ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => navigate(`/staking/${staker.address}/harvest`)}
                    sx={{ width: '100%', marginRight: '10px' }}
                  >Harvest</Button>
                ) : (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => open()}
                    sx={{ width: '100%' }}
                  >Connect Wallet</Button>
                )}
              </Box>

              <Divider textAlign="left" sx={{ mt: 4, mb: 2 }}>BOOST</Divider>

              <Box display="flex" justifyContent="space-between">
                <Typography>My Boost</Typography>
                <Typography>{staker.boostAmount} {staker.tokens[1]?.symbol}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Remaining Boost</Typography>
                <Typography>{staker.remainingBoost} {staker.tokens[1]?.symbol}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Max Boost</Typography>
                <Typography>{staker.maxBoost} {staker.tokens[1]?.symbol}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Balance</Typography>
                <Typography>{staker.ldtBalance} LDT</Typography>
              </Box>

              <Box sx={{ my: 4 }} />

              <Box display="flex" justifyContent="space-around" alignItems="center">
                {isConnected ? (
                  <>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/boosting/${staker.boosterAddress}/stake`)}
                      sx={{ width: '49%', marginRight: '1%' }}
                    >Stake</Button>
                    <Button
                      color="error"
                      variant="outlined"
                      sx={{ width: '49%', marginLeft: '1%' }}
                      onClick={() => navigate(`/boosting/${staker.boosterAddress}/unstake`)}
                    >Unstake</Button>
                  </>
                ) : (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => open()}
                    sx={{ width: '100%' }}
                  >Connect Wallet</Button>
                )}
              </Box>

              <Box sx={{ my: 4 }} />

              <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Rewards</Typography>

                <Box>
                  <Typography
                    textAlign="right"
                    sx={{ textWrap: 'nowrap' }}
                  >{staker.boostRewards[1]} {staker.tokens[0]?.symbol}</Typography>
                  <Typography
                    textAlign="right"
                    sx={{ textWrap: 'nowrap' }}
                  >{staker.boostRewards[0]} {staker.tokens[1]?.symbol}</Typography>
                </Box>
              </Box>

              <Box sx={{ my: 4 }} />

              <Box display="flex" justifyContent="space-around" alignItems="center">
                {isConnected ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => navigate(`/staking/${staker.boosterAddress}/harvest`)}
                    sx={{ width: '100%', marginRight: '10px' }}
                  >Harvest</Button>
                ) : (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => open()}
                    sx={{ width: '100%' }}
                  >Connect Wallet</Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
