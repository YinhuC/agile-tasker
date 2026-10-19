import React from 'react';
import {
  Container,
  Box,
  Title,
  Text,
  Button,
  Stack,
  Image,
} from '@mantine/core';
import { Link } from 'react-router';
import WorkImg1 from '../../assets/images/work-1.png';
import WorkImg2 from '../../assets/images/work-2.png';
import DashboardImg from '../../assets/images/dashboard-1.png';
import BusinessImg from '../../assets/images/business.png';
import ChartImg1 from '../../assets/images/chart-1.png';
import ChartImg2 from '../../assets/images/chart-2.png';
import ChartImg3 from '../../assets/images/chart-3.png';
import ContentBlock from '../../components/ContentBlock';
import CtaBand from '../../components/CtaBand';
import Footer from '../../components/Footer';
import marketing from '../../theme/styles/marketing.module.css';
import classes from './ViewsPage.module.css';

const views = [
  {
    title: 'Kickstart success with an Agile Task.',
    subtitle:
      'Agile Tasker simplifies the transition from concept to execution. Plan projects, dissect tasks into manageable stages, and effortlessly monitor progress. Instantly track task statuses and celebrate milestones along the way. With Agile Tasker, project management is not only powerful but also enjoyable.',
    img: WorkImg2,
  },
  {
    title: 'Ensure on-time delivery with Timeline.',
    subtitle:
      "Stay ahead of sprints and goals with Timeline. Utilize Timeline to visualize how all components fit together over time. Easily adjust start and due dates on the fly as priorities evolve. Gain a quick overview of upcoming tasks and pinpoint any potential obstacles hindering your team's progress.",
    img: BusinessImg,
  },
  {
    title: 'Leverage Calendar to remain organized.',
    subtitle:
      'Begin each day prepared and informed. Whether managing a quarterly editorial calendar or keeping track of your to-dos, Calendar provides a clear glimpse into the work ahead. Sync third-party calendars to maintain a perfect work-life balance.',
    img: ChartImg2,
  },
  {
    title: 'Unlock actionable insights with Dashboard.',
    subtitle:
      'Gain a comprehensive overview of projects and processes with Dashboard, enabling proactive workload management and bottleneck prevention. Visualize key metrics such as due dates, assigned cards, and cards per list to ensure alignment among stakeholders and maintain high confidence levels.',
    img: DashboardImg,
  },
  {
    title: 'Experience it like a spreadsheet with Table view.',
    subtitle:
      'Zoom in on all the ongoing work across a board using the Table view. Review your tasks in a user-friendly spreadsheet-style list, allowing sorting and filtering to pinpoint the exact cards you need.',
    img: ChartImg3,
  },
  {
    title: 'Effectively handle tasks across numerous boards.',
    subtitle:
      'Craft as many tailored overviews as necessary across Workspace boards. Utilize the Workspace Table and Calendar views to monitor both minor details and major projects.',
    img: ChartImg1,
  },
];

function ViewsPage() {
  return (
    <Box className={marketing.page}>
      <Box className={classes.hero}>
        <Container size='lg' py={{ base: 64, sm: 96 }}>
          <Box className={classes.heroInner}>
            <Stack gap='lg'>
              <Title order={1} className={classes.heroTitle}>
                Revamp your work with Agile Tasker views.
              </Title>
              <Text size='lg' c='gray.8' maw='56ch'>
                Explore your projects from multiple perspectives with Board,
                Timeline, Table, Calendar, Dashboard, Map, and Workspace views,
                offering fresh insights into your tasks. Boards are accessible
                to all users, while additional views require a Premium or
                Enterprise account.
              </Text>
              <Button
                component={Link}
                to='/register'
                size='md'
                className={classes.heroButton}
              >
                Try views for free!
              </Button>
            </Stack>
            <Image src={WorkImg1} alt='' maw={460} mx='auto' />
          </Box>
        </Container>
      </Box>

      <Container size='lg' py={{ base: 72, sm: 112 }}>
        <Title order={2} ta='center' fw={500} mb={{ base: 48, sm: 80 }}>
          Discover the power of Agile Tasker views.
        </Title>
        <Box className={classes.views}>
          {views.map((view, index) => (
            <ContentBlock
              key={view.title}
              title={view.title}
              subtitle={view.subtitle}
              img={view.img}
              imageLeft={index % 2 === 0}
              titleOrder={3}
              titleWeight={500}
              subtitleSize={17}
              className={classes.view}
            />
          ))}
        </Box>
      </Container>

      <CtaBand
        title="Introduce dynamic new perspectives to your team's tasks."
        text='Begin your free trial today.'
        buttonText='Get started'
        to='/register'
      />
      <Footer />
    </Box>
  );
}

export default ViewsPage;
