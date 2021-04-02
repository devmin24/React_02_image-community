import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./Firebase";

const Permit = (props) => {
  const is_login = useSelector((state) => state.user.user);
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`; // 파이어베이스 apikey 체크
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  if (is_session && is_login) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }
  return null;
};

// {props.children} = 자식 컴포넌트를 보여줘라.
export default Permit;
