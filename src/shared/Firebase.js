// 공식문서에도 작성법 나와있음.

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"; // 이미지 저장하는 클라우드 저장소 같은 개념
import "firebase/database";

const firebaseConfig = {
  // 파이어베이스 앱 추가에서 복붙
  apiKey: "AIzaSyCt3gXfLQ70FTwwb7KP-Fhza_2IyZPD1vY",
  authDomain: "image-community-f9b95.firebaseapp.com",
  projectId: "image-community-f9b95",
  storageBucket: "image-community-f9b95.appspot.com",
  messagingSenderId: "684271201993",
  appId: "1:684271201993:web:f9910a26d8997c7f2ca718",
  measurementId: "G-QTPXSLGFN7",
};

firebase.initializeApp(firebaseConfig); //초기화하기

const auth = firebase.auth(); //인증 만들기
const apiKey = firebaseConfig.apiKey;
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export { auth, apiKey, firestore, storage };
