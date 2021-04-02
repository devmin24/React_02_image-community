// 쿠키 가져오기
const getCookie = (name) => {
  let value = "; " + document.cookie;

  let parts = value.split(`; ${name}=`); // 키=값; name키=name값; 키3=값3... 이런 식으로 들어오면 '; name키' 이부분을 자르면 [키=값, namr값; 키3=값3;...] 이렇게 남는다.

  if (parts.length === 2) {
    // 쿠키가 없을 수도 있으니까 있을 때만 (즉, 2개가 실제로 들어왔을 때만)
    return parts.pop().split(";").shift(); // pop 맨 뒤 요소 반환 = [name값; 키3=값3;] shift 맨 앞 요소 반환= [name값]
  }
};

// 쿠키 만들기 (키, 값, 만료일)
const setCookie = (name, value, exp = 5) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

// 쿠키 삭제하기
const deleteCookie = (name) => {
  let date = new Date("2020-01-01").toUTCString();
  console.log(date);

  document.cookie = name + "=; expires=" + date;
};

export { getCookie, setCookie, deleteCookie };
