import styled from "styled-components";

const ErrorContent = styled.div`
  text-align: center;
  margin-top: 5rem;
  color: rgba(148, 158, 160, 1);
  font-family: "Ubuntu";
  font-weight: 300;
  font-size: 30px;
`;

function ErrorPage() {
  return (
    <ErrorContent>
      AN Error occurred!<br></br>
      Could not find this page!
    </ErrorContent>
  );
}

export default ErrorPage;
