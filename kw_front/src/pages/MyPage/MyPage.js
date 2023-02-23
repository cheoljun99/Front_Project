import { NavLink } from "react-router-dom";
import MyInform from "./MyInform";

function MyPage({
  testMode,
  setTestMode,
  token,
  setToken,
  auth,
  setAuth,
  myEmployNumber,
  myUserName,
  myPhoneNumber,
  myEmail,
  myBirthday,
  setMyPhoneNumber,
  setMyEmail,
  setMyBirthday,
}) {
  return (
    <div className="flex flex-col w-full pt-5 ">
      <div className="flex flex-row w-full justify-end pr-5  pt-[80px] pb-5 bg-[#f1f6fe]">
        <NavLink
          className="border w-[100px] h-[50px]  text-[16px] text-center text-white flex items-center font-bold bg-violet-600 hover:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-500  justify-center rounded-lg"
          to="/"
          onClick={() => {
            setAuth(0);
            setToken("");
            setTestMode(false);
          }}
        >
          로그아웃
        </NavLink>
      </div>

      <MyInform
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
    </div>
  );
}

export default MyPage;
