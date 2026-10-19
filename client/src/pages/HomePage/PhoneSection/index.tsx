import React from 'react';
import { Container, BoxProps, Box } from '@mantine/core';
import PhoneImg from '../../../assets/images/iphone/iphone-all-transparent.png';
import ContentBlock from '../../../components/ContentBlock';

function PhoneSection({ ...props }: BoxProps) {
  return (
    <Box
      {...props}
      style={{
        background:
          'linear-gradient(180deg, #fff 0%, var(--mantine-color-cyan-1) 100%)',
      }}
    >
      <Container size='lg' py={30}>
        <ContentBlock
          title={'Empower Your Workflow.'}
          text={'Agile Tasker'}
          subtitle={`Discover the Power of Simplicity and Flexibility. Achieve Clarity with Boards, Lists, 
            and Cards to Track Tasks and Assignments. Dive into Our Comprehensive Guide for a Seamless Start.`}
          img={PhoneImg}
          imageLeft={false}
          imageTop={false}
        />
      </Container>
    </Box>
  );
}

export default PhoneSection;
