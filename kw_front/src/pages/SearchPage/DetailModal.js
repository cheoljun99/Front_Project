import { useRef, useState } from "react";
import Detail from "./Detail";

function DetailModal({
  detailModal,
  setDetailModal,
  image,
  index,
  title,
  path,
  author,
  date,
  fileURL,
}) {
  const ModalBG = useRef();
  return (
    <div className="z-30 w-full fixed text-5xl ">
      {detailModal ? (
        <div
          class="background"
          ref={ModalBG}
          onClick={(e) => {
            if (ModalBG.current === e.target) {
              setDetailModal(false);
            }
          }}
        >
          <div className="z-25 w-1/3 h-[500px] bg-white fixed left-1/3 top-1/4 p-2.5 text-lg overflow-y-scroll">
            <Detail
              image={image}
              index={index}
              title={title}
              path={path}
              author={author}
              date={date}
              fileURL={fileURL}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DetailModal;
