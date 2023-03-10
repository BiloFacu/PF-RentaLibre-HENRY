import React from "react";
import { useSession, signIn, signOut, } from "next-auth/react";

import { Button, Center, Text, Box, Flex } from '@chakra-ui/react'


const Login = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <Center marginTop={40}>
        <Flex direction={'column'}>
        <Box marginBottom={5}>
        <Text fontSize='lg' as='b'>{session?.user?.name}, estas logueado</Text>
        </Box>
        <Button
          colorScheme='teal'
          size='md'
          onClick={() => signOut()}>
          Cerrar Sesión
        </Button>
        </Flex>
      </Center>
    )

  } else {
    return (
      <Center marginTop={40}>
        <Button
          colorScheme='teal'
          size='md'
          onClick={() => signIn()}>
          Iniciar Sesión
        </Button>
      </Center>
    );
  }
};

export default Login;
