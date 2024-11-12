import styled from "styled-components";
import { useRef } from "react";
import PropTypes from "prop-types";
import Dot from "./Dot";

const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 25rem;
  padding: 2rem;
  cursor: pointer;
  margin-top: 3rem;
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 47%;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(51, 65, 68, 1);
  z-index: 0;
  height: 2px;
`;

const Label = styled.div`
  position: absolute;
  bottom: -2rem;
  font-size: 1.2rem;
  ${(props) => props.position};
`;

const RangeInput = styled.input`
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  appearance: none;
  background: transparent;
  z-index: 1;

  &::-webkit-slider-thumb {
    appearance: none;
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
  }
`;

const StaticDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: rgba(51, 65, 68, 1);
  border-radius: 50%;
  position: absolute;
  ${($props) => $props.$position};
  z-index: 2;
`;

function ProgressBar({ value, setValue }) {
  const progressBarRef = useRef(null);

  const handleRangeChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleClick = (e) => {
    const progressBar = progressBarRef.current;
    const progressBarRect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - progressBarRect.left;
    const percentage = (clickX / progressBarRect.width) * 100;

    if (percentage <= 25) {
      setValue(1);
    } else if (percentage > 25 && percentage <= 75) {
      setValue(5);
    } else {
      setValue(10);
    }
  };

  const dotPosition = value === 1 ? 0 : value === 5 ? 50 : 100;

  return (
    <ProgressBarContainer ref={progressBarRef} onClick={handleClick}>
      <ProgressLine />

      <Dot $position={dotPosition} />

      <StaticDot $position="left: -1.7%;" />
      <StaticDot $position="left: 48.4%;" />
      <StaticDot $position="left: 98.4%;" />

      <Label position="left: -4%;">1km</Label>
      <Label position="left: 47%;">5km</Label>
      <Label position="left: 95%;">10km</Label>

      <RangeInput
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={handleRangeChange}
      />
    </ProgressBarContainer>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default ProgressBar;
