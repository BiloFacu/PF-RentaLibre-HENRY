import React from "react";
import Link from "next/link";
import {
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Notification = () => {
    const session = useSession();
    if(session.status === "unauthenticated") return <h1> No estas logueado </h1>
    const notification = trpc.notification.getNotification.useQuery({
        userId: session?.data?.userDB?.id,
        }).data;
    return(
        notification && notification[0]?.user.length === 0 ? <h1> No tienes notificaciones todavia </h1> :
        notification && notification![0]?.user.map((notification: any) => (
            <Center key={notification.notificationType[0]?.productId} py={6}>
                <Link href={`/productDetail/${notification.notificationType[0]?.productId}`}>
                <Stack
                //borderWidth="1px"
                borderRadius="lg"
                w={{ sm: "100%", md: "700px" }}
                height={{ sm: "476px", md: "10rem" }}
                direction={{ base: "column", md: "row" }}
                bg="white"
                boxShadow={"xl"}
                padding={4}
                >
                <Flex flex={0.4} align="center">
                    <Box w="170px">
                    <Image
                        objectFit="contain"
                        boxSize="180px"
                        src={notification.notificationType[0]?.productImage}
                        maxW={{ base: "100%", sm: "200px" }}
                        height="160px"
                        alt={notification.notificationType[0]?.productName}
                    />
                    </Box>
                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="left"
                    p={1}
                    pt={2}
                    pl={10}
                >
                    <Heading fontSize={"xl"} fontFamily={"body"}>
                    {notification.notificationType[0]?.productName}
                    </Heading>
                        <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
                            {notification.notificationType[0]?.type}
                        </Text>
                        {notification.notificationType[0]?.type === "Review" ?
                        <Text fontWeight={600} fontSize={"xl"}>
                            {notification.notificationType[0]?.message} de {notification.userAction.name}
                        </Text> : 
                        <Text fontWeight={600} fontSize={"xl"}>
                            {notification.notificationType[0]?.message} por {notification.userAction.name}
                        </Text>}
                </Stack>
                </Stack>
            </Link>
        </Center>
            ))    
    )
}

export default Notification;