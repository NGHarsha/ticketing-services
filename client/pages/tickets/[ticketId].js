import Router from "next/router";
import { useState } from "react";

import useRequest from "../../hooks/use-request";
import style from "../../styles/typography.module.scss";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <div className={style.container}>
      <h1 className={style.header}>Name: {ticket.title}</h1>
      <h4 className={style.sub}>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className={style.purchaseButton}>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  //variable name should be same as the wildcard file name
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
