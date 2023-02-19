function Detail({ image, index, title, path, author, date, fileURL }) {
  return (
    <div className="flex flex-col w-[full] h-[full]  items-center border ">
      <img
        className="h-[50%] border-b rounded-t-[6px]"
        src={
          image
          /*filelist[i].fileimg*/
        }
      />

      <div className=" w-full  h-[10%] border-b text-[14px] break-all  ">
        제목: {title}
      </div>
      <div className=" w-full h-[10%] border-b text-[14px] break-all ">
        경로: {path}
      </div>

      <div className=" w-full h-[10%] border-b text-[14px] break-all  ">
        작성자: {author}
      </div>
      <div className=" w-full h-[10%] border-b text-[14px] break-all  ">
        작성날짜: {date}
      </div>
      <div className=" w-full  h-[10%] border-b text-[14px] break-all ">
        인덱스: {index}
      </div>
      <div className=" w-full  h-[10%]  text-[14px] break-all ">
        <a href={fileURL} download>
          <div className="flex justify-center text-[20px]">다운로드</div>
        </a>
      </div>
    </div>
  );
}

export default Detail;
