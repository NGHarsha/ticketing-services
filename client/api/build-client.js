import axios from "axios";

export const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    //   //we are on the server. To be specific, SSR. Client service in kubernetes should request auth service for current user.
    //   //We can use http://auth-srv/api/users/currentuser url to request auth-srv.
    //   //But exposing specific service name is bad. Hence we can request Ingress service, which redirects the request to specific service.
    //   //http://INGRESS_SERVICENAME.INGRESS_SERVICE_NAMESPACE.svc.cluster.local/..
    //   //Ingress service only redirects requests if they are from ticketing.dev.
    //   //Hence pass the domain in Host.
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    //we are on the browser/client
    //   //request should be made with base url of  ""(empty string). Browser will replace the
    //   //base url with current domain in window.
    //   //Hence the request will be directed to ingress, which then redirects to specific service
    //   //based on logic defined in ingress.
    return axios.create({
      baseURL: "/",
    });
  }
};
