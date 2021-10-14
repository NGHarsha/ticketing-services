//import "bootstrap/dist/css/bootstrap.css";
import "../styles/global.scss";
import axios from "axios";

import Header from "../components/Header";
import { buildClient } from "../api/build-client";

const global = ({ Component, pageProps, currentUser }) => {
  // console.log("_app:", pageProps, currentUser);
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="layout">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </>
  );
};

global.getInitialProps = async (appContext) => {
  console.log("Inside global initialprops", appContext.router.route);

  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};
  // //When global getInitialProps is defined, page specific getInitialProps is not called.
  // //So, we get access to the getInitialProps method of the page being rendered and call it manually.\
  // //Check if getInitialProps is defined for the current page.
  // //If so, call it.
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  //console.log("_app: ", pageProps, data);

  return { pageProps, ...data };
};

export default global;
