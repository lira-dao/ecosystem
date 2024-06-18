import React from 'react';
import { Avatar, Box, Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import muiTheme from '../../theme_mui';
import avatarImage from '../../img/avatar_image.png';
// import gradientLiraDex from '../../../img/gradient-lira-dex.svg';


interface DaoTeamMember {
  name: string,
  role: string;
  description: string;
  avatarUrl: string;
}

const members: DaoTeamMember[] = [
  { name: 'John Doe', role: 'Developer', description: 'John is a leading developer with extensive blockchain experience.', avatarUrl: avatarImage },
  { name: 'Jane Smith', role: 'Project Manager', description: 'Jane is responsible for project coordination and management.', avatarUrl: avatarImage },
  { name: 'Rosbif', role: 'Developer', description: 'Rosbif is a leading developer with extensive blockchain experience.', avatarUrl: avatarImage },
];

export function DaoTeam() {
  const DaoTeamCard = ({ member }: { member: DaoTeamMember }) => (
    <Card sx={{ bgcolor: 'background.default', color: 'text.primary', m: 2, p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        avatar={<Avatar src={member.avatarUrl} aria-label="member-avatar" />}
        title={member.name}
        subheader={member.role}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ color: 'text.secondary' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2">
          {member.description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="lg" sx={{ p: 4, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1" color="white">Dao Team</Typography>
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
