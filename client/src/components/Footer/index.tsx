import React from 'react';
import {
  Flex,
  Text,
  Container,
  Box,
  Divider,
  BoxProps,
  SimpleGrid,
  Image,
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

function Footer({ ...props }: BoxProps) {
  return (
    <Box bg='gray.9' {...props}>
      <Container size='lg' py={10}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 'sm', md: 'md' }}>
          <Image src={LogoLight} w={200} />
        </SimpleGrid>
      </Container>

      <Divider mx={30} color='gray.5' />

      <Container size='lg' py={20} className={classes.bottom}>
        <Flex
          gap={15}
          direction={{ base: 'column', md: 'row' }}
          mx={{ base: 30, md: 0 }}
        >
          <Text c='gray.5' size='sm' mr={20}>
            Copyright © 2024 Agile Tasker.
          </Text>
          <Link to={''} style={{ textDecorationLine: 'none' }}>
            <Text c='gray.5' size='sm'>
              Privacy Policy
            </Text>
          </Link>
          <Link to={''} style={{ textDecorationLine: 'none' }}>
            <Text c='gray.5' size='sm'>
              Terms and Conditions
            </Text>
          </Link>
        </Flex>

        <Flex gap={30} mx={{ base: 30, md: 0 }}>
          <Link to={''}>
            <FaInstagram size={16} color='var(--mantine-color-gray-5)' />
          </Link>
          <Link to={''}>
            <FaFacebook size={16} color='var(--mantine-color-gray-5)' />
          </Link>
          <Link to={''}>
            <FaLinkedin size={16} color='var(--mantine-color-gray-5)' />
          </Link>
          <Link to={''}>
            <FaTwitter size={16} color='var(--mantine-color-gray-5)' />
          </Link>
          <Link to={''}>
            <FaYoutube size={16} color='var(--mantine-color-gray-5)' />
          </Link>
        </Flex>
      </Container>
    </Box>
  );
}

export default Footer;
