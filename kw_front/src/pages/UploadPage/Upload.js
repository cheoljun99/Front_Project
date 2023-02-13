import { useRef, useState } from "react";
import index from "./Upload.css";
import AWS from "aws-sdk"; // s3 파일업로드에 필요
import axios from "axios";

function Upload({ myUserName }) {
  const [fileList, setFileList] = useState([]); // 업로드 하는 파일을 의미
  const [dropClass, setDropClass] = useState("dropBox"); // 드래그앤드랍 이벤트에 따라 css 바뀜
  const [fileName, setFilename] = useState("이곳에 폴더를 드롭해주세요."); //드래그앤드랍 안에 텍스트
  const [showAlert, setShowAlert] = useState(0); // 0: 아직 업로드 안함, 1: 업로드 중, 2: 업로드 완료, 3: 업로드 실패
  let tmpFile = []; //드래드앤드랍 할 때 FileEntry 임시 배열
  let filePath = useRef([]); //파일경로 설정
  //s3연결
  const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
  const REGION = "ap-northeast-2";
  const S3_BUCKET = "dwg-upload";

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });
  //드래그앤드랍 폴더 재귀함수로 탐색
  const traverseFileTree = (item, path) => {
    path = path || "";
    if (item.isFile) {
      // Get file
      if (item.name.split(".").pop() === "dwg") {
        //File to FileEntry
        let FileObject;
        item.file(function (file) {
          filePath.current.push(item.fullPath);

          FileObject = file;
          tmpFile = [...tmpFile, FileObject];

          setFileList((prev) => (prev = tmpFile));
        });
      }
    } else if (item.isDirectory) {
      // Get folder contents
      var dirReader = item.createReader();
      dirReader.readEntries(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          traverseFileTree(entries[i], path + item.name + "/");
        }
      });
    }
  };
  // 폴더 선택
  const handleFileInput = (e) => {
    filePath.current = [];
    setShowAlert(0);
    const file = e.target.files;
    let result = [];
    for (let i = 0; i < file.length; i++) {
      if (file[i].name.split(".").pop() === "dwg") {
        result = [...result, file[i]];
      }
    }
    setFileList((prev) => (prev = result));
    setFilename(file[0].webkitRelativePath.split("/")[0]);
  };
  //파일 리스트 보여줌
  const listItems = () => {
    const result = [];
    if (fileList.length > 10) {
      for (let i = 0; i < 10; i++) {
        result.push(<li>{fileList[i].name}</li>);
      }
      result.push(<li>...</li>);
      return result;
    } else {
      return fileList.map((file) => <li>{file.name}</li>);
    }
  };
  //파일 업로드
  const uploadFile = (file, filePath) => {
    //if인 경우 폴더선택 else인 경우 드래그앤드랍
    let i = 0;
    if (filePath.current.length === 0) {
      for (; i < file.length; i++) {
        console.log(i);
        setShowAlert(1);
        const params = {
          ACL: "public-read",
          Body: file[i],
          Bucket: S3_BUCKET,
          Key: file[i].webkitRelativePath,
        };
        if (i === file.length - 1) {
          console.log("if");
          myBucket
            .putObject(params)

            .send((err) => {
              if (err) {
                console.log(err);
                setShowAlert(3);
              } else {
                axios
                  .post(
                    "http://localhost:8080/cad/data",
                    { foldername: fileName, author: myUserName },
                    {
                      headers: {
                        "Content-type": "application/json",
                        Accept: "application/json",
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    setShowAlert(2);
                  })
                  .catch((err) => {
                    console.log(err);
                    setShowAlert(3);
                  });
              }
            });
        } else {
          myBucket
            .putObject(params)

            .send((err) => {
              if (err) {
                console.log(err);
                setShowAlert(3);
              }
            });
        }
      }
    } else {
      for (; i < file.length; i++) {
        console.log(i);
        setShowAlert(1);
        const params = {
          ACL: "public-read",
          Body: file[i],
          Bucket: S3_BUCKET,
          Key: filePath.current[i].substring(1),
        };
        if (i === file.length - 1) {
          console.log("if");
          myBucket.putObject(params).send((err) => {
            if (err) {
              console.log(err);
              setShowAlert(3);
            } else {
              axios
                .post(
                  "http://localhost:8080/cad/data",
                  { foldername: fileName, author: myUserName },
                  {
                    headers: {
                      "Content-type": "application/json",
                      Accept: "application/json",
                    },
                  }
                )
                .then((res) => {
                  console.log(res);
                  setShowAlert(2);
                })
                .catch((err) => {
                  console.log(err);
                  setShowAlert(3);
                });
            }
          });
        } else {
          myBucket.putObject(params).send((err) => {
            if (err) {
              console.log(err);
              setShowAlert(3);
            }
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col justify-start w-full h-[70%] pt-5">
      <div className="flex flex-row justify-center w-full h-full">
        <div
          draggable="ture"
          className={dropClass}
          onDrop={(e) => {
            e.preventDefault();
            setShowAlert(0);
            filePath.current = [];
            var items = e.dataTransfer.items;
            for (var i = 0; i < items.length; i++) {
              var item = items[i].webkitGetAsEntry();
              if (item) {
                traverseFileTree(item);
              }
            }

            setFilename(e.dataTransfer.files[0].name);
            setDropClass("dropBox");
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDropClass("dropBoxactive");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDropClass("dropBox");
          }}
        >
          {fileName}
          <button
            className="flex ml-5 border"
            onClick={() => {
              setFileList([]);
              setFilename("이곳에 폴더를 드롭해주세요.");
              setShowAlert(0);
              filePath.current = [];
            }}
          >
            {fileName !== "이곳에 폴더를 드롭해주세요." ? "x" : null}
          </button>
        </div>
        <div className="felx w-[5%]"></div>
        <div className="flex w-[30%] border rounded-[6px]">
          <ul>{listItems()}</ul>
        </div>
      </div>
      <div className="flex flex-row justify-center w-full  pt-3">
        <div className="flex w-[30%] justify-center ">
          <div className="pr-3">아니면 폴더를 선택해주세요.</div>
          <input
            type="file"
            id="directory_upload"
            className="flex w-1/4 h-full justify-center"
            multiple
            webkitdirectory="true"
            onChange={handleFileInput}
            class="hidden"
          />
          <label
            for="directory_upload"
            className="flex w-[20%] justify-center border border-[#e0e0e0] bg-[#6c59ce] text-[#fff] items-center h-full rounded-[6px] cursor-pointer hover:bg-violet-700 active:bg-violet-800 "
          >
            폴더 선택
          </label>
        </div>

        <div className="felx w-[5%]"></div>
        <div className="flex flex-row items-center justify-center w-[30%] ">
          {showAlert === 0 ? (
            <div>업로드하려면 버튼을 눌러주세요.</div>
          ) : showAlert === 1 ? (
            <div>업로드 중</div>
          ) : showAlert === 2 ? (
            <div>업로드 완료</div>
          ) : (
            <div>업로드 실패</div>
          )}

          <button
            className="flex w-[20%] justify-center border border-[#e0e0e0] bg-[#6c59ce] text-[#fff] items-center h-full rounded-[6px] ml-3  hover:bg-violet-700 active:bg-violet-800  focus:outline-none focus:ring focus:ring-violet-500"
            onClick={() => {
              uploadFile(fileList, filePath);

              filePath.current = [];
            }}
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
