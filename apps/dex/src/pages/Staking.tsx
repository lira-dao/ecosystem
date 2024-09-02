import { useAccount } from 'wagmi';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTokenStakers } from '../hooks/useTokenStakers';
import { StakerCards } from '../components/staking/StakerCards';
import { LockOpen } from '@mui/icons-material';


export function Staking() {
  const stakers = useTokenStakers();
  const { isConnected } = useAccount();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        marginY: 4,
        paddingX: 2,
      }}
    >
      <Box>
        <Typography variant="h3" mb={4} color="white">
          Staking Pools
        </Typography>

        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: '16px' }}>
              <LockOpen sx={{ fontSize: '100px' }} />
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Stake your Treasury Bond Tokens and start earning passively
              </Typography>
              <Typography variant="subtitle2">Maximize your yield by boosting your
                rewards with LDT staking</Typography>
              <Typography variant="subtitle2">Boost your passive rewards by up to 100% by staking LDT for up
                to 50% of the value of your TB tokens</Typography>
              <Typography variant="subtitle2">For more details, please refer to the <a
                href="https://whitepaper.liradao.org/LIRA-DEX.md/008.1-Staking-rewards-boosting"
                target="_blank"
                rel="noopener noreferrer"
              >white paper</a></Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box mt={4}>
        <StakerCards stakers={stakers} isConnected={isConnected} />
      </Box>

      {/*<Box mt={4}>*/}
      {/*  <StakingTable stakers={stakers} isConnected={isConnected} />*/}
      {/*</Box>*/}
    </Box>
  );
}
