// // 포스트 게시글 리덕스와 파이어베이스 연동하기

// import { createAction, handleActions } from "redux-actions";
// import { produce } from "immer";
// import { firestore, storage } from "../../shared/Firebase";
// import "moment";
// import moment from "moment";

// import { actionCreators as imageActions } from "./image";

// // 액션 타입
// const SET_POST = "SET_POST"; // 목록 가져와서 리덕스에 넣어주는 친구
// const ADD_POST = "ADD_POST"; // 목록 추가
// const EDIT_POST = "EDIT_POST"; // 목록 수정
// const DELETE_POST = "DELETE_POST"; // 목록 삭제
// const LOADING = "LOADING"; // 로딩 여부 판단
// const LIKE_TOGGLE = "LIKE_TOGGLE"; // 좋아요

// // 액션 생성자
// const setPost = createAction(SET_POST, (post_list, paging) => ({
//   post_list,
//   paging,
// }));
// const addPost = createAction(ADD_POST, (post) => ({ post }));
// const editPost = createAction(EDIT_POST, (post_id, post) => ({
//   post_id,
//   post,
// }));
// const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
// const loading = createAction(LOADING, (is_loading) => ({ is_loading }));
// const likeToggle = createAction(LIKE_TOGGLE, (post_id, is_like = null) => ({
//   post_id,
//   is_like,
// }));

// const initialState = {
//   list: [],
//   paging: { start: null, next: null, size: 3 },
//   is_loading: false,
// };

// const initialPost = {
//   // id: 0,
//   // user_info: {
//   //   user_name: "민경",
//   //   user_profile:
//   //     "http://image.dongascience.com/Photo/2020/10/8a5748b94df480da7df06adcdaa417c9.jpg",
//   // },
//   image_url:
//     "http://image.dongascience.com/Photo/2020/10/8a5748b94df480da7df06adcdaa417c9.jpg",
//   contents: "",
//   comment_cnt: 0,
//   like_cnt: 0,
//   layout_type: "a",
//   is_like: false,
//   insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
// };

// // 게시글 수정 파이어스토어에 넣는 함수. 처음에 post_id는 기본값, post는 빈 딕셔너리로 받아온다
// const editPostFB = (post_id = null, post = {}) => {
//   return function (dispatch, getState, { history }) {
//     if (!post_id) {
//       console.log("게시물 정보가 없어요!");
//       return;
//     }

//     const _image = getState().image.preview;

//     const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
//     const _post = getState().post.list[_post_idx];

//     console.log(_post);

//     const postDB = firestore.collection("post");

//     if (_image === _post.image_url) {
//       // preview 이미지랑 수정하려는 게시글정보의 image_url이 같은 경우는 새로 이미지업로드를 하지 않은 경우이다.
//       postDB
//         .doc(post_id)
//         .update(post)
//         .then((doc) => {
//           // 파이어베이스에 정보 업데이트하기
//           dispatch(editPost(post_id, { ...post }));
//           history.replace("/");
//         });
//       return;
//     } else {
//       const user_id = getState().user.user.uid;
//       const _upload = storage
//         .ref(`images/${user_id}_${new Date().getTime()}`)
//         .putString(_image, "data_url");

//       _upload.then((snapshot) => {
//         snapshot.ref
//           .getDownloadURL()
//           .then((url) => {
//             console.log(url);
//             return url;
//           })
//           .then((url) => {
//             postDB
//               .doc(post_id)
//               .update({ ...post, image_url: url })
//               .then((doc) => {
//                 // 파이어베이스에 정보 업데이트하기
//                 dispatch(editPost(post_id, { ...post, image_url: url }));
//                 history.replace("/");
//               });
//           })
//           .catch((err) => {
//             window.alert("이미지 업로드에 실패했습니다.😅");
//             console.log("이미지 업로드에 문제가 있습니다.", err);
//           });
//       });
//     }
//   };
// };

// // 게시글 작성 누르면 입력값 파이어스토어에 저장하는 함수.
// const addPostFB = (contents = "", layout_type = "") => {
//   return function (dispatch, getState, { history }) {
//     const postDB = firestore.collection("post");

//     const _user = getState().user.user; // getState는 스토어에 있는 정보를 가져온다.

//     const user_info = {
//       // 유저 정보는 리덕스에서 불러오기
//       user_name: _user.user_name,
//       user_id: _user.uid,
//       user_profile: _user.user_profile,
//     };
//     const _post = {
//       ...initialPost,
//       contents: contents,
//       insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
//       layout_type: layout_type, // 리덕스에 추가된 값을 파이어스토어에 넣는다
//     };
//     console.log(layout_type);

//     // 이미지 업로드 하기
//     const _image = getState().image.preview;
//     console.log(typeof _image);

//     //사용자 고유값과 현재 시간 밀리초로 파일명을 지정해주면 중복파일명이 생기지 않는다.
//     const _upload = storage
//       .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
//       .putString(_image, "data_url");

//     _upload.then((snapshot) => {
//       snapshot.ref
//         .getDownloadURL()
//         .then((url) => {
//           console.log(url);
//           return url;
//         })
//         .then((url) => {
//           //.then 해주면 return 값을 밖에서도 사용할 수 있음.
//           postDB
//             .add({ ...user_info, ..._post, image_url: url }) // 파이어스토어에 데이터 추가하기
//             .then((doc) => {
//               // 성공하면 리덕스에도 추가하기
//               let post = { user_info, ..._post, id: doc.id, image_url: url };
//               dispatch(addPost(post));
//               history.replace("/");

//               dispatch(imageActions.setPreview(null)); // 업로드가 성공하면 priview에 남아있는 이미지를 초기화 해준다.
//             })
//             .catch((err) => {
//               window.alert("포스트 작성에 실패했어요.😅");
//               console.log("post 작성에 실패했어요!", err);
//             });
//         })
//         .catch((err) => {
//           window.alert("이미지 업로드에 실패했습니다.😅");
//           console.log("이미지 업로드에 문제가 있습니다.", err);
//         });
//     });
//   };
// };

// // 무한스크롤을 위해,
// const getPostFB = (start = null, size = 3) => {
//   return function (dispatch, getState, { history }) {
//     let _paging = getState().post.paging;
//     if (_paging.start && !_paging.next) {
//       // start값이 있고, next값이 없으면 리스트에 더이상 정보가 없는거니까, 돌아가!
//       return;
//     }

//     dispatch(loading(true));
//     const postDB = firestore.collection("post");

//     let query = postDB.orderBy("insert_dt", "desc");

//     if (start) {
//       query = query.startAt(start);
//     }

//     query
//       .limit(size + 1)
//       .get()
//       .then((docs) => {
//         let post_list = [];
//         // 데이터를 가져올 때 무한스크롤 적용하기 위해 페이징 조건 넣어준다.
//         let paging = {
//           start: docs.docs[0],
//           next:
//             docs.docs.length === size + 1
//               ? docs.docs[docs.docs.length - 1]
//               : null, // 길이가 4개면 더 불러올 리스트가 있기 때문에 -1하여 이어서 불러온다.
//           size: size,
//         };
//         //파이어스토어에서 데이터 가져오는 방법. 공식문서에 써있음
//         docs.forEach((doc) => {
//           // 데이터들을 docs로 받아와서 forEach로 하나하나 돌아서 doc으로 받아옴.
//           let _post = doc.data(); // 파이어스토어에서 가지고 온 값들

//           let post = Object.keys(_post).reduce(
//             (acc, cur) => {
//               // Object를 사용하면 딕셔너리의 키 값들을 배열로 만들어준다.

//               if (cur.indexOf("user_") !== -1) {
//                 // 만약 cur(키값)에 user_가 포함이 된다면,
//                 return {
//                   ...acc,
//                   user_info: { ...acc.user_info, [cur]: _post[cur] },
//                 };
//               }
//               return { ...acc, [cur]: _post[cur] }; // 배열의 내장함수 reduce(누산한다.) 검색해보기
//             },
//             { id: doc.id, user_info: {} }
//           ); // [cur]:_post[cur] []안에 변수명 넣으면 키 값을 넣을 수 있다.

//           post_list.push(post);
//         });

//         post_list.pop(); // 데이터는 3개씩 불러오지만, next에서는 4개씩을 불러오니까 마지막꺼는 없앤다

//         dispatch(setPost(post_list, paging));
//       });
//   };
// };

// const toggleLikeFB = (post_id) => {
//   return function (dispatch, getState, { history }) {
//     if (!getState().user.user) {
//       // 유저 정보가 없으면 실행하지 않기
//       return;
//     }

//     const postDB = firestore.collection("post");
//     const likeDB = firestore.collection("like");

//     // post를 찾기 위해, 배열의 몇 번째에 있나 찾아옵니다.
//     const _idx = getState().post.list.findIndex((p) => p.id === post_id);

//     // post 정보를 가져오고,
//     const _post = getState().post.list[_idx];

//     // user id도 가져와요!
//     const user_id = getState().user.user.uid;

//     // 좋아요한 상태라면 해제하기
//     // 해제 순서
//     // 1. likeDB에서 해당 데이터를 지우고,
//     // 2. postDB에서 like_cnt를 -1해주기
//     if (_post.is_like) {
//       likeDB
//         .where("post_id", "==", _post.id)
//         .where("user_id", "==", user_id)
//         .get()
//         .then((docs) => {
//           // batch는 파이어스토어에 작업할 내용을 묶어서 한번에 하도록 도와줘요!
//           // 자세한 내용은 firestore docs를 참고해주세요 :)
//           // 저는 아래에서 like 콜렉션에 있을 좋아요 데이터를 지우고,
//           // post 콜렉션의 like_cnt를 하나 빼줬습니다!
//           let batch = firestore.batch();

//           docs.forEach((doc) => {
//             batch.delete(likeDB.doc(doc.id));
//           });

//           batch.update(postDB.doc(post_id), {
//             like_cnt:
//               _post.like_cnt - 1 < 1 ? _post.like_cnt : _post.like_cnt - 1,
//           });

//           batch.commit().then(() => {
//             // 이제 리덕스 데이터를 바꿔줘요!
//             dispatch(likeToggle(post_id, !_post.is_like));
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else {
//       // 좋아요 해제 상태라면 좋아요 하기
//       // 좋아요 순서
//       // 1. likeDB에서 해당 데이터를 넣고,
//       // 2. postDB에서 like_cnt를 +1해주기

//       likeDB.add({ post_id: post_id, user_id: user_id }).then((doc) => {
//         postDB
//           .doc(post_id)
//           .update({ like_cnt: _post.like_cnt + 1 })
//           .then((doc) => {
//             // 이제 리덕스 데이터를 바꿔줘요!
//             dispatch(likeToggle(post_id, !_post.is_like));
//           });
//       });
//     }
//   };
// };

// // 좋아요 리스트를 가져와서 리덕스에 넣어주는 함수
// const setIsLike = (_post_list, paging) => {
//   return function (dispatch, getState, { history }) {
//     // 로그인하지 않았을 땐 리턴!
//     if (!getState().user.is_login) {
//       return;
//     }

//     // 이제 좋아요 리스트를 가져올거예요 :)
//     // 1. post_list에 들어있는 게시물의 좋아요 리스트를 가져오고,
//     // 2. 지금 사용자가 좋아요를 했는 지 확인해서,
//     // 3. post의 is_like에 넣어줄거예요!

//     // likeDB를 잡아주고,
//     const likeDB = firestore.collection("like");

//     // post_list의 id 배열을 만들어요
//     const post_ids = _post_list.map((p) => p.id);

//     // query를 써줍니다!
//     // 저는 post_id를 기준으로 가져올거예요.
//     let like_query = likeDB.where("post_id", "in", post_ids);

//     like_query.get().then((like_docs) => {
//       // 이제 가져온 like_docs에서 로그인한 유저가 좋아요했는 지 확인해볼까요?
//       // 좋아요했는 지 확인한 후, post의 is_like를 true로 바꿔주면 끝입니다! :)

//       // 주의) 여기에서 데이터를 정제할건데, 여러 가지 방법으로 데이터를 정제할 수 있어요.
//       // 지금은 우리한테 익숙한 방법으로 한 번 해보고, 나중에 다른 방법으로도 해보세요 :)

//       // 파이어스토어에서 가져온 데이터를 {}로 만들어줄거예요.
//       let like_list = {};
//       like_docs.forEach((doc) => {
//         // like_list에 post_id를 키로 쓰는 {}!
//         // like_list[doc.data().post_id] :파이어스토어에서 가져온 데이터 하나 (=doc)의 data중 post_id를 키로 씁니다.
//         // [ // <- 대괄호 열었다! 밸류는 배열로 할거예요!
//         //   ...like_list[doc.data().post_id], // 해당 키에 밸류가 있다면, 그 밸류를 그대로 넣어주기
//         //   doc.data().user_id, // user_id를 배열 안에 넣어줘요!
//         // ]; <- 대괄호 닫기!

//         // like_list에 post_id로 된 키가 있다면?
//         // 있으면 배열에 기존 배열 + 새로운 user_id를 넣고,
//         // 없으면 새 배열에 user_id를 넣어줍니다! :)
//         if (like_list[doc.data().post_id]) {
//           like_list[doc.data().post_id] = [
//             ...like_list[doc.data().post_id],
//             doc.data().user_id,
//           ];
//         } else {
//           like_list[doc.data().post_id] = [doc.data().user_id];
//         }
//       });

//       // 아래 주석을 풀고 콘솔로 확인해보세요!
//       // console.log(like_list);

//       // user_id 가져오기!
//       const user_id = getState().user.user.uid;
//       let post_list = _post_list.map((p) => {
//         // 만약 p 게시글을 좋아요한 목록에 로그인한 사용자 id가 있다면?
//         if (like_list[p.id] && like_list[p.id].indexOf(user_id) !== -1) {
//           // is_like만 true로 바꿔서 return 해줘요!
//           return { ...p, is_like: true };
//         }

//         return p;
//       });

//       dispatch(setPost(post_list, paging));
//     });
//   };
// };

// // 파이어스토어에서 게시글 하나의 정보 가져와서 리덕스에 넣어주기
// const getOnePostFB = (id) => {
//   return function (dispatch, getState, { history }) {
//     const postDB = firestore.collection("post");
//     postDB
//       .doc(id)
//       .get()
//       .then((doc) => {
//         let _post = doc.data();
//         let post = Object.keys(_post).reduce(
//           (acc, cur) => {
//             // Object를 사용하면 딕셔너리의 키 값들을 배열로 만들어준다.

//             if (cur.indexOf("user_") !== -1) {
//               // 만약 cur(키값)에 user_가 포함이 된다면,
//               return {
//                 ...acc,
//                 user_info: { ...acc.user_info, [cur]: _post[cur] },
//               };
//             }
//             return { ...acc, [cur]: _post[cur] }; // 배열의 내장함수 reduce(누산한다.) 검색해보기
//           },
//           { id: doc.id, user_info: {} }
//         );
//         dispatch(setIsLike([post]));
//       });
//   };
// };

// // 게시글 삭제하기
// const deletePostFB = (id) => {
//   return function (dispatch, getState, { history }) {
//     // id가 없으면 return!
//     if (!id) {
//       window.alert("게시글을 삭제할 수 있는 권한이 없어요!");
//       return;
//     }

//     const postDB = firestore.collection("post");

//     // 게시글 id로 선택해서 삭제하기!
//     postDB
//       .doc(id)
//       .delete()
//       .then((res) => {
//         dispatch(deletePost(id));
//         history.replace("/");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
// };

// // 리듀서
// export default handleActions(
//   {
//     [SET_POST]: (state, action) =>
//       produce(state, (draft) => {
//         draft.list.push(...action.payload.post_list); // 추가

//         draft.list = draft.list.reduce((acc, cur) => {
//           if (acc.findIndex((a) => a.id === cur.id) === -1) {
//             //findIndex는 숫자값을 반환해준다. 중복이 있으면 위치들이 나올 것.
//             return [...acc, cur]; // -1이 나오면 중복된 값이 없다는 뜻, 배열 뒤에 추가해준다.(중복제거)
//           } else {
//             acc[acc.findIndex((a) => a.id === cur.id)] = cur; // 최근값 덮어주고
//             return acc; // 중복인 경우(숫자반환) 추가 안하고 누적된 배열 반환.
//           }
//         }, []);

//         if (action.payload.paging) {
//           //paging이 있을 때만 실행
//           draft.paging = action.payload.paging;
//         }
//         draft.is_loading = false; // 로딩 끝
//       }),

//     [ADD_POST]: (state, action) =>
//       produce(state, (draft) => {
//         draft.list.unshift(action.payload.post); // unshift : 배열의 맨 앞에 추가
//       }),
//     [EDIT_POST]: (state, action) =>
//       produce(state, (draft) => {
//         let idx = draft.list.findIndex((p) => p.id === action.payload.post_id); // 리스트의 몇번째 것을 수정할거야? findIndex 내장함수는 list '배열' 안에서 맞는 조건 값의 위치를 알려줌.
//         draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
//       }),
//     [DELETE_POST]: (state, action) =>
//       produce(state, (draft) => {
//         let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

//         if (idx !== -1) {
//           // 배열에서 idx 위치의 요소 1개를 지웁니다.
//           draft.list.splice(idx, 1);
//         }
//       }),
//     [LOADING]: (state, action) =>
//       produce(state, (draft) => {
//         draft.is_loading = action.payload.is_loading;
//       }),
//     [LIKE_TOGGLE]: (state, action) =>
//       produce(state, (draft) => {
//         // 배열에서 몇 번째에 있는 지 찾은 다음, is_like를 action에서 가져온 값으로 바꾸기!
//         let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

//         draft.list[idx].is_like = action.payload.is_like;
//       }),
//   },
//   initialState
// );

// const actionCreators = {
//   setPost,
//   addPost,
//   editPost,
//   getPostFB,
//   addPostFB,
//   editPostFB,
//   getOnePostFB,
//   deletePostFB,
//   toggleLikeFB,
// };

// export { actionCreators };

import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/Firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";

// 좋아요 토글하기 액션
const LIKE_TOGGLE = "LIKE_TOGGLE";

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// 좋아요 토글 액션 생성자
const likeToggle = createAction(LIKE_TOGGLE, (post_id, is_like = null) => ({
  post_id,
  is_like,
}));

const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

// 포스트에 들어가야만 하는 기본 정보를 미리 하나 만들어요! (매번 적기는 귀찮으니까..!)
// layout_type : a, b, c
//  - a : 텍스트가 위, 이미지가 아래인 레이아웃
//  - b : 텍스트가 좌측, 이미지가 우측인 레이아웃
//  - c : 텍스트가 우측, 이미지가 좌측인 레이아웃
// image_url : 이미지 주소
// like_cnt : 좋아요 갯수
// insert_dt : 작성일시
// is_like : 좋아요 여부 (로그인한 유저 기준이겠죠!)
const initialPost = {
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "",
  like_cnt: 0,
  layout_type: "a",
  is_like: false,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

// 게시글 수정하기
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    // 프리뷰 이미지를 가져옵니다.
    const _image = getState().image.preview;

    // 수정하려는 게시글이 게시글 목록에서 몇 번째에 있나 확인합니다.
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    // 수정하려는 게시글 정보를 가져옵니다. (수정 전 정보겠죠!)
    const _post = getState().post.list[_post_idx];
    // 아래의 주석을 풀고 확인해보세요!
    // console.log(_post);

    // 파이어스토어에서 콜렉션 선택하기
    const postDB = firestore.collection("post");

    // 현재 프리뷰의 이미지와 게시글 정보에 있는 이미지가 같은 지 확인합니다.
    // 같다면 이미지 업로드는 할 필요 없겠죠!
    if (_image === _post.image_url) {
      // 게시글 정보를 수정해요!
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          //   프리뷰는 이제 null로 바꿔줍니다!
          dispatch(imageActions.setPreview(null));
          history.replace("/");
        });
      return;
    } else {
      // 유저 정보를 가져와요 (유저 id!)
      const user_id = getState().user.user.uid;
      // 이미지를 data_url 방식으로 업로드하도록 준비!
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      // 이미지를 업로드하고,
      _upload.then((snapshot) => {
        //   업로드한 뒤 링크를 가져옵니다. (업로드한 이미지의 경로를 가져와요.)
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            //   아래 주석을 풀고 경로를 확인해보세요 :)
            // console.log(url);

            return url;
          })
          .then((url) => {
            // 경로를 가지고 게시글 정보를 수정해줍니다.
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                //   리덕스에도 수정한 정보를 넣어줘요.
                dispatch(editPost(post_id, { ...post, image_url: url }));
                //   프리뷰는 이제 null로 바꿔줍니다!
                dispatch(imageActions.setPreview(null));
                // 수정이 끝났으니, / 경로로 돌아갑니다.
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

// 게시글 추가하기
const addPostFB = (contents = "", layout_type = "a") => {
  return function (dispatch, getState, { history }) {
    //  파이어스토어에서 콜렉션부터 잡아줍니다.
    const postDB = firestore.collection("post");

    // 게시글 작성자 (로그인한 유저겠죠!) 정보를 가져와요.
    const _user = getState().user.user;

    // 유저 정보를 꾸려주고,
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    // 게시글 정보도 꾸려줘요.
    const _post = {
      ...initialPost,
      contents: contents,
      layout_type: layout_type,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    // 이미지도 가져옵니다.
    const _image = getState().image.preview;

    // 만약 이미지가 없으면? 경고를 띄워주고 업로드하지 않아요!
    if (!_image) {
      window.alert("이미지가 필요해요!");
      return;
    }
    // 이미지 업로드 먼저! (이미지 업로드가 실패하면 게시글도 업로드 하지 않게!)
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          return url;
        })
        .then((url) => {
          // 이미지 업로드가 무사히 잘 끝났다면, 이제 게시글 정보를 파이어스토어에 넣어줍니다.
          // 주의! 파이어스토어에는 리덕스에서 관리하는 것과 조금 다르게 게시글 1개 정보를 관리할거예요.
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              //   프리뷰는 이제 null로 바꿔줍니다!
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

// 게시글 가져오기
const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    //   가장 먼저 페이징 정보를 가져와요.
    let _paging = getState().post.paging;

    // 시작점이 있고, 다음 게시글이 없다면? 더 가져올 게 없다는 뜻이니 return!
    if (_paging.start && !_paging.next) {
      return;
    }

    // 가져오기 중일 때는 loading을 true로 바꿔줍니다.
    // 연속해서 계속 불러오는 걸 방지하기 위함입니다.
    dispatch(loading(true));

    // 파이어스토어에서 post 콜렉션을 먼저 잡아주고,
    const postDB = firestore.collection("post");

    // 쿼리를 작성해요!
    // 작성일 기준으로 역순 정렬할거예요.
    // +) asc, desc를 왔다갔다 하면서 정렬을 바꿔보세요!
    let query = postDB.orderBy("insert_dt", "desc");

    // 만약 시작점이 있다면? (start는 매개변수로 가져오는 걸 잊으면 안됩니다! -> getPostFB를 부를 때는? paging의 next 값을 start로 넘겨주겠죠!)
    if (start) {
      // 쿼리에 몇번째 게시글부터 가져올 지, 시작점 정보를 추가해줍니다.
      query = query.startAt(start);
    }

    // 우리가 미리 지정한 사이즈(갯수)보다 1개 더 많이 가져올거예요.
    // 그래야 next에 무언가를 넣어서 다음에 또 불러올 게 있나 없나 판단할 수 있어요.
    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];

        // 페이징 정보를 만들어줘요.
        // start는 지금 가져온 데이터의 첫번째 걸로,
        // next는 가져온 데이터의 길이를 보고 지정 사이즈보다 +1개면 마지막 데이터를,
        // 지금 사이즈와 같거나 작으면 null을 넣어줘요.
        let paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        // 이제 파이어스토어에서 가져온 데이터를 리덕스에 넣기 좋게 만들어요!
        docs.forEach((doc) => {
          let _post = doc.data();

          // reduce로 데이터를 정제해요!
          // reduce 사용법이 익숙하지 않으시다면 reduce 사용법 검색해보기!
          //  게시글 하나는 딕셔너리 형태예요.
          // 이 딕셔너리 형태 데이터의 키만 가지고 배열을 만들어 reduce를 돌립니다.
          let post = Object.keys(_post).reduce(
            (acc, cur) => {
              // acc는 누적 값, cur은 현재 값이에요.
              // 현재 값(key 값 중 하나겠죠!)에 user_가 들어있다면?
              if (cur.indexOf("user_") !== -1) {
                //   user_info에 현재 키값과 현재 키를 사용해 가져온 밸류를 누적 딕셔너리에 추가해줍니다.
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }

              //   user_가 없다면? 누적 딕셔너리에 바로 넣어주기!
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );

          //   정제한 데이터를 post_list에 넣어줘요.
          post_list.push(post);
        });

        // 마지막 1개는 빼줘요! (다음 번 리스트에 있어야할 값이니까요!)
        if (paging.next) {
          post_list.pop();
        }

        // 아래는 주석처리! 좋아요 여부를 함께 넣어줄거예요.
        // // post_list를 확인해봅시다!
        // // console.log(post_list);

        // // 이제 게시글 목록을 리덕스에 넣어줍시다!
        // // dispatch(setPost(post_list, paging));

        // 로그인한 사용자가 있다면 is_like를 지정해줄거고, 없으면 그냥 리스트만 뿌려줄거예요 :)
        //  -> 처음엔 그냥 보기만 하다가, 나중에 로그인을 한다면?
        //  -> 목록을 새로 불러와줘야해요! (login하면 새로고침하도록 바꿔주면 좋겠네요! :))
        if (getState().user.user) {
          dispatch(setIsLike(post_list, paging));
        } else {
          dispatch(setPost(post_list, paging));
        }
      });
  };
};

// 좋아요를 토글해볼거예요!
// is_like는 받아도 되고, 받지 않아도 괜찮아요.
// 저는 받지 않고 해볼거지만, 받아서 해도 굳굳
// 다만 받아서 하신다면 아래처럼 꼭 기본 값을 미리 지정해주기!!
// const toggleLikeFB = (post_id, is_like = false) => {
const toggleLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    // 유저 정보가 없으면 실행하지 않기!
    if (!getState().user.user) {
      return;
    }

    const postDB = firestore.collection("post");
    const likeDB = firestore.collection("like");

    // post를 찾기 위해, 배열의 몇 번째에 있나 찾아옵니다.
    const _idx = getState().post.list.findIndex((p) => p.id === post_id);

    // post 정보를 가져오고,
    const _post = getState().post.list[_idx];

    // user id도 가져와요!
    const user_id = getState().user.user.uid;

    // 좋아요한 상태라면 해제하기
    // 해제 순서
    // 1. likeDB에서 해당 데이터를 지우고,
    // 2. postDB에서 like_cnt를 -1해주기
    if (_post.is_like) {
      likeDB
        .where("post_id", "==", _post.id)
        .where("user_id", "==", user_id)
        .get()
        .then((docs) => {
          // batch는 파이어스토어에 작업할 내용을 묶어서 한번에 하도록 도와줘요!
          // 자세한 내용은 firestore docs를 참고해주세요 :)
          // 저는 아래에서 like 콜렉션에 있을 좋아요 데이터를 지우고,
          // post 콜렉션의 like_cnt를 하나 빼줬습니다!
          let batch = firestore.batch();

          docs.forEach((doc) => {
            batch.delete(likeDB.doc(doc.id));
          });

          batch.update(postDB.doc(post_id), {
            like_cnt:
              _post.like_cnt - 1 < 1 ? _post.like_cnt : _post.like_cnt - 1,
          });

          batch.commit().then(() => {
            // 이제 리덕스 데이터를 바꿔줘요!
            dispatch(likeToggle(post_id, !_post.is_like));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // 좋아요 해제 상태라면 좋아요 하기
      // 좋아요 순서
      // 1. likeDB에서 해당 데이터를 넣고,
      // 2. postDB에서 like_cnt를 +1해주기

      likeDB.add({ post_id: post_id, user_id: user_id }).then((doc) => {
        postDB
          .doc(post_id)
          .update({ like_cnt: _post.like_cnt + 1 })
          .then((doc) => {
            // 이제 리덕스 데이터를 바꿔줘요!
            dispatch(likeToggle(post_id, !_post.is_like));
          });
      });
    }
  };
};

// 좋아요 리스트를 가져와서 리덕스에 넣어주는 함수
const setIsLike = (_post_list, paging) => {
  return function (dispatch, getState, { history }) {
    // 로그인하지 않았을 땐 리턴!
    if (!getState().user.is_login) {
      return;
    }

    // 이제 좋아요 리스트를 가져올거예요 :)
    // 1. post_list에 들어있는 게시물의 좋아요 리스트를 가져오고,
    // 2. 지금 사용자가 좋아요를 했는 지 확인해서,
    // 3. post의 is_like에 넣어줄거예요!

    // likeDB를 잡아주고,
    const likeDB = firestore.collection("like");

    // post_list의 id 배열을 만들어요
    const post_ids = _post_list.map((p) => p.id);

    // query를 써줍니다!
    // 저는 post_id를 기준으로 가져올거예요.
    let like_query = likeDB.where("post_id", "in", post_ids);

    like_query.get().then((like_docs) => {
      // 이제 가져온 like_docs에서 로그인한 유저가 좋아요했는 지 확인해볼까요?
      // 좋아요했는 지 확인한 후, post의 is_like를 true로 바꿔주면 끝입니다! :)

      // 주의) 여기에서 데이터를 정제할건데, 여러 가지 방법으로 데이터를 정제할 수 있어요.
      // 지금은 우리한테 익숙한 방법으로 한 번 해보고, 나중에 다른 방법으로도 해보세요 :)

      // 파이어스토어에서 가져온 데이터를 {}로 만들어줄거예요.
      let like_list = {};
      like_docs.forEach((doc) => {
        // like_list에 post_id를 키로 쓰는 {}!
        // like_list[doc.data().post_id] :파이어스토어에서 가져온 데이터 하나 (=doc)의 data중 post_id를 키로 씁니다.
        // [ // <- 대괄호 열었다! 밸류는 배열로 할거예요!
        //   ...like_list[doc.data().post_id], // 해당 키에 밸류가 있다면, 그 밸류를 그대로 넣어주기
        //   doc.data().user_id, // user_id를 배열 안에 넣어줘요!
        // ]; <- 대괄호 닫기!

        // like_list에 post_id로 된 키가 있다면?
        // 있으면 배열에 기존 배열 + 새로운 user_id를 넣고,
        // 없으면 새 배열에 user_id를 넣어줍니다! :)
        if (like_list[doc.data().post_id]) {
          like_list[doc.data().post_id] = [
            ...like_list[doc.data().post_id],
            doc.data().user_id,
          ];
        } else {
          like_list[doc.data().post_id] = [doc.data().user_id];
        }
      });

      // 아래 주석을 풀고 콘솔로 확인해보세요!
      // console.log(like_list);

      // user_id 가져오기!
      const user_id = getState().user.user.uid;
      let post_list = _post_list.map((p) => {
        // 만약 p 게시글을 좋아요한 목록에 로그인한 사용자 id가 있다면?
        if (like_list[p.id] && like_list[p.id].indexOf(user_id) !== -1) {
          // is_like만 true로 바꿔서 return 해줘요!
          return { ...p, is_like: true };
        }

        return p;
      });

      dispatch(setPost(post_list, paging));
    });
  };
};

// 게시글 하나만 가져오기
// 상세페이지 등에 바로 접근할 때를 대비해서 게시글 하나만 가져오는 함수도 만들어요.
const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        // 여기도 주석처리해줄거예요.
        // 그리고 좋아요 가져다 붙이는 부분을 적용해줄거예요!
        // // 하나를 가져오지만, 게시글 목록은 배열이잖아요! 배열 형태에 맞게 []로 싸줍니다.
        // // dispatch(setPost([post]));

        dispatch(setIsLike([post]));
      });
  };
};

// 게시글 삭제하기
const deletePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    // id가 없으면 return!
    if (!id) {
      window.alert("삭제할 수 없는 게시글이에요!");
      return;
    }

    const postDB = firestore.collection("post");

    // 게시글 id로 선택해서 삭제하기!
    postDB
      .doc(id)
      .delete()
      .then((res) => {
        dispatch(deletePost(id));
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// 리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        //   데이터를 기존 데이터에 추가해요.
        draft.list.push(...action.payload.post_list);

        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        // 페이징도 넣어줍니다.
        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }

        // 리듀서에 기록할 때는 이미 로딩이 끝났겠죠! 여기에서 false로 바꿔줘요.
        // 액션을 따로 호출해도 좋지만, 무조건 is_loading이 false 되는 지점에서는 굳이 액션을 두번 일으키기 보단
        // 이런 식으로 바로 바꿔주는 게 좋아요.
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        // 데이터를 배열 맨 앞에 넣어줍니다.
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        // 배열의 몇 번째에 있는 지 찾습니다.
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        // 해당 위치에 넣어줍니다.
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        if (idx !== -1) {
          // 배열에서 idx 위치의 요소 1개를 지웁니다.
          draft.list.splice(idx, 1);
        }
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        //   데이터를 가져오는 중인 지 여부를 작성합니다.
        draft.is_loading = action.payload.is_loading;
      }),

    [LIKE_TOGGLE]: (state, action) =>
      produce(state, (draft) => {
        // 배열에서 몇 번째에 있는 지 찾은 다음, is_like를 action에서 가져온 값으로 바꾸기!
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx].is_like = action.payload.is_like;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
  deletePostFB,
  toggleLikeFB,
};

export { actionCreators };
