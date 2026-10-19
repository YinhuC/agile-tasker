import React from 'react';
import {
  Text,
  Container,
  Box,
  BoxProps,
  Group,
  Image,
  Anchor,
} from '@mantine/core';
import { Link } from 'react-router';
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import LogoLight from '../../assets/logos/logo-light.png';
import classes from './Footer.module.css';

const socials = [
  { label: 'Instagram', icon: FaInstagram },
  { label: 'Facebook', icon: FaFacebook },
  { label: 'LinkedIn', icon: FaLinkedin },
  { label: 'Twitter', icon: FaTwitter },
  { label: 'YouTube', icon: FaYoutube },
];

function Footer({ ...props }: BoxProps) {
  return (
    <Box component='footer' className={classes.root} {...props}>
      <Container size='lg' py={{ base: 48, sm: 64 }}>
        <Box className={classes.top}>
          <Link to={'/'}>
            <Image
              src={LogoLight}
              alt='agile-tasker'
              className={classes.logo}
            />
          </Link>
          <Group gap='xl' component='nav'>
            <Anchor component={Link} to='/views' className={classes.link}>
              Views
            </Anchor>
            <Anchor component={Link} to='/plans' className={classes.link}>
              Pricing
            </Anchor>
            <Anchor component={Link} to='/login' className={classes.link}>
              Sign in
            </Anchor>
          </Group>
        </Box>

        <Box className={classes.bottom}>
          <Group gap='lg'>
            <Text size='sm' className={classes.muted}>
              Copyright © 2024 Agile Tasker.
            </Text>
            <Anchor
              component={Link}
              to={''}
              size='sm'
              className={classes.muted}
            >
              Privacy Policy
            </Anchor>
            <Anchor
              component={Link}
              to={''}
              size='sm'
              className={classes.muted}
            >
              Terms and Conditions
            </Anchor>
          </Group>
          <Group gap='lg'>
            {socials.map((social) => (
              <Anchor
                key={social.label}
                component={Link}
                to={''}
                aria-label={social.label}
                className={classes.muted}
              >
                <social.icon size={16} />
              </Anchor>
            ))}
          </Group>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
