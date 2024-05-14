import React, { useState } from 'react';
import { Col, Row } from '@satoshi-lira/ui';
import { PreSaleInfoCard } from './PreSaleInfoCard';
import { StyledText } from './StyledText';
import { StyledContainerRadialBackground } from './StyledContainerRadialBackground';
import { ColorWrap, Typography } from '../../../components/ui';
import { PositionedModal } from '../../../components/Modal/PositionedModal';
import { Backdrop } from '../../../components/Modal/Backdrop';
import liraPresaleStep1 from '../../../img/lira-pre-sale-step-1.png';
import liraPresaleStep2 from '../../../img/lira-pre-sale-step-2.png';
import liraPresaleStep3 from '../../../img/lira-pre-sale-step-3.png';
import modalPresaleStep1 from '../../../img/modal-pre-sale-step-1.png';
import modalPresaleStep2 from '../../../img/modal-pre-sale-step-2.png';
import modalPresaleStep3 from '../../../img/modal-pre-sale-step-3.png';
import four from '../../../img/four.svg';


export function PresaleInfo() {
  const [showModalOne, setShowModalOne] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [showModalThree, setShowModalThree] = useState(false);

  const renderBackdrop = (props: any) => <Backdrop className="backdrop" {...props} />;

  return (
    <Col margin="0 auto">
      <StyledContainerRadialBackground>
        <Row justifyContent={['center']} marginBottom={'40px'}>
          <StyledText as="h3" fontSize={['32px', '48px']}>
            Pre-sale <ColorWrap color="primary">Info</ColorWrap>
          </StyledText>
        </Row>
        <Row
          width={1}
          alignItems={['center']}
          flexDirection={['column', 'column', 'column', 'row']}
          justifyContent="space-evenly"
          margin={['0 0 80px', '0 0 80px', '0 0 80px', '0 0 80px']}
        >
          <PreSaleInfoCard
            alignItems={'start'}
            width={[4 / 5, 2 / 3, 1 / 2, 1 / 3]}
            height={378}
            background={liraPresaleStep1}
            margin={[0, 0, '0 40px', '0 40px']}
          >
            <Col marginLeft="24%" marginRight={10} justifyContent="space-between">
              <Typography
                fontFamily={'primary'}
                fontWeight={700}
                color="primary"
                fontSize="subtitle"
                marginTop={30}
                marginBottom={0}
              >
                Phase 1
              </Typography>
              <Typography fontWeight={700} color="white" fontSize="p" margin={0}>
                Purchase LIRA DAO TOKEN (LDT) during the first phase of the presale and receive a 15% bonus on your
                purchases.
              </Typography>
              {/*<Typography
                color="secondary"
                fontSize="p"
                marginTop={40}
                cursor="pointer"
                onClick={() => setShowModalOne(true)}
              >
                view more &#62;
              </Typography>*/}
            </Col>
          </PreSaleInfoCard>

          <PreSaleInfoCard
            alignItems={'start'}
            width={[4 / 5, 2 / 3, 1 / 2, 1 / 3]}
            height={378}
            background={liraPresaleStep2}
            margin={['40px 0', '40px 0', '0 40px', '0 40px']}
          >
            <Col marginLeft="24%" marginRight={10} justifyContent="space-between">
              <Typography
                fontFamily={'primary'}
                fontWeight={700}
                color="primary"
                fontSize="subtitle"
                marginTop={30}
                marginBottom={0}
              >
                Phase 2
              </Typography>
              <Typography fontWeight={700} color="white" fontSize="p" margin={0}>
                In the second phase of the presale, the bonus decreases to 10%, but the excitement shows no signs of
                waning.
              </Typography>
              {/*<Typography
                color="secondary"
                fontSize="p"
                marginTop={40}
                cursor="pointer"
                onClick={() => setShowModalTwo(true)}
              >
                view more &#62;
              </Typography>*/}
            </Col>
          </PreSaleInfoCard>

          <PreSaleInfoCard
            alignItems={'start'}
            width={[4 / 5, 2 / 3, 1 / 2, 1 / 3]}
            height={378}
            background={liraPresaleStep3}
            margin={[0, 0, '0 40px', '0 40px']}
          >
            <Col marginLeft="24%" marginRight={10} justifyContent="space-between">
              <Typography
                fontFamily={'primary'}
                fontWeight={700}
                color="primary"
                fontSize="subtitle"
                marginTop={30}
                marginBottom={0}
              >
                Phase 3
              </Typography>
              <Typography fontWeight={700} color="white" fontSize="p" margin={0}>
                The third phase of the presale still offers a 5% bonus for purchases of LIRA DAO TOKEN (LDT).
              </Typography>
              {/*<Typography
                color="secondary"
                fontSize="p"
                marginTop={40}
                cursor="pointer"
                onClick={() => setShowModalThree(true)}
              >
                view more &#62;
              </Typography>*/}
            </Col>
          </PreSaleInfoCard>

          <PositionedModal
            top={6}
            left={17}
            show={showModalOne}
            onHide={() => setShowModalOne(false)}
            renderBackdrop={renderBackdrop}
            aria-labelledby="modal-label"
            autoFocus={false}
          >
            <div
              style={{
                height: '834px',
                width: '1258px',
                backgroundImage: `url(${modalPresaleStep1})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                style={{
                  paddingTop: '2rem',
                  paddingLeft: '15rem',
                  paddingRight: '8rem',
                }}
              >
                <Typography fontFamily={'primary'} fontWeight={700} color="primary" fontSize="h5" marginY={5}>
                  Phase 1: Early Bird Bonus
                </Typography>
                <hr style={{ marginBottom: '3rem' }}></hr>
                <Typography color="white" fontSize="p" marginY={10}>
                  Purchase LIRA DAO TOKEN (LDT) during the first phase of the presale and receive a 15% bonus on your
                  purchases.
                  <br /><br />
                  An unmissable opportunity for early participants to enter the world of decentralized finance.
                  <br /><br />
                </Typography>
              </div>
            </div>
          </PositionedModal>

          <PositionedModal
            top={6}
            left={17}
            show={showModalTwo}
            onHide={() => setShowModalTwo(false)}
            renderBackdrop={renderBackdrop}
            aria-labelledby="modal-label"
            autoFocus={false}
          >
            <div
              style={{
                height: '834px',
                width: '1258px',
                backgroundImage: `url(${modalPresaleStep2})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                style={{
                  paddingTop: '2rem',
                  paddingLeft: '15rem',
                  paddingRight: '8rem',
                }}
              >
                <Typography fontFamily={'primary'} fontWeight={700} color="primary" fontSize="h5" marginY={5}>
                  Phase 2: Accelerating Purchases
                </Typography>
                <hr style={{ marginBottom: '3rem' }}></hr>
                <Typography color="white" fontSize="p" marginY={10}>
                  In the second phase of the presale, the bonus decreases to 10%, but the excitement shows no signs of
                  waning.
                  <br /><br />
                  Join us as we accelerate towards a decentralized future with LIRA DAO TOKEN (LDT).
                </Typography>
              </div>
            </div>
          </PositionedModal>

          <PositionedModal
            top={6}
            left={17}
            show={showModalThree}
            onHide={() => setShowModalThree(false)}
            renderBackdrop={renderBackdrop}
            aria-labelledby="modal-label"
            autoFocus={false}
          >
            <div
              style={{
                height: '834px',
                width: '1258px',
                backgroundImage: `url(${modalPresaleStep3})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                style={{
                  paddingTop: '2rem',
                  paddingLeft: '15rem',
                  paddingRight: '8rem',
                }}
              >
                <Typography fontFamily={'primary'} fontWeight={700} color="primary" fontSize="h5" marginY={5}>
                  Phase 3: Last Chance for Bonus
                </Typography>
                <hr style={{ marginBottom: '3rem' }}></hr>
                <Typography color="white" fontSize="p" marginY={10}>
                  The third phase of the presale still offers a 5% bonus for purchases of LIRA DAO TOKEN (LDT).
                  <br /><br />
                  Don't miss the opportunity to participate in these final phases and secure your place in the
                  decentralized
                  future.
                </Typography>
              </div>
            </div>
          </PositionedModal>
        </Row>
      </StyledContainerRadialBackground>
      <Col
        maxWidth={2048}
        margin={['0 40px 120px']}
        alignItems={['center', 'center', 'center', 'flex-start']}
        background={`url(${four}) no-repeat center -80px`}
      >
        <Row>
          <StyledText as="h3" fontSize={['32px', '46px', '46px', '80px']} margin={0}>
            <ColorWrap color="primary">"</ColorWrap><br />The final <ColorWrap color="primary">phase</ColorWrap>
          </StyledText>
        </Row>
        <Col width={1}>
          <Typography color="white" fontSize="2xl" marginY={32}>
            As the presale comes to a close, this is your last chance to acquire LIRA DAO TOKEN (LDT) before the
            official launch. Act now to secure your tokens and be part of shaping the future of decentralized finance
            and governance.
          </Typography>
          <Typography color="white" fontSize="2xl" marginY={0}>
            Following the conclusion of Phase 4, the decentralized exchange (DEX) will be opened,
            providing participants with a platform to trade and exchange LDT tokens.
          </Typography>
        </Col>
      </Col>
    </Col>
  );
}
