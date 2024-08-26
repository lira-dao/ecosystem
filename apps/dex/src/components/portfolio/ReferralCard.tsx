import React from 'react';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { QueryObserverResult } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useReferralUrl } from '../../hooks/referrals/useReferralUrl';
import { useReferralsUrl } from '../../hooks/referrals/useReferralsUrl';
import { TokenReward } from '../../hooks/useReferralRewards';
import BigNumber from 'bignumber.js';


interface ReferralCardProps {
  pendingRewards: TokenReward[];
  isPending: boolean;
  refetchPendingRewards: () => Promise<QueryObserverResult<readonly [bigint, bigint, bigint, bigint], unknown>>;
  writeHarvest: () => void;
}

export function ReferralCard({
  pendingRewards,
  isPending,
  refetchPendingRewards,
  writeHarvest,
}: ReferralCardProps) {
  const account = useAccount();

  const { data } = useReferralUrl(account.address);
  const { data: referralCounts, isLoading } = useReferralsUrl(account.address);

  return (
    <Box>
      <Typography variant="h5">Welcome to your referral area!</Typography>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" sx={{ mr: 4, my: 4 }}>{data}</Typography>
        <Button variant="outlined" onClick={() => navigator.clipboard.writeText(data || '')}>COPY</Button>
      </Box>

      <Typography sx={{ mb: 4 }}>
        Above you can find the link to invite your friends and start earning rewards together from the LIRA DAO
        ecosystem. Invite a friend and receive a 10% reward on their first staking in the 6-month pools. Your invited
        friend will also receive a 10% reward! Additionally, you will earn a 5% reward based on the rewards obtained by
        the person you invited, 3% at the second level, and 2% at the third level.
      </Typography>

      <Typography sx={{ mb: 4 }}>
        Spread the word about the LIRA DAO ecosystem and unlock its full potential. Every friend you invite brings value
        to you and the entire community. Start sharing your referral link now and discover the exclusive benefits of
        being part of LIRA DAO!
      </Typography>

      {isLoading ? (
        <Typography>Loading referral counts...</Typography>
      ) : (
        referralCounts && (
          <Box display="flex" flexDirection="row" alignItems="center" width="100%" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 0, mr: 2 }}>
              Your Referral Counts:
            </Typography>
            <Box display="flex" justifyContent="space-evenly" alignItems='center' width="100%">
              <Typography variant="body1">
                First Level: {referralCounts.firstLevelCount}
              </Typography>
              <Typography variant="body1">
                Second Level: {referralCounts.secondLevelCount}
              </Typography>
              <Typography variant="body1">
                Third Level: {referralCounts.thirdLevelCount}
              </Typography>
            </Box>
          </Box>
        )
      )}

      <Box display="flex" flexDirection="row" alignItems="flex-start" width="100%">
        <Typography variant="h6" sx={{ mt: 2, mr: 2 }} gutterBottom>
          Pending Rewards:
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {pendingRewards.map((token) => (
            <Grid item xs={12} sm={6} lg={3} key={token.address}>
              <Box display="flex" alignItems="center">
                <Avatar src={token.icon} sx={{ mr: 2 }} />
                <Typography>
                  {`${new BigNumber(token.reward.toString()).dividedBy(new BigNumber(10).pow(18)).toFormat(4, BigNumber.ROUND_DOWN)} ${token.symbol}`}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          onClick={refetchPendingRewards}
          disabled={isPending}
        >
          Refresh Rewards
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={writeHarvest}
          disabled={isPending || pendingRewards.every(token => token.reward === BigInt(0))}
        >
          Harvest Rewards
        </Button>
      </Box>
    </Box>
  );
}
