import React from 'react';
import { Container, BoxProps, Box } from '@mantine/core';
import PhoneImg from '../../../assets/images/iphone/iphone-all-transparent.png';
import ContentBlock from '../../../components/ContentBlock';

function PhoneSection({ ...props }: BoxProps) {
  return (
    <Box {...props}>
      <Container size='lg' py={{ base: 72, sm: 112 }}>
        <ContentBlock
          title={'Empower Your Workflow.'}
          subtitle={`Discover the Power of Simplicity and Flexibility. Achieve Clarity with Boards, Lists,
            and Cards to Track Tasks and Assignments. Dive into Our Comprehensive Guide for a Seamless Start.`}
          img={PhoneImg}
          imgAlt='Agile Tasker sign up, project, workspace and login screens on iPhone'
          imageLeft={false}
          imageTop={false}
        />
      </Container>
    </Box>
  );
}

export default PhoneSection;
