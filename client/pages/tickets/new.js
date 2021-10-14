import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

import style from "../../styles/form.module.scss";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const submit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className={style.ticket}>
      <h1 className={style.form__heading}>Create a ticket</h1>
      <form onSubmit={submit}>
        <div className={style.form__group}>
          <input
            className={style.form__input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className={style.form__label}>Title</label>
        </div>
        <div className={style.form__group}>
          <input
            className={style.form__input}
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
          <label className={style.form__label}>Price</label>
        </div>
        {errors}
        <div className={style.form__buttonGroup}>
          <button
            className={style.form__button + " " + style.form__buttonPrimary}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;
