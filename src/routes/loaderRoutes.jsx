import {
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Home from "../pages/Home.jsx";
import UserRegisterOne from "../pages/userRegisterStepOne.jsx";
import UserRegisterTwo from "../pages/userRegisterStepTwo.jsx";
import UserRegisterThree from "../pages/userRegisterStepThree.jsx";
import LoginUser from "../pages/loginUser.jsx";
import RecoveryPasswordOne from "../pages/recoveryPasswordStepOne.jsx";
import RecoveryPasswordTwo from "../pages/recoveryPasswordStepTwo.jsx";
import RecoveryPasswordThree from "../pages/recoveryPasswordStepThree.jsx";
import MakeTask from "../pages/MakeTask.jsx";
import App from "../App.jsx";
import axios from "axios";

const COOKIE_ROUTES = import.meta.env.VITE_ROUTE_COOKIE_USER;

export async function requireAuthLoader({request}) {
  const url = new URL(request.url)
  const pathname = url.pathname

  try {
    const resp = await axios.get(`${COOKIE_ROUTES}`, {
      withCredentials: true,
    });
 
    return resp.data;
  } catch (err) {
     throw redirect(`/loginUser?from=${encodeURIComponent(pathname)}`);
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/registerUserStepOne", element: <UserRegisterOne /> },
      { path: "/registerUserStepTwo", element: <UserRegisterTwo /> },
      { path: "/registerUserStepThree/:token", element: <UserRegisterThree /> },
      { path: "/loginUser", element: <LoginUser /> },
      { path: "/forgotPassword", element: <RecoveryPasswordOne /> },
      { path: "/recoveryPasswordTwo", element: <RecoveryPasswordTwo /> },
      { path: "/resetPassword/:token", element: <RecoveryPasswordThree /> },
      {
        path: "/makeTask",
        element: <MakeTask />,
        loader: requireAuthLoader,
      },
    ],
  },
]);

export default router;
