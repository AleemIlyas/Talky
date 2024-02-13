import "./App.css";
import { Suspense, lazy } from "react";
import Register from "./Components/Register/Register";
const Layout = lazy(() => import("./Components/Layout/Layout"));
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./Util/ProtectedRoutes";
import { setIsAuthenticated, checkTokenExpire } from "./store/Slices/userSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(checkTokenExpire());
    if (token) dispatch(setIsAuthenticated(localStorage.getItem("user")));
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <Navigate to={"/register"} />
          ) : (
            <Navigate to={"/Chat"} />
          )
        }
      />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to={"/Chat"} /> : <Register />}
      />
      <Route
        path="/Chat"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading</div>}>
              <Layout />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/Chat/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading</div>}>
              <Layout />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
