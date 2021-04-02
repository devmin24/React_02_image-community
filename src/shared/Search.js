import React from "react";
import _ from "lodash";

const Search = () => {
  const [text, setText] = React.useState("");

  const onChange = (e) => {
    setText(e.target.value);
    debounce(e);
  };

  const debounce = _.debounce((e) => {
    console.log("debounce ::: ", e.target.value);
  }, 1000);

  const throttle = _.throttle((e) => {
    console.log("throttle ::: ", e.target.value);
  }, 1000);

  const keyPress = React.useCallback(debounce, []); // 함수 메모이제이션(저장), 함수가 리랜더링이 되더라도 초기화 시키지마라.

  return (
    <div>
      <input type="text" onChange={onChange} value={text} />
    </div>
  );
};

export default Search;
