import React from "react";

import { Button } from "../elements";
import { storage } from "./Firebase";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  const is_uploading = useSelector((state) => state.image.uploading); // 업로드 중이면 또 업로드가 안되게 막기 true or false , 밑에 input에 disabled 속성에 적용하면 됨. true 일 경우 막힘
  const fileInput = React.useRef();

  const selectFile = (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.files[0]);

    console.log(fileInput.current.files[0]);

    const reader = new FileReader(); // FileReader를 이용하면 객체의 내용물을 읽어올 수 있다.
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file); // 파일의 URL 읽어오기 내장함수.

    reader.onloadend = () => {
      // 읽기가 끝나면 값이 실행이 된다.
      console.log(reader.result); // 값은 result로 받아온다.
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    // 이미지를 파이어스토어 storage에 업로드해주는 함수
    let image = fileInput.current.files[0];
    dispatch(imageActions.uploadImageFB(image));
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading}
      ></input>
      {/* <Button _onClick={uploadFB}>업로드하기</Button> */}
    </React.Fragment>
  );
};

export default Upload;
