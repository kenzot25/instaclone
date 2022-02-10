import { Routes, Route } from "react-router-dom";
// import { fetchUser } from "./utils/helper";
import React, { Suspense, lazy } from "react";
import Spinner from "./components/UI/Spinner";
// import { userQuery } from "./utils/data";
// import { client } from "./client";
import NotFound from "./components/NotFound";
// import FetchData from "./utils/FetchData";

const Signup = lazy(() => import("./components/Auth/Signup"));
const Login = lazy(() => import("./components/Auth/Login"));
const Home = lazy(() => import("./container/Home"));
function App() {
  // const [isUser, setIsUser] = useState(null);
  // // const navigate = useNavigate();
  // const location = useLocation();
  // useEffect(() => {
  //   let isCancelled = false;
  //   fetchUser().then((data) => {
  //     // console.log(data)
  //     let userInfo = data;
  //     let id = userInfo?.id;
  //     const query = userQuery(id);
  //     client.fetch(query).then((data) => {
  //       if (!isCancelled && data.length > 0) {
  //         const userdata = { ...data[0] };
  //         setTimeout(() => {
  //           setIsUser(userdata);
  //         }, 400);
  //       }
  //     });
  //   });
  //   console.log("App effect");

  //   return () => {
  //     isCancelled = true;
  //   };
  // }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/fuckdata" element={<FetchData />} /> */}
        <Route path="/*" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
