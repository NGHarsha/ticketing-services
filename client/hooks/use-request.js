import { useState } from "react";
import axios from "axios";

import style from "../styles/form.module.scss";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, {
        ...body,
        ...props,
      });
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      setErrors(
        <div className={style.alertDanger}>
          <h4>Oopss...</h4>
          <ul>
            {err.response.data.errors.map((e) => {
              return <li key={e.message}>{e.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
