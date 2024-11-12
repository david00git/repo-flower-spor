import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

const Main = styled.div`
  font-family: "Ubuntu", sans-serif;
`;

function AppLayout() {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
export default AppLayout;
