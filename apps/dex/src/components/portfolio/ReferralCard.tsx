import { Box, Button, Typography } from '@mui/material';
import { useReferralUrl } from '../../hooks/referrals/useReferralUrl';
import { useReferralsUrl } from '../../hooks/referrals/useReferralsUrl';
import { useAccount } from 'wagmi';


export function ReferralCard() {
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
          <Box>
            <Typography variant="h6">Your Referral Counts:</Typography>
            <Typography>First Level: {referralCounts.firstLevelCount}</Typography>
            <Typography>Second Level: {referralCounts.secondLevelCount}</Typography>
            <Typography>Third Level: {referralCounts.thirdLevelCount}</Typography>
          </Box>
        )
      )}
    </Box>
  );
}
