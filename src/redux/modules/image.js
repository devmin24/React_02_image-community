import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { storage } from "../../shared/Firebase";

// 액션

const UPLOADING = "UPLOADING"; // 업로드 중인지 알게 해주는 액션
const UPLOAD_IMAGE = "UPLOAD_IMAGE"; // 실제로 파일을 업로드하는 액션
const SET_PREVIEW = "SET_PREVIEW"; // 리덕스에 파일의 정보 넣어주는 액션

// 액션 생성자
const uploading = createAction(UPLOADING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url }));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

// initialState

const initialState = {
  image_url: "",
  uploading: false,
  preview: null,
};

const uploadImageFB = (image) => {
  // 파이어베이스에 업로드
  return function (dispatch, getState, { history }) {
    dispatch(uploading(true)); // 업로드 중

    const _upload = storage.ref(`images/${image.name}`).put(image);

    _upload.then((snapshot) => {
      console.log(snapshot);

      snapshot.ref.getDownloadURL().then((url) => {
        // 업로드 된 이미지의 다운로드 링크
        dispatch(uploadImage(url));
        console.log(url);
      });
    });
  };
};

// 리듀서
export default handleActions(
  {
    [UPLOAD_IMAGE]: (state, action) =>
      produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false; // 업로드 끝, 그리고 url 가져옴
      }),
    [UPLOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
      }),
    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview;
      }),
  },
  initialState
);

const actionCreators = {
  uploadImage,
  uploadImageFB,
  setPreview,
};

export { actionCreators };
