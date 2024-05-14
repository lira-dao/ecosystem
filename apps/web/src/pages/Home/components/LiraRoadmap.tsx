import React from 'react';
import { Col, Row } from '@satoshi-lira/ui';
import { StyledDivider } from './StyledDivider';
import { Typography } from '../../../components/ui';


export function LiraRoadmap() {
  return (
    <Col marginBottom={160}>
      <Row width={160}>
        <StyledDivider width={160} height={4} margin="80px 0 160px 0" />
      </Row>

      <Col width={1} maxWidth={1280} margin="0 auto" alignItems="flex-start">
        <Typography as="h5">Roadmap</Typography>
      </Col>
    </Col>
  );
}
