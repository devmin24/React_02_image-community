import styled from "styled-components";
import React from "react";

const Image = (props) => {
  const { shape, src, size } = props;

  const styles = {
    src: src,
    size: size,
  };
  // shape이 circle 이면 ImageCircle styled를 적용해라. (동그라미)
  if (shape === "circle") {
    return <ImageCircle {...styles}></ImageCircle>;
  }

  // shape이 rectangle 이면 ImageREctangel styled를 적용해라. (네모)

  if (shape === "rectangle") {
    return (
      <AspectOutter>
        <AspectInner {...styles}></AspectInner>
      </AspectOutter>
    );
  }

  return (
    <React.Fragment>
      <ImageDefault {...styles}></ImageDefault>
    </React.Fragment>
  );
};
// 이미지 만들기
Image.defaultProps = {
  shape: "circle",
  src:
    "http://image.dongascience.com/Photo/2020/10/8a5748b94df480da7df06adcdaa417c9.jpg",
  size: 36,
};

// 기본(정사각형) 만들기 - 알림 이미지
const ImageDefault = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

// 동그라미 만들기
const ImageCircle = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);

  background-image: url("${(props) => props.src}");
  background-size: cover;
  margin: 4px;
`;

// 네모 만들기 (반응형으로 종횡비 맞춰주기 위해 바깥div 안쪽div 2개 만듬)
const AspectOutter = styled.div`
  width: 100%;
  min-width: 250px;
`;

const AspectInner = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

export default Image;
