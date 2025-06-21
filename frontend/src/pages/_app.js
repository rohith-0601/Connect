import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/config/redux/store";
import { useEffect } from "react";


export default function App({ Component, pageProps }) {
  useEffect(() => {
    // ✅ Runs only in the browser
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

  

