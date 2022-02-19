import { Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from '../../res/PODO.png';

export default function Logo({ child }: any) {
  return (
    <Link to='/podo'>
      <Flex flex='1' justifyContent='center' alignItems='center'>
        <Image src={logo} height='20px' width='20px' />
        {child}
      </Flex>
    </Link>
  );
}
