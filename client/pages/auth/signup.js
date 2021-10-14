import React, { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import style from "../../styles/form.module.scss";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const submit = async (e) => {
    e.preventDefault();
    const data = await doRequest();
  };

  return (
    // <form onSubmit={submit}>
    //   <h2>Signup</h2>
    //   <div className="form-group">
    //     <label>Email Address</label>
    //     <input
    //       className="form-control"
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </div>
    //   <div className="form-group">
    //     <label>Password</label>
    //     <input
    //       type="password"
    //       className="form-control"
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </div>
    //   {errors}
    //   <button className="btn btn-primary">Sign Up</button>
    // </form>
    <div className={style.signup}>
      <form className={style.form} onSubmit={submit}>
        <h2 className={style.form__heading}>Signup</h2>
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
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default signup;
