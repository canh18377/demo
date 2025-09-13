import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Fragment } from "react";
import { publicRoutes, privateRoutes } from "./routes";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { Home } from "./components/pages/publicPages";
function App() {
  const ProtectedRoute = ({ Page }) => {
    const isLAuthenticated = () => {
      const Token = localStorage.getItem("jwtToken");
      return !!Token;
    };
    return isLAuthenticated() ? <Page /> : <Navigate to="/" />;
  };

  return (
    <Home />
  );
}
export default App;
