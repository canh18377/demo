import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Fragment } from "react";
import { publicRoutes, privateRoutes } from "./routes";
import DefaultLayout from "./components/Layout/DefaultLayout";
function App() {
  const ProtectedRoute = ({ Page }) => {
    const isLAuthenticated = () => {
      const Token = localStorage.getItem("jwtToken");
      return !!Token;
    };
    return isLAuthenticated() ? <Page /> : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {privateRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            const Page = route.component;
            return (
              <Route
                path={route.path}
                key={index}
                element={
                  <Layout>
                    <ProtectedRoute Page={Page} />
                  </Layout>
                }
              />
            );
          })}
          {publicRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
