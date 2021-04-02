import React from "react";
import { Grid, Text, Button } from "../elements";
import { getCookie, deleteCookie } from "../shared/Cookie";

import { useSelector, useDispatch } from "react-redux"; //useSelector 스토어에 있는 값을 가져와 쓸 수 있게 해주는 친구
import { actionCreators as userActions } from "../redux/modules/user";

import { history } from "../redux/configureStore";
import { apiKey } from "../shared/Firebase";

const Header = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login); //리덕스 체크

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`; // 파이어베이스 apikey 체크
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  console.log(is_session);

  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid is_flex padding="16px">
          <Grid>
            <Text margin="0px" size="24px" bold>
              밍스타그램😋
            </Text>
          </Grid>

          <Grid is_flex>
            <Button text="내정보"></Button>
            <Button
              _onClick={() => {
                history.push("/noti");
              }}
              text="알림"
            ></Button>
            <Button
              text="로그아웃"
              _onClick={() => {
                dispatch(userActions.logoutFB());
              }}
            ></Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid is_flex padding="16px">
        <Grid>
          <Text margin="0px" size="24px" bold>
            밍스타그램😋
          </Text>
        </Grid>

        <Grid is_flex>
          <Button
            text="로그인"
            _onClick={() => {
              history.push("/login");
            }}
          ></Button>
          <Button
            text="회원가입"
            _onClick={() => {
              history.push("/signup");
            }}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
