export const emailCheck = (email) => {
  // 정규식 (이메일 형식) ^는 첫글자만
  let _reg = /^[0-9a-zA-Z]([-_.0-9a-zA-z])*@[0-9a-zA-Z]([-_.0-9a-zA-Z])*.([a-zA-z])*/;

  return _reg.test(email); //정규식에 맞으면 true ,아니면 false 반환
};
