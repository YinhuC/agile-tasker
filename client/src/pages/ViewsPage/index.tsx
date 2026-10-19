import React from 'react';
import {
  Container,
  Box,
  Title,
  Text,
  Button,
  Stack,
} from '@mantine/core';
import WorkImg1 from '../../assets/images/work-1.png';
import WorkImg2 from '../../assets/images/work-2.png';
import DashboardImg from '../../assets/images/dashboard-1.png';
import BusinessImg from '../../assets/images/business.png';
import ChartImg1 from '../../assets/images/chart-1.png';
import ChartImg2 from '../../assets/images/chart-2.png';
import ChartImg3 from '../../assets/images/chart-3.png';
import ContentBlock from '../../components/ContentBlock';
import Footer from '../../components/Footer';

function ViewsPage() {
  return (
    <>
      <Box
        id='views'
        style={{
          background:
            'linear-gradient(30deg, var(--mantine-color-blue-1) 0%, #fff 100%)',
        }}
      >
        <Container size='lg' py={30}>
          <ContentBlock
            title={'Revamp your work with Agile Tasker views.'}
            subtitle={`Explore your projects from multiple perspectives with Board, Timeline, Table, Calendar, Dashboard, Map, 
          and Workspace views, offering fresh insights into your tasks. Boards are accessible to all users, while additional views 
          require a Premium or Enterprise account.`}
            img={WorkImg1}
            imageLeft={false}
            titleWeight={500}
            py={30}
          />
        </Container>
      </Box>
      <Container size='lg' py={80}>
        <Stack>
          <Title order={1} fw={500} mb={10} ta='center'>
            Discover the power of Agile Tasker views.
          </Title>
          <Button m='auto' mb={50} size='md'>
            Try views for free!
          </Button>
        </Stack>
        <ContentBlock
          title={'Kickstart success with an Agile Task.'}
          subtitle={`Agile Tasker simplifies the transition from concept to execution. Plan projects, dissect tasks into manageable 
          stages, and effortlessly monitor progress. Instantly track task statuses and celebrate milestones along the way. With Agile 
          Tasker, project management is not only powerful but also enjoyable.`}
          img={WorkImg2}
          titleOrder={2}
          titleWeight={500}
          subtitleSize={18}
          mb={80}
        />
        <ContentBlock
          title={'Ensure on-time delivery with Timeline.'}
          subtitle={`Stay ahead of sprints and goals with Timeline. Utilize Timeline to visualize how all components fit together over 
          time. Easily adjust start and due dates on the fly as priorities evolve. Gain a quick overview of upcoming tasks and pinpoint 
          any potential obstacles hindering your team's progress.`}
          img={BusinessImg}
          titleOrder={2}
          titleWeight={500}
          subtitleSize={18}
          imageLeft={false}
          mb={80}
        />
        <ContentBlock
          title={'Leverage Calendar to remain organized.'}
          subtitle={`Begin each day prepared and informed. Whether managing a quarterly editorial calendar or keeping track of your to-dos, 
          Calendar provides a clear glimpse into the work ahead. Sync third-party calendars to maintain a perfect work-life balance.`}
          img={ChartImg2}
          titleOrder={2}
          titleWeight={500}
          subtitleSize={18}
          mb={80}
        />
        <ContentBlock
          title={'Unlock actionable insights with Dashboard.'}
          subtitle={`Gain a comprehensive overview of projects and processes with Dashboard, enabling proactive workload management and 
          bottleneck prevention. Visualize key metrics such as due dates, assigned cards, and cards per list to ensure alignment among 
          stakeholders and maintain high confidence levels.`}
          img={DashboardImg}
          titleOrder={2}
          titleWeight={500}
          subtitleSize={18}
          imageLeft={false}
          mb={80}
        />
        <ContentBlock
          title={'Experience it like a spreadsheet with Table view.'}
          subtitle={`Zoom in on all the ongoing work across a board using the Table view. Review your tasks in a user-friendly 
          spreadsheet-style list, allowing sorting and filtering to pinpoint the exact cards you need.`}
          img={ChartImg3}
          titleOrder={2}
          titleWeight={500}
          subtitleSize={18}
          imageSize='85%'
          mb={80}
        />
        <ContentBlock
          title={'Effectively handle tasks across numerous boards.'}
          subtitle={`Craft as many tailored overviews as necessary across Workspace boards. Utilize the Workspace Table and 
          Calendar views to monitor both minor details and major projects.`}
          img={ChartImg1}
          titleOrder={2}
          titleWeight={500}
          subtitleSize={18}
          imageLeft={false}
          imageSize='85%'
          mb={80}
        />
      </Container>
      <Box
        style={{
          background:
            'linear-gradient(180deg, var(--mantine-color-pink-0) 0%, #fff 100%)',
        }}
      >
        <Container size='lg' py={80}>
          <Stack>
            <Title order={2} fw={500} mb={5} ta='center'>
              Introduce dynamic new perspectives to your team's tasks.
            </Title>
            <Text ta='center' size='lg' mb={10}>
              Begin your free trial today.
            </Text>
            <Button m='auto' size='md'>
              Get started
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default ViewsPage;
