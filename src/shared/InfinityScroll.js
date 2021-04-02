import React from "react";
import _ from "lodash";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;
  const _handleScroll = _.throttle(() => {
    if (loading) {
      // loading중이면 callNext 하지마라
      return;
    }

    const { innerHeight } = window; // 현재 보이는 브라우저 높이
    const { scrollHeight } = document.body; // 전체 브라우저 길이(=스크롤 할 수있는 길이)

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 200) {
      callNext();
    }
  }, 300);

  const handleScroll = React.useCallback(_handleScroll, [loading]); //메모이제이션

  React.useEffect(() => {
    if (loading) {
      return;
    }

    if (is_next) {
      window.addEventListener("scroll", handleScroll); // 이벤트 구독
    } else {
      window.removeEventListener("scroll", handleScroll); // 이벤트 구독해제
    }

    return () => window.removeEventListener("scroll", handleScroll); // 이벤트 해제(return)
  }, [is_next, loading]);

  return (
    <React.Fragment>
      {props.children}
      {is_next && <Spinner />}
    </React.Fragment>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};

export default InfinityScroll;
