import { SimpleGrid } from "@chakra-ui/react";

import React from "react";
import CardProductHome from "../components/CardProductHome";
import Carusel from "../components/Carusel";
import { RouterOutputs, trpc } from "../utils/trpc";

interface Props {
  data: RouterOutputs["product"]["getProducts"];
  dataCarusel: Carusel[];
}

interface Carusel {
  id: number;
  image: string;
}

export default function Page({}: Props, props: Props) {
  //export default function Page() {

  //trae la data del back
  const data = trpc.product.getProducts.useQuery({ limit: 10, page: 1 }).data

  const resCarusel = trpc.product.getProducts.useQuery({
    page: 1,
    limit: 7,
  }).data
  //mapea la data del carrusel para mostrarla en el carrusel
  const dataCarusel = resCarusel?.map((product, index) => {
    return {
      id: index,
      picture: product.pictures[0],
    };
  });

  return (
    <>
      <Carusel dataCarusel={dataCarusel} />
      <SimpleGrid columns={3} spacingX="0px" spacingY="0px">
        {data?.map((p) => (
          <CardProductHome
            key={p.id}
            productName={p.title}
            photo={p.pictures[0]}
            productPrice={p.price}
            id={p.id}
            category={p.category?.name}
            fecha={""}
          />
        ))}
      </SimpleGrid>
    </>
  );
}