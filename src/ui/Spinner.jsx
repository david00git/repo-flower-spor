import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const Spinner = styled.div`
  margin: 4.8rem auto;
  margin-top: 15rem;
  width: 10.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
        farthest-side,
        rgba(234, 167, 158, 1) 94%,
        /* Light blue */ #0000
      )
      top/10px 10px no-repeat,
    conic-gradient(#0000 30%, rgba(236, 188, 179, 1) /* Dark Slate Blue */);

  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);

  animation: ${rotate} 1.5s infinite linear;
`;

export default Spinner;
