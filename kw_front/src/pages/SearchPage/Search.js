import { useState } from "react";
import axios from "axios";

function Search() {
  const [searchindex, setSearchindex] = useState("");

  const onchangesearchindex = (e) => {
    setSearchindex(e.target.value);
  };
  const handleSubmit = (e) => {
    //로컬서버에 검색 인덱스 전달하는 함수
    // form 안에 input을 전송할 때 페이지 리로드 되는 걸 막아줌
    console.log("searchindex", searchindex);
    e.preventDefault();

    axios
      .post(
        "http://로컬서버주소",
        {
          searchindex: searchindex,
        },
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setSearchindex(""); // 입력란에 있던 글씨 지워주기
      })
      .catch((err) => {
        console.log(err.response);
        setSearchindex(""); // 입력란에 있던 글씨 지워주기
      });
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-[10%] pt-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row justify-center w-[30%]"
      >
        <input
          type="text"
          name="value"
          className="w-full px-3 py-2 mr-4 text-gray-500 border rounded shadow"
          placeholder="검색어를 입력하세요."
          value={searchindex}
          onChange={onchangesearchindex}
        />
        <input
          value="입력"
          type="submit"
          className="p-2 text-[#6c59ce] border-2 border-[#6c59ce] rounded-[6px]"
        />
      </form>
    </div>
  );
}
export default Search;
