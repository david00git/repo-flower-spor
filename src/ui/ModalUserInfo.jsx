import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { useState, useRef, useEffect, useContext, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import userPhoto from "../../public/profile-holder.png";

const breakpoints = {
  tablet: "798px",
  desktop: "1024px",
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
`;

// Styled Components with Original Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.4s
    forwards;
`;

const ModalContainer = styled.div`
  position: absolute;
  font-family: "Ubuntu";
  background: white;
  padding: 2rem;
  height: fit-content;
  width: 90%;
  max-width: 40rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.4s
    forwards;

  @media (max-width: ${breakpoints.tablet}) {
    width: 60%;
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  margin-top: 1rem;
  font-size: 1.8rem;
  text-align: center;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

const UserInfo = styled.div`
  margin-bottom: 3.5rem;
  margin-left: -3rem;
  text-align: center;
`;

const Description = styled.div`
  margin: 0.5rem 0;
  font-size: 1.2rem;
  text-align: left;
  color: rgba(148, 158, 160, 1);

  h2 {
    color: rgba(51, 65, 68, 1);
    margin-top: 0.5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const LogoutButton = styled.button`
  margin-top: 2rem;
  padding: 1.2rem 4rem;
  font-size: 1rem;
  color: white;
  background: linear-gradient(270deg, #ecbcb3 0%, #eaa79e 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(270deg, #eaa79e 0%, #ecbcb3 100%);
    transform: translateY(-2px);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1rem 3rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 2rem;
    height: 2rem;
    color: rgba(148, 158, 160, 1);
  }

  &:hover svg {
    color: rgba(100, 110, 112, 1);
  }
`;

const Content = styled.div`
  padding: 2rem;

  p {
    text-align: left;
    margin-top: 2rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const Placeholder = styled.p`
  font-size: 1.2rem;
  color: rgba(148, 158, 160, 1);
`;

const User = styled.h2`
  font-size: 1.8rem;
  font-weight: 300;
`;

const H4 = styled.h4`
  font-size: 25px;
  font-family: "Ubuntu";
  color: rgba(51, 65, 68, 1);
  text-align: left;
  font-weight: 300;
  display: flex;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

function ModalUser({ isOpen, onCancel }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onCancel, 400);
  }, [onCancel]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
        onCancel();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onCancel]);

  const handleLogout = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      localStorage.clear();
      toast.info("You have logged out successfully!");
      navigate("/");
      onCancel();
    }, 400);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <ModalOverlay $isClosing={isClosing}>
      <ModalContainer ref={ref} $isClosing={isClosing}>
        <CloseButton onClick={handleClose}>
          <IoClose />
        </CloseButton>
        <Content>
          <ModalTitle>
            <img src={userPhoto} alt="Profile" />
            <div>
              <H4>
                {localStorage.getItem("first_name")}{" "}
                {localStorage.getItem("last_name")}
              </H4>
            </div>
          </ModalTitle>
          <UserInfo>
            <Description>
              <Placeholder>First Name:</Placeholder>
              <User>{localStorage.getItem("first_name")}</User>
            </Description>
            <Description>
              <Placeholder>Last Name:</Placeholder>
              <User>{localStorage.getItem("last_name")}</User>
            </Description>
          </UserInfo>
        </Content>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ModalContainer>
    </ModalOverlay>
  );
}

ModalUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ModalUser;
