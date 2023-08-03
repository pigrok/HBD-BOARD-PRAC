import React from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import shortid from "shortid";

const LoginForm: React.FC = () => {
  const naviagate = useNavigate();
  const handleLogin = async (values: any) => {
    // TODO: email과 password를 DB에서 찾아서 로그인 검증
    // TODO: 일치하는 유저가 없는 경우 "일치하는 유저를 찾을 수 없습니다." alert
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
    // TODO: 성공 시(1), "로그인에 성공하였습니다. 메인 페이지로 이동합니다." alert
    // TODO: 성공 시(2), localStorage에 token과 email을 저장
    // TODO: 성공 시(3), token은 shortId로 생성
    // TODO: 성공 시(4), "/" 라우터로 이동

    const { email, password, confirmPassword, agreed } = values;

    try {
      const response = await axios.get(
        // 이메일, 비밀번호 따로 검증 요청을 하려면, email, password를 따로 get요청
        // ?를 기준으로 URL로 파라미터로 보냄
        // get방식에서 &사인으로 구분
        // `http://localhost:4000/users?email=${email}&password=${password}`
        `http://localhost:4000/users?email=${values.email}&password=${values.password}`
      );

      // TODO: email과 password를 DB에서 찾아서 로그인 검증
      if (response.data.length <= 0) {
        // TODO: 일치하는 유저가 없는 경우 "일치하는 유저를 찾을 수 없습니다." alert
        alert("일치하는 유저를 찾을 수 없습니다.");
        return false;
      } else {
        // TODO: 성공 시(1), "로그인에 성공하였습니다. 메인 페이지로 이동합니다." alert
        alert("로그인에 성공하였습니다. 메인 페이지로 이동합니다.");

        // TODO: 성공 시(2), localStorage에 token과 email을 저장
        // TODO: 성공 시(3), token은 shortId로 생성
        // const loginUser = { token: shortid.generate(), email: email };
        // localStorage.setItem("loginUser", JSON.stringify(loginUser));
        localStorage.setItem("email", values.email);
        localStorage.setItem("token", shortid.generate());

        // TODO: 성공 시(4), "/" 라우터로 이동
        naviagate(`/`);
      }
    } catch (error) {
      // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  return (
    <FormWrapper onFinish={handleLogin}>
      <Form.Item
        label="이메일"
        name="email"
        rules={[{ required: true, message: "이메일을 입력해주세요." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="비밀번호"
        name="password"
        rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
      </Form.Item>
    </FormWrapper>
  );
};

export default LoginForm;

const FormWrapper = styled(Form)`
  width: 300px;
`;
