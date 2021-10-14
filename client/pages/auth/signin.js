import React, { useState } from "react";
import Router from "next/router";
import style from "../../styles/form.module.scss";

import useRequest from "../../hooks/use-request";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const submit = async (e) => {
    e.preventDefault();
    const data = await doRequest();
  };

  return (
    <div className={style.signin}>
      <form className={style.form} onSubmit={submit}>
        <h2 className={style.form__heading}>Signin</h2>
        <div className={style.form__group}>
          <input
            placeholder="Email Address"
            type="email"
            className={style.form__input}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={style.form__label}>Email Address</label>
        </div>
        <div className={style.form__group}>
          <input
            placeholder="Password"
            className={style.form__input}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={style.form__label}>Password</label>
        </div>
        {errors}
        <div className={style.form__buttonGroup}>
          <button
            className={style.form__button + " " + style.form__buttonPrimary}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default signup;
