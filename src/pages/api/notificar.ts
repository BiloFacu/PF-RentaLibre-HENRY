import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
  api: {
      externalResolver: true
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    const topic = query.topic || query.type;
    console.log(topic)
    var merchant_order;
    switch(topic){
      case "payment":
        const payment_id = query.id || query['data.id'];
        const payment = await fetch("https://api.mercadopago.com/v1/payments/"+payment_id, {
          method: 'GET',
          headers: {
            Authorization: `${process.env.MERCADOLIBRE_AUTHORIZATION}`
        }}).then(res => res.json());
        merchant_order = await fetch("https://api.mercadopago.com/merchant_orders/"+payment.order.id, {
          method: 'GET',
          headers: {
            Authorization: `${process.env.MERCADOLIBRE_AUTHORIZATION}`
        }}).then(res => res.json());
        console.log(merchant_order)
        break
      case "merchant_order":
        const order_id = query.id
        merchant_order = await fetch("https://api.mercadopago.com/merchant_orders/"+order_id, {
          method: 'GET',
          headers: {
            Authorization: `${process.env.MERCADOLIBRE_AUTHORIZATION}`
        }}).then(res => res.json());
        console.log(merchant_order)
        break
    }
  };