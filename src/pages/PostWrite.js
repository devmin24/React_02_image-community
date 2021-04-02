import React, { useState } from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login); //로그인 여부 체크하고 로그인 시에만 작성하기 페이지 보여주기 위해서
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  const [layout_type, setLayoutType] = useState("");

  const a_type = () => {
    setLayoutType("a");
  };
  const b_type = () => {
    setLayoutType("b");
  };
  const c_type = () => {
    setLayoutType("c");
  };

  // id 고유값 가지고 수정페이지 나타내게 하기
  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;

  const { history } = props;

  // 리덕스에서 게시글 정보 가져와서 수정하기 (파이어스토어에서 가져와도 되지만 여기에선 리덕스로)
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null; // 수정모드니? 그럼 post_list에서 id를 찾아서 post_id와 같으면 리덕스에 있는 정보를 알려줘

  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  React.useEffect(() => {
    if (is_edit && !_post) {
      // !=not,없다 / is_edit이 true이고 _post가 없으면
      window.alert("포스트 정보가 없어요!😭");
      history.goBack();

      return;
    }

    if (is_edit) {
      // 수정모드일 경우에 가져온 리덕스 정보에서 image_url 불러와줘
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    dispatch(postActions.addPostFB(contents, layout_type));
  };

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
  };

  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          앗! 잠깐!🤚
        </Text>
        <Text size="16px">로그인 후에만 글을 쓸 수 있어요!✍️</Text>
        <Button
          _onClick={() => {
            history.replace("/");
          }}
        >
          로그인 하러 가기
        </Button>
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        <Grid is_flex>
          <Button _onClick={a_type}>A타입</Button>
          <Button _onClick={b_type} margin="10px 10px">
            B타입
          </Button>
          <Button _onClick={c_type}>C타입</Button>
        </Grid>
        <Upload></Upload>
      </Grid>

      <Grid padding="16px">
        <Text margin="0px" size="24px" bold>
          미리보기
        </Text>
      </Grid>

      {layout_type === "a" && (
        <React.Fragment>
          <Image
            shape="rectangle"
            src={
              preview ? preview : "https://www.ahaidea.com/Images/no_image.jpg"
            }
          />

          <Grid padding="16px">
            <Input
              value={contents}
              _onChange={changeContents}
              label="게시글 내용"
              placeholder="게시글 작성"
              multiLine
            ></Input>
          </Grid>
        </React.Fragment>
      )}

      {layout_type === "b" && (
        <React.Fragment>
          <Grid is_flex>
            <Grid width="50%" padding="16px">
              <Input
                value={contents}
                _onChange={changeContents}
                label="게시글 내용"
                placeholder="게시글 작성"
                multiLine
              ></Input>
            </Grid>
            <Image
              shape="rectangle"
              src={
                preview
                  ? preview
                  : "https://www.ahaidea.com/Images/no_image.jpg"
              }
            />
          </Grid>
        </React.Fragment>
      )}

      {layout_type === "c" && (
        <React.Fragment>
          <Grid is_flex>
            <Image
              shape="rectangle"
              src={
                preview
                  ? preview
                  : "https://www.ahaidea.com/Images/no_image.jpg"
              }
            />
            <Grid width="50%" padding="16px">
              <Input
                value={contents}
                _onChange={changeContents}
                label="게시글 내용"
                placeholder="게시글 작성"
                multiLine
              ></Input>
            </Grid>
          </Grid>
        </React.Fragment>
      )}

      <Grid padding="16px">
        {is_edit ? (
          <Button text="게시글 수정" _onClick={editPost}></Button>
        ) : (
          <Button text="게시글 작성" _onClick={addPost}></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
