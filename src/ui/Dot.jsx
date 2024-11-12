import styled from "styled-components";
import PropTypes from "prop-types";

// Styled Components for Circles and Center Dot
const LastCircle = styled.div`
  width: calc(4rem + 30px);
  height: calc(4rem + 30px);
  border: 1px solid rgba(223, 145, 134, 1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(223, 145, 134, 0.1);
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: ${(props) => props.$position}%;
  transition: left 0.3s ease;
`;

const OuterCircle = styled.div`
  width: calc(3rem + 20px);
  height: calc(3rem + 20px);
  border: 1px solid rgba(223, 145, 134, 1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(223, 145, 134, 0.1);
`;

const MiddleCircle = styled.div`
  width: calc(2rem + 10px);
  height: calc(2rem + 10px);
  border: 1px solid rgba(223, 145, 134, 1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(223, 145, 134, 0.1);
`;

const CenterDot = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  background-color: rgba(223, 145, 134, 1);
  border-radius: 50%;
  z-index: 99;
`;

const Dot = ({ $position }) => {
  return (
    <LastCircle $position={$position}>
      <OuterCircle>
        <MiddleCircle>
          <CenterDot />
        </MiddleCircle>
      </OuterCircle>
    </LastCircle>
  );
};

Dot.propTypes = {
  $position: PropTypes.number,
};

Dot.defaultProps = {
  $position: "relative",
};

export default Dot;
