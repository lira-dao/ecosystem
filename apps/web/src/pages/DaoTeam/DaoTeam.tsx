import React from 'react';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Container, Grid, IconButton, Typography } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import muiTheme from '../../theme_mui';
import avatarImage from '../../img/avatar_image.png';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


interface DaoTeamMember {
  name: string,
  role: string;
  description: string;
  avatarUrl: string;
  linkedInUrl: string;
  nickName?: string;
}

const members: DaoTeamMember[] = [
  {
    name:"Erwin Roio",
    role:"Co-founder",
    description:"Specialist in tokenomics and smart contract logic since 2018, Bitcoin analyst.",
    avatarUrl: avatarImage,
    linkedInUrl: "https://www.linkedin.com/in/erwin-roio-49858b156/",
    nickName: "n0x"
  },
  {
    name:"Federico Paletta",
    role:"Co-founder",
    description:"Lead technical officer with extensive experience in the blockchain sector.",
    avatarUrl: avatarImage,
    linkedInUrl: "https://www.linkedin.com/in/federico-paletta-b1999a91/",
    nickName: "Fredev"
  },
{
    name:"Jacopo Iessi",
    role:"Co-founder",
    description:"Head of official social media platforms.",
    avatarUrl: avatarImage,
    linkedInUrl: "https://www.linkedin.com/in/jacopo-iessi-666a9a19a/",
    nickName: "Thelroth"
  },
  {
    name:"Nicholas Angelucci",
    role:"Co-founder",
    description:"Expert developer in modern computing, including Artificial Intelligence and blockchain technology.",
    avatarUrl: avatarImage,
    linkedInUrl: "https://www.linkedin.com/in/nicholas-angelucci-65629616a/",
    nickName: "Nicholas"
  },
  {
    name:"Gabriele Passeri",
    role:"Co-founder",
    description:"Angel investor of the project, driven by a passion for making a difference in the community and fostering innovation.",
    avatarUrl: avatarImage,
    linkedInUrl: "https://www.linkedin.com/in/gabriele-passeri-701028218/"
  }
];

export function DaoTeam() {
  const DaoTeamCard = ({ member }: { member: DaoTeamMember }) => (
    <Card sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      m: 2,
      p: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
      '&:hover': {
        transform: 'scale(1.03)',
        transition: 'transform 0.25s ease-in-out'
      }
    }}>
      <CardHeader
        avatar={<Avatar src={member.avatarUrl} aria-label="member-avatar" sx={{ width: 64, height: 64 }} />}
        title={member.name}
        subheader={member.role}
        titleTypographyProps={{ variant: 'body1', color: 'primary.main' }}
        subheaderTypographyProps={{ color: 'text.secondary' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2">
          {member.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: 'auto', p: 2, justifyContent: member.nickName ? 'space-between' : 'flex-end' }}>
        {member.nickName && (
          <Typography sx={{ ml: 2, fontSize: '0.875rem', fontWeight: 'bold', color: 'text.primary' }}>
            {member.nickName}
          </Typography>
        )}
        <IconButton
          href={member.linkedInUrl}
          target="_blank" 
          sx={{
            color: 'primary.main',
            '&:visited': {
              color: 'primary.main'
            }
          }}>
          <LinkedInIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="lg" sx={{ p: 4, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1" color="white">Lira Dao Team</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="xl" textAlign="justify" margin={0}>
            Meet Our Team
            We are proud to introduce the talented and diverse team behind our project. Our co-founders bring a wealth of experience and a shared passion for innovation and community impact. Each member of our team plays a critical role in driving our mission forward and ensuring the success of our initiatives. Get to know the individuals who are making it all happen:
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {members.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DaoTeamCard member={member} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
