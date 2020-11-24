import * as React from 'react';
import { Layout, Text } from '../ui';

const BuyGameHeader = () => {
  return (
    <Layout paddingBottom={'3rem'} paddingTop={'1rem'}>
      <Text color={'#575757'} fontSize={'1.5rem'}>
        I did not create the original board game. I just really enjoy playing
        it.{' '}
        <a href="https://www.wavelength.zone/">
          Please visit the official site
        </a>{' '}
        and buy a physical copy to support the developers!
      </Text>
    </Layout>
  );
};

export default BuyGameHeader;
