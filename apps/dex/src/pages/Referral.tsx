import { Box, Button, Card, CardContent, Divider, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';


export function Referral() {
  const params = useParams();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const [referrer, setReferrer] = useState('');

  useEffect(() => {
    if (params.address) {
      setReferrer(params.address);
    }
  }, []);

  return (
    <Box width="100%" maxWidth="560px" padding={2}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>Welcome to LIRA DAO!</Typography>
        <Typography>To receive your 10% bonus on your first 6-month staking, connect with your wallet and register your
          referrer. This is our way of thanking you for choosing to join our community!</Typography>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <TextField
            id="address"
            label="Referrer"
            variant="outlined"
            disabled
            value={referrer}
            sx={{ width: '100%' }}
          />

          <Box mt={2}>
            {isConnected ? (
              <PrimaryButtonWithLoader
                isLoading={false} isDisabled={false} text="REGISTER" onClick={() => {
              }}
              />
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

      <Divider sx={{ my: 2, borderColor: 'transparent' }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Why Join LIRA DAO?</Typography>
        <Typography variant="body2">LIRA DAO is an innovative DeFi ecosystem aimed at creating a decentralized financial
          future and much more. With our platform, you can participate in various yield farming, staking, and
          decentralized trading opportunities on our already operational and continuously expanding DEX. We are
          committed to providing transparency, security, and value to our users.</Typography>

        <Divider sx={{ my: 2, borderColor: 'transparent' }} />

        <Typography variant="h6" sx={{ mb: 1 }}>Benefits of Joining LIRA DAO</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}><b>Yield Farming and Staking:</b> Earn competitive returns on your
          cryptocurrencies
          by
          participating in our liquidity pools and staking programs.</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}><b>Transparency and Security:</b> Our contracts are public and
          verifiable, ensuring
          maximum
          security and transparency for all users.</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}><b>Continuous Innovation:</b> We are constantly working to improve
          and expand the
          services
          offered by our platform, with new developments always on the horizon.</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}><b>Inclusive Community:</b> Join a passionate and growing community
          that actively
          supports
          and contributes to the development of the project.</Typography>

        <Divider sx={{ my: 2, borderColor: 'transparent' }} />

        <Typography variant="body2">Join us today and discover the benefits of participating in a dynamic and promising
          DeFi ecosystem like LIRA DAO. Start your journey towards financial independence with our innovative
          platform.</Typography>

        <Divider sx={{ my: 2, borderColor: 'transparent' }} />

        <Typography variant="h6" sx={{ mb: 1 }}>Stay Connected</Typography>
        <Typography variant="body2">Follow us on <a
          href="https://twitter.com/LIRA_DAO"
          target="_blank"
          rel="nofollow noreferrer"
        >Twitter</a>, <a href="https://discord.gg/fDRBajCB9V" target="_blank" rel="nofollow noreferrer">Discord
          Server</a>, <a href="https://t.me/LIRA_DAO" target="_blank" rel="nofollow noreferrer">Telegram
          Group</a></Typography>
      </Box>
    </Box>
  );
}
