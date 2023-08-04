import { Button, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";

const Detail: React.FC<any> = () => {
  const { id: itemId } = useParams();

  const [data, setData] = useState<{
    email: string;
    contents: string;
    isDeleted: boolean;
    id: number;
  }>({ email: "", contents: "", isDeleted: false, id: 0 });

  const [comments, setComments] = useState<string>("");
  const [commentsData, setCommentsData] = useState([]);

  const fetchDetailData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/boards?isDeleted=${false}&id=${itemId}`
      );

      const CommentsResponse = await axios.get(
        `http://localhost:4000/comments?isDeleted=${false}&boardId=${itemId}`
      );

      setData(response.data[0]);
      setCommentsData(CommentsResponse.data);
    } catch (error) {
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  useEffect(() => {
    fetchDetailData();
  }, []);

  const handleDeleteButtonClick = async (itemId: number) => {
    try {
      await axios.patch(`http://localhost:4000/boards/${itemId}`, {
        isDeleted: true,
      });

      alert(
        "삭제가 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );
      window.location.reload();
    } catch (error) {
      alert("데이터를 삭제하는 데에 오류가 발생하였습니다.");
    }
  };

  const email = window.localStorage.getItem("email");

  const handleCommentsSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/comments", {
        boardId: itemId,
        email,
        comments,
        isDeleted: false,
      });

      alert(
        "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );

      window.location.reload();
    } catch (error) {
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  const handleCommentsChange = (e: any) => {
    setComments(e.target.value);
  };

  return (
    <MainWrapper>
      <ListWrapper>
        {data && (
          <div>
            <h1> {data.contents}</h1>
            <h2> {data.email}</h2>
            {data.email === localStorage.getItem("email") && (
              <Button onClick={() => handleDeleteButtonClick(data.id)}>
                삭제
              </Button>
            )}
          </div>
        )}
      </ListWrapper>
      <StyledForm onSubmit={handleCommentsSubmit}>
        <StyledInput
          placeholder="댓글"
          value={comments}
          onChange={handleCommentsChange}
        />
        <Button>입력</Button>
      </StyledForm>
      <ListWrapper>
        <CommentsCount>댓글 수 :({commentsData.length})</CommentsCount>
        {commentsData.map((comment: any, index) => {
          return (
            <ListItem key={comment.id}>
              {index + 1}.{comment.comments}
            </ListItem>
          );
        })}
      </ListWrapper>
    </MainWrapper>
  );
};

export default Detail;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 50%;
  padding: 10px;
`;

const ListItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  width: 50%;
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;
`;

const CommentsCount = styled.div`
  font-size: 20px;
`;
