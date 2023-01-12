import { useEffect, useRef, useState } from "react";
import index from "./Upload.css";
import AWS from "aws-sdk"; // s3 파일업로드에 필요

function Upload() {
  const [fileList, setFileList] = useState([]); // 업로드 하는 파일을 의미
  const [dropClass, setDropClass] = useState("dropBox"); // 드래그앤드랍 이벤트에 따라 css 바뀜
  const [fileName, setFilename] = useState("이곳에 폴더를 드롭해주세요."); //드래그앤드랍 안에 텍스트
  const [showAlert, setShowAlert] = useState(0); // 0: 아직 업로드 안함, 1: 업로드 중, 2: 업로드 완료
  let tmpFile = []; //드래드앤드랍 할 때 FileEntry 임시 배열
  let filePath = useRef([]); //파일경로 설정

  //s3연결
  const ACCESS_KEY = "AKIAQRW62EWBLT7WM7I3";
  const SECRET_ACCESS_KEY = "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";
  const REGION = "ap-northeast-2";
  const S3_BUCKET = "engineering-data-search-service";

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
    if (filePath.current.length === 0) {
      for (let i = 0; i < file.length; i++) {
        const params = {
          ACL: "public-read",
          Body: file[i],
          Bucket: S3_BUCKET,
          Key: file[i].webkitRelativePath + file[i].name,
        };
        myBucket
          .putObject(params)
          .on("httpUploadProgress", (evt) => {
            setShowAlert(1);
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
          })
          .send((err) => {
            if (err) console.log(err);
          });
      }
    } else {
      for (let i = 0; i < file.length; i++) {
        const params = {
          ACL: "public-read",
          Body: file[i],
          Bucket: S3_BUCKET,
          Key: filePath.current[i].substring(1) + file[i].name,
        };
        myBucket
          .putObject(params)
          .on("httpUploadProgress", (evt) => {
            setShowAlert(1);
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
          })
          .send((err) => {
            if (err) console.log(err);
          });
      }
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col justify-center items-center w-full">
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
          className="flex w-1/6 justify-center border border-slate-400 bg-slate-200 items-center h-full mt-3"
        >
          폴더 선택
        </label>

        <div className="flex flex-row items-center justify-center w-full pb-3">
          {showAlert === 0 ? (
            <div color="primary" className="pt-3 pr-3">
              업로드하려면 버튼을 눌러주세요.
            </div>
          ) : showAlert === 1 ? (
            <div color="primary" className="pt-3 pr-3">
              업로드 중
            </div>
          ) : (
            <div color="primary" className="pt-3 pr-3">
              업로드 완료
            </div>
          )}

          <button
            className="flex w-1/6 justify-center border border-slate-400 bg-slate-200 items-center h-full mt-3"
            onClick={() => {
              uploadFile(fileList, filePath);
              filePath.current = [];
              setShowAlert(2);
            }}
          >
            업로드
          </button>
        </div>
        <div id="list">
          <ul>{listItems()}</ul>
        </div>
      </div>
    </div>
  );
}

export default Upload;
