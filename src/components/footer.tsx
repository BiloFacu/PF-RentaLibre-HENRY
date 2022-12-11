import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

function footer() {
  return (
    <Box>
      <Container
        as={Stack}
        maxW={"100%"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        bg={useColorModeValue("#404c5a", "gray.800")}
        color={useColorModeValue("white", "#404c5a")}
      >
        <Stack direction={"row"} spacing={6}>
          <Link href={"contacto"}>Contacto</Link>
          <Link href={"faq"}>Preguntas Frecuentes</Link>
          <Link href={"legal"}>Legales</Link>
        </Stack>
        <Text>© 2022 RentaLibre. Todos los derechos reservados</Text>
      </Container>
    </Box>
  );
}

export default footer;
