import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./common/Navigation";
import SearchPage from "./pages/SearchPage/SearchPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import DefaultPage from "./pages/Defualtpage/DefualtPage";
import MyPage from "./pages/MyPage/MyPage";
import Modal from "./common/Modal";
import PrivateRoute from "./PrivateRoute";
import AdminPrivateRoute from "./common/AdminPrivateRoute";

function Router() {
  const [testMode, setTestMode] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);

  const [auth, setAuth] = useState(0);
  const [token, setToken] = useState("");

  const [logInModal, setLogInModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [myEmployNumber, setMyEmployNumber] = useState("");
  const [myUserName, setMyUserName] = useState("");
  const [myPhoneNumber, setMyPhoneNumber] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myBirthday, setMyBirthday] = useState("");

  return (
    <div class="flex flex-col font-[GmarketSansMedium]">
      <BrowserRouter>
        <Modal
          setTestMode={setTestMode}
          token={token}
          setToken={setToken}
          setAuth={setAuth}
          logInModal={logInModal}
          setLogInModal={setLogInModal}
          passwordModal={passwordModal}
          setPasswordModal={setPasswordModal}
          myEmployNumber={myEmployNumber}
          setMyEmployNumber={setMyEmployNumber}
          setPageIndex={setPageIndex}
          setMyUserName={setMyUserName}
        />
        <div className="h-[80px] w-full fixed z-20">
          <Navigation
            setLogInModal={setLogInModal}
            auth={auth}
            setAuth={setAuth}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            setPasswordModal={setPasswordModal}
          />
        </div>
        <div className=" h-full w-full flex justify-center overflow-y-auto">
          <div className="h-full w-full bg-white">
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <DefaultPage
                    setLogInModal={setLogInModal}
                    setAuth={setAuth}
                    setMyBirthday={setMyBirthday}
                    setMyEmail={setMyEmail}
                    setMyEmployNumber={setMyEmployNumber}
                    setMyPhoneNumber={setMyPhoneNumber}
                    setPageIndex={setPageIndex}
                    setPasswordModal={setPasswordModal}
                    setTestMode={setTestMode}
                    setToken={setToken}
                  />
                }
              />
              <Route
                exact
                path="/front_project"
                element={
                  <DefaultPage
                    setLogInModal={setLogInModal}
                    setAuth={setAuth}
                    setMyBirthday={setMyBirthday}
                    setMyEmail={setMyEmail}
                    setMyEmployNumber={setMyEmployNumber}
                    setMyPhoneNumber={setMyPhoneNumber}
                    setPageIndex={setPageIndex}
                    setPasswordModal={setPasswordModal}
                    setTestMode={setTestMode}
                    setToken={setToken}
                  />
                }
              />
              <Route
                path="/upload"
                element={
                  <AdminPrivateRoute
                    authenticated={auth}
                    component={<UploadPage myUserName={myUserName} />}
                  />
                }
              />
              <Route
                path="/search"
                element={
                  <PrivateRoute
                    authenticated={auth}
                    component={<SearchPage />}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute
                    authenticated={auth}
                    component={
                      <MyPage
                        testMode={testMode}
                        setTestMode={setTestMode}
                        token={token}
                        setToken={setToken}
                        auth={auth}
                        setAuth={setAuth}
                        myEmployNumber={myEmployNumber}
                        myUserName={myUserName}
                        myPhoneNumber={myPhoneNumber}
                        myEmail={myEmail}
                        myBirthday={myBirthday}
                        setMyPhoneNumber={setMyPhoneNumber}
                        setMyEmail={setMyEmail}
                        setMyBirthday={setMyBirthday}
                      />
                    }
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default Router;
