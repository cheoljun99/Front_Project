import AWS from "aws-sdk";
import fileimg from "./예시이미지.jpg";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

function Output({ output, setOutput }) {
  const REGION = "ap-northeast-2";
  const S3_BUCKET = "dwg-upload";
  const http = "https://";
  const s3 = ".s3.";
  const amazonawscom = ".amazonaws.com/";
  const dwgtest = "test3/00_간지.dwg00_간지.dwg";
  const imgtest = "image/009_행선안내시스템 구성도.jpeg";

  const listitem = (filelist) => {
    const result = [];
    for (let i = 0; i < output.length; i++) {
      result.push(
        <a
          href={http + S3_BUCKET + s3 + REGION + amazonawscom + dwgtest}
          className=" flex flex-col  w-[22.5%] items-center h-[300px] ml-[2%] mt-[2%]   focus:outline-none focus:ring-8 focus:ring-[#f1f6fe] rounded-[6px] border"
          download
        >
          <img
            className="h-[60%] border-b rounded-t-[6px]"
            src={
              http + S3_BUCKET + s3 + REGION + amazonawscom + imgtest
              /*filelist[i].fileimg*/
            }
          />
          <div className=" w-full  h-[10%] border-b ">
            {filelist[i].filename}
          </div>
          <div className=" w-full h-[10%] border-b ">
            {filelist[i].filepath}
          </div>
          {filelist[i].fileindex.length < 70 ? (
            <div className=" w-full h-[20%]   text-[10px] break-all overflow-hidden">
              {filelist[i].fileindex}
            </div>
          ) : (
            <div className=" w-full h-[20%]   text-[10px] break-all overflow-hidden">
              {`${filelist[i].fileindex.slice(0, 70)}...`}
            </div>
          )}
        </a>
      );
    }
    return result;
  };
  return (
    <div className="flex flex-row justify-center items-center w-full h-[60%] mt-5">
      <div className="flex flex-col justify-evenly items-center w-[8%] h-full border rounded-[6px] ">
        <div className="text-[20px] ">정렬기준</div>
        <div className="flex flex-row  ">
          <div className="">제목</div>
          <button
            className="ml-3 hover:border-[#e4e1f1] hover:border rounded-[6px] focus:outline-none focus:ring-4 focus:ring-[#f1f6fe]"
            onClick={() => {
              let TmpOutput = [...output];
              TmpOutput.sort((a, b) =>
                a.filename.toLowerCase() < b.filename.toLowerCase() ? -1 : 1
              );
              console.log(TmpOutput);
              setOutput(TmpOutput);
            }}
          >
            <AiOutlineArrowUp />
          </button>
          <button
            className="ml-3 hover:border-[#e4e1f1] hover:border rounded-[6px] focus:outline-none focus:ring-4 focus:ring-[#f1f6fe]"
            onClick={() => {
              let TmpOutput = [...output];
              TmpOutput.sort((a, b) =>
                a.filename.toLowerCase() > b.filename.toLowerCase() ? -1 : 1
              );
              console.log(TmpOutput);
              setOutput(TmpOutput);
            }}
          >
            <AiOutlineArrowDown />
          </button>
        </div>
        <div className="flex flex-row ">
          <div className="">경로</div>
          <button
            className="ml-3 hover:border-[#e4e1f1] hover:border rounded-[6px] focus:outline-none focus:ring-4 focus:ring-[#f1f6fe]"
            onClick={() => {
              let TmpOutput = [...output];
              TmpOutput.sort((a, b) =>
                a.filepath.toLowerCase() < b.filepath.toLowerCase() ? -1 : 1
              );
              console.log(TmpOutput);
              setOutput(TmpOutput);
            }}
          >
            <AiOutlineArrowUp className="" />
          </button>
          <button
            className="ml-3 hover:border-[#e4e1f1] hover:border rounded-[6px] focus:outline-none focus:ring-4 focus:ring-[#f1f6fe]"
            onClick={() => {
              let TmpOutput = [...output];
              TmpOutput.sort((a, b) =>
                a.filepath.toLowerCase() > b.filepath.toLowerCase() ? -1 : 1
              );
              console.log(TmpOutput);
              setOutput(TmpOutput);
            }}
          >
            <AiOutlineArrowDown />
          </button>
        </div>
      </div>

      <div className="w-[2%]"></div>
      {output.length === 0 ? (
        <div className="flex flex-row justify-center items-center w-[60%] h-full border rounded-[6px] ">
          검색결과가 없습니다.
        </div>
      ) : (
        <div className="flex flex-row flex-wrap   items-center w-[60%] h-full border rounded-[6px] overflow-y-scroll ">
          {listitem(output)}
        </div>
      )}
    </div>
  );
}

export default Output;
