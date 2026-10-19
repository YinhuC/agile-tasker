import React from 'react';
import {
  Container,
  Title,
  Stack,
  ContainerProps,
  Accordion,
  Text,
} from '@mantine/core';

function AccordionSection({ ...props }: ContainerProps) {
  return (
    <Container size={860} pb={{ base: 72, sm: 112 }} {...props}>
      <Stack gap='xl'>
        <Title order={2} fw={500} ta='center'>
          Frequently asked questions
        </Title>

        <Accordion multiple={true} variant='separated' radius='md'>
          <Accordion.Item value='trial'>
            <Accordion.Control>
              <Text fw={500}>
                Does Agile Tasker provide a Premium trial period at no cost?
              </Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              Absolutely! All users can initiate a free trial of Agile Tasker
              Premium for their Workspace. During this trial, your Workspace
              will unlock unlimited Trello boards, extensive automation
              capabilities, access to features like Timeline and Dashboard, and
              much more!
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value='discounts'>
            <Accordion.Control>
              <Text fw={500}>Are there any discounted plans available?</Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              Indeed! Agile Tasker provides discounts for both non-profit
              organizations within the community and educational institutions.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value='payments'>
            <Accordion.Control>
              <Text fw={500}>Which payment methods are accepted?</Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              You can buy a monthly or annual Agile Tasker Standard or Premium
              subscription using any major credit card. Additional options are
              available for Enterprise customers. If you're keen on discovering
              more about Agile Tasker Enterprise, feel free to reach out to our
              sales team.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value='cancellation'>
            <Accordion.Control>
              <Text fw={500}>
                How can I terminate my Agile Tasker Standard or Premium
                subscription?
              </Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              If you're not completely satisfied with Agile Tasker Standard or
              Premium, you can downgrade at any moment. Upon downgrading, your
              team retains its Standard or Premium features and unlimited boards
              until the conclusion of the prepaid service period. After this
              period, it transitions into a free Agile Tasker Workspace capable
              of holding up to 10 boards. For further details on canceling your
              Standard or Premium subscription, please refer to our guidelines.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value='billing'>
            <Accordion.Control>
              <Text fw={500}>
                How are users calculated for billing purposes?
              </Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              A user on Agile Tasker who is added as a member to a
              Workspace—whether as a regular member or a team admin—is
              considered a billable team member included in the cost of Agile
              Tasker Standard or Premium. Any Guest who is on more than one
              board within the Workspace is designated as a Multi-Board Guest
              and is billed at the same rate as Standard or Premium Workspace
              members. For further details on Multi-Board Guests, refer to this
              page.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value='version'>
            <Accordion.Control>
              <Text fw={500}>
                Is there an on-premises version of Agile Tasker?
              </Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              Agile Tasker is proudly a cloud-only product. We provide access
              through the web, desktop, and our fantastic mobile apps.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value='subscription'>
            <Accordion.Control>
              <Text fw={500}>
                Can I subscribe to Agile Tasker Standard or Premium for just my
                individual account?
              </Text>
            </Accordion.Control>
            <Accordion.Panel c='gray.7'>
              Agile Tasker Standard and Premium are designed to accommodate all
              teams, including solo users! To upgrade to Standard or Premium,
              you'll need to create a Workspace and then upgrade that Workspace.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Container>
  );
}

export default AccordionSection;
