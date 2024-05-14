import { default as ReactCountdown } from 'react-countdown';
import { CountdownRenderProps } from 'react-countdown/dist/Countdown';
import styled from 'styled-components';
import { Col, Row } from '@satoshi-lira/ui';
import { Typography } from '../ui';
import { Colors } from '../../theme';


export interface StyledRectangleProps {
  width: number;
  height: number;
  color: keyof Colors;
  opacity?: number;
}

export const StyledRectangle = styled(Row)<StyledRectangleProps>`
  display: block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: ${props => props.theme.colors[props.color]};
  opacity: ${props => props.opacity || 1};
`;

export interface CountdownProps {
  date: Date;
}

const StyledValue = styled(Typography)`
  font-family: ${props => props.theme.fontFamilies.secondary};
  font-size: ${props => props.theme.fontSizes.h4};
  font-weight: bold;
  margin: 0;
  text-align: left;
  line-height: 60px;
`;

const StyledLabel = styled(Typography)`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.subtitle};
  margin: 0 0 10px;
  text-align: left;
  line-height: 30px;
`;

export function Countdown({ date }: CountdownProps) {
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return null;
    }

    return (
      <Row
        flexDirection={['column', 'row', 'row', 'row']}
        justifyContent={['center', 'flex-start']}
        alignItems="center"
      >
        <Col
          marginLeft={[32, 32, 32, 0]}
          marginRight={32}
          width={['auto', 'auto', 'auto', 110]}
          pb={[10, 10, 10, 0]}
          alignItems={['center', 'flex-start', 'flex-start', 'flex-start']}
        >
          <StyledValue>{days}</StyledValue>
          <StyledLabel>Days</StyledLabel>
          <StyledRectangle width={92} height={4} color="horizontalGreenToCyan" opacity={0.6} />
        </Col>
        <Col
          marginX={32}
          width={['auto', 'auto', 'auto', 110]}
          pb={[10, 10, 10, 0]}
          alignItems={['center', 'flex-start', 'flex-start', 'flex-start']}
        >
          <StyledValue>{hours}</StyledValue>
          <StyledLabel>Hours</StyledLabel>
          <StyledRectangle width={92} height={4} color="horizontalGreenToCyan" opacity={0.6} />
        </Col>
        <Col
          marginX={32}
          width={['auto', 'auto', 'auto', 110]}
          pb={[10, 10, 10, 0]}
          alignItems={['center', 'flex-start', 'flex-start', 'flex-start']}
        >
          <StyledValue>{minutes}</StyledValue>
          <StyledLabel>Minutes</StyledLabel>
          <StyledRectangle width={92} height={4} color="horizontalGreenToCyan" opacity={0.6} />
        </Col>
        <Col
          marginLeft={32}
          marginRight={[32, 32, 32, 0]}
          width={['auto', 'auto', 'auto', 110]}
          alignItems={['center', 'flex-start', 'flex-start', 'flex-start']}
        >
          <StyledValue color="primary">{seconds}</StyledValue>
          <StyledLabel>Sec</StyledLabel>
          <StyledRectangle width={92} height={4} color="horizontalGreenToCyan" opacity={0.6} />
        </Col>
      </Row>
    );
  };

  return (
    <ReactCountdown
      date={date}
      renderer={countdownRenderer}
    />
  );
}
