import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { SwapHeader } from '../components/swap/SwapHeader';
import { useParams } from 'react-router-dom';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';


export function Referral() {
  const params = useParams();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <Box width="100%" maxWidth="560px" padding={2}>
      <Box>
        <Typography variant="h5">Welcome to LIRA DAO!</Typography>
        <Typography>To receive your 10% bonus on your first 6-month staking, connect with your wallet and register your referrer. This is our way of thanking you for choosing to join our community!</Typography>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <TextField id="address" label="Referrer" variant="outlined" disabled value={params.address} sx={{ width: '100%' }} />

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

      <Box>
        <Typography>Why Join LIRA DAO?</Typography>
        <Typography>LIRA DAO is an innovative DeFi ecosystem aimed at creating a decentralized financial future and much more. With our platform, you can participate in various yield farming, staking, and decentralized trading opportunities on our already operational and continuously expanding DEX. We are committed to providing transparency, security, and value to our users.</Typography>

        <Typography>Benefits of Joining LIRA DAO</Typography>
        <Typography>Yield Farming and Staking: Earn competitive returns on your cryptocurrencies by participating in our liquidity pools and staking programs.</Typography>
        <Typography>Transparency and Security: Our contracts are public and verifiable, ensuring maximum security and transparency for all users.</Typography>
        <Typography>Continuous Innovation: We are constantly working to improve and expand the services offered by our platform, with new developments always on the horizon.</Typography>
        <Typography>Inclusive Community: Join a passionate and growing community that actively supports and contributes to the development of the project.</Typography>


        <Typography>Join us today and discover the benefits of participating in a dynamic and promising DeFi ecosystem like LIRA DAO. Start your journey towards financial independence with our innovative platform.</Typography>

        <Typography>Stay Connected</Typography>
        <Typography>Follow us on <a href="https://twitter.com/LIRA_DAO" target="_blank" rel="nofollow noreferrer">Twitter</a></Typography>
        <Typography>Join our <a href="https://discord.gg/fDRBajCB9V" target="_blank" rel="nofollow noreferrer">Discord Server</a></Typography>
        <Typography>Join our <a href="https://t.me/LIRA_DAO" target="_blank" rel="nofollow noreferrer">Telegram Group</a></Typography>
      </Box>
    </Box>
  );
}
