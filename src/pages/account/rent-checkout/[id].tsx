import { trpc } from "../../../utils/trpc";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  HStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Badge,
  Textarea,
  useToast,
  Input,
  Center,
} from "@chakra-ui/react";

import { MdLocalShipping } from "react-icons/md";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Style from "../../../styles/id.module.css";

import sendEmail from "../../../utils/contact-functions/contact-Email";


const validate = (input: any) => {
  const errors = {
    stars: false,
    size: false,
  };
  if (input.rating > 5 || input.rating < 1) {
    errors.stars = true;
  }
  if (input.comment.length < 5 || input.comment.length > 300) {
    errors.size = true;
  }
  return errors;
};

export default function ProductDetail() {

  // console.log('Window Location:', window.location)

  const myKeysValues = window.location.search;
  const urlParams = new URLSearchParams(myKeysValues);

  //const id = urlParams.get('prodId');
  const totalDays = urlParams.get('totalDays');
  const totalPrice = urlParams.get('totalPrice');
  const startDate = urlParams.get('startDate');
  const endDate = urlParams.get('endDate');
  const userIdRentFROM: any = urlParams.get('U'); //este es el ID del locador - par aeviar confirmacion operacion

  //console.log(totalDays, totalPrice)

  const toast = useToast();
  const router = useRouter();
  const session = useSession();
  const { id }: any = router.query;
  //trae del back con id
  const product = trpc.product.getProductByID.useQuery({ id }).data;
  const userRentFROM = trpc.user.getUser.useQuery({ userId: userIdRentFROM }).data;

  const authorized = session.data?.userDB?.role === "ADMIN";

  const colorTxt = useColorModeValue("black", "gray.900");
  const colorBg = useColorModeValue("yellow.300", "orange.50");

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {

      const res = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer APP_USR-5672095275524228-121515-ef3e594e4fc515b3e4d7d98cff8d97e1-1263932815`,
          },
          body: JSON.stringify({
            payer: {
              email: session?.data?.user?.email,
              phone: "",
              name: session?.data?.user?.name,
            },
            product_id: id,
            items: [
              {
                title: product?.title,
                description: product?.description,
                picture_url: product?.pictures[0],
                category_id: product?.category,
                id: product?.id,
                quantity: 1, //AGREGAR PRODUCT?.QUANTITY a schema
                unit_price: parseFloat(totalPrice!),
              },
            ],
            back_urls: {
              success: `http://localhost:3000/success/${id}`,
              failure: `http://localhost:3000/failure/${id}`,
              pending: `http://localhost:3000/pending/${id}`,
            },
            notification_url:
            `https://rentalibre.vercel.app/success/${id}`,
          }),
        }
      );
      const json = await res.json();
      console.log(json, process.env.NEXT_PUBLIC_MERCADOLIBRE_AUTHORIZATION);
      router.push(json.init_point);

      const values = {
        name: userRentFROM?.name,
        email: userRentFROM?.email,
        subject: `¡Alquiler Concretado! ${product?.title}`,
        message: `
        <h3>Su artículo ${product?.title} ha sido alquilado entre siguientes fechas:</h3><br>
        <h4>Desde el: ${startDate}</h4>
        <h4>Hasta el:  ${endDate}</h4>
        <h4>Condiciones alquiler:</h4>
        <p>- Cantidad de días de alquiler:${totalDays}</p>
        <p>- Total a cobrar: $${totalPrice}</p><br>
        <p> Saudos, El equipo de rentalibre.</p>
      `,
      };

      //console.log(values);

      if (true) {
        sendEmail(values);
      } else {
        console.log('No Data response from publication');
      };

      //********************************** */
      toast({
        title: "¡ GRACIAS !",
        status: "success",
        duration: 2000,
        position: "top",
      });


      //router.push("/");

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={10}
            alt={"product image"}
            src={product?.pictures[0]}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {product?.title}
            </Heading>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={300}
              fontSize={"2xl"}
            >
              {"Valor diario: $" + product?.price}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >Inicio del Alquiler:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>{startDate}</ListItem>
                </List>
              </SimpleGrid>
            </Box>

            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >FIN DEL ALQUILER:
              </Text>
              <List spacing={2}>
                <ListItem>
                  {endDate}
                </ListItem>
              </List>
            </Box>

            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >CANTIDAD DE DIAS:
              </Text>
              <List spacing={2}>
                <ListItem>
                  {totalDays} días
                </ListItem>
              </List>
            </Box>

            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >PRECIO TOTAL A ABONAR:
              </Text>
              <List spacing={2}>
                <ListItem>
                  ${totalPrice}
                </ListItem>
              </List>
            </Box>



          </Stack>

          <HStack spacing={75} justifyContent={"center"}></HStack>
          <Center>
            <Button
              rounded={10}
              w={300}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={useColorModeValue("teal", "gray.50")}
              color={useColorModeValue("white", "teal")}
              textTransform={"uppercase"}
              _hover={{
                transform: "translateY(2px)",
                boxShadow: "lg",
              }}
              onClick={handleSubmit}
            >
              ¡ ALQUILAR !
            </Button>
          </Center>

          {/* 
          
//ESTA SERIA LA LOGICA CON AVAILABLE DESDE LA BASE DE DATOS - AHORA VA POR DEFECTO VIA QUERY
          
          <Button
            rounded={10}
            w={250}
            mt={8}
            size={"lg"}
            py={"7"}
            bg={useColorModeValue("teal", "gray.50")}
            color={useColorModeValue("white", "teal")}
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
            onClick={handleSubmit}
          >
            {product?.availability ? (
              <Badge ml={2} colorScheme="green">
                Disponible para renta!
              </Badge>
            ) : (
              <Badge ml={2} colorScheme="red">
                No disponible
              </Badge>
            )}
          </Button> */}

          <Stack direction="row" alignItems="center" justifyContent={"center"}>
            <MdLocalShipping />
            <Text>Consultar Envío</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
      <hr></hr>

      <hr />
    </Container>
  );
}
