import style from "../../styles/typography.module.scss";

const OrderIndex = ({ orders }) => {
  return (
    <div className={style.container}>
      <ul>
        {orders.map((order) => {
          console.log(orders);
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.ticket.price} - {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
