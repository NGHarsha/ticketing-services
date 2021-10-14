import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import style from "../../styles/typography.module.scss";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <div className={style.container}>
        <p className={style.timerText}>Sorry. Order has expired</p>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <h1 className={style.header}>Order Details</h1>
      <p className={style.timerText}>{timeLeft} seconds until order expires</p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51JjdZVSGUOMYqUPbF5h3Bvuans4sNuiukiPEb1Qra6mZI4ffwIWo6aDMmgamwtdQ2kcePwBvjvZj3tjwNmYgb0oZ003FuAHRhC"
        amount={order.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
