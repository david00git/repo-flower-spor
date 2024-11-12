import { useEffect, useState, useRef, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { registerUser, loginUser } from "../services/auth";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";

import { AuthContext } from "../hooks/AuthContext";

const breakpoints = {
  mobile: "414px",
  tablet: "798px",
  desktop: "1024px",
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { display: none }
`;

const slideIn = keyframes`
  from { transform: translateY(-40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-40px); display: none  }
`;

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
  z-index: 99;
  font-family: "Ubuntu", sans-serif;
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.6s
    ease-in-out;
`;

const ModalContent = styled.div`
  position: absolute;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  width: 34rem;
  border: 2px solid #c9c9c9;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.6s
    ease-in-out;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 70%;
  }
`;

const Button = styled.button`
  background: linear-gradient(270deg, #ecbcb3 0%, #eaa79e 100%);
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem;
  transition: background 0.3s ease, color 0.3s ease;
  width: 100%;
  border: none;
  height: 50px;

  &:hover {
    background: #e59191;
    color: #ffffff;
  }
`;

const Input = styled.input`
  width: 90%;
  height: 50px;
  border: 1px solid rgba(223, 229, 234, 1);
  padding: 0 1.5rem;
  border-radius: 6px;
  background-color: rgba(245, 246, 247, 1);
  font-size: 1.4rem;
  color: rgba(51, 65, 68, 1);

  &:focus {
    outline: none;
    border-color: rgba(223, 145, 134, 1);
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const FirstAndLastName = styled.div`
  justify-content: center;
  width: 100%;
  gap: 1rem;
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

  @media (max-width: ${breakpoints.mobile}) {
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;

const StyledIoClose = styled(IoClose)`
  color: rgba(148, 158, 160, 1);
  width: 3rem;
  height: 3rem;
  position: relative;

  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.6s
    ease-in-out;
`;

function ModalAuth({ onCancel, onConfirm }) {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const action = searchParams.get("action");
  const mode = action === "signup" ? "create" : "login";
  const { setIsLoggedIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  const onSubmit = async (data) => {
    setError(null);
    setSuccessMessage("");

    try {
      if (mode === "create") {
        const registerResponse = await registerUser(data, setIsLoggedIn);
        setSuccessMessage("Registration successful!");
        reset();

        handleClose();

        setTimeout(() => {
          onConfirm(registerResponse);
        }, 300);
      } else {
        const loginResponse = await loginUser(data, setIsLoggedIn);
        setSuccessMessage("Login successful!");
        reset();

        handleClose();

        setTimeout(() => {
          onConfirm(loginResponse);
        }, 300);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError(
        error.response?.data?.error ||
          "An error occurred during authentication."
      );
    }
  };

  return (
    <ModalOverlay $isClosing={isClosing}>
      <ModalContent ref={ref} $isClosing={isClosing}>
        <h2
          style={{
            marginBottom: "3rem",
            fontSize: "2rem",
            color: "rgba(51, 65, 68, 1)",
          }}
        >
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h2>

        <CloseButton onClick={handleClose} $isClosing={isClosing}>
          <StyledIoClose />
        </CloseButton>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          {mode === "create" && (
            <FirstAndLastName>
              <InputWrapper>
                <Input
                  type="text"
                  {...register("first_name", { required: true })}
                  placeholder="First Name"
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type="text"
                  {...register("last_name", { required: true })}
                  placeholder="Last Name"
                />
              </InputWrapper>
            </FirstAndLastName>
          )}

          {mode === "create" && (
            <InputWrapper>
              <Input
                type="date"
                {...register("date_of_birth", {
                  required: "Date of Birth is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    return (
                      selectedDate <= today ||
                      "Birthday cannot be in the future"
                    );
                  },
                })}
                placeholder="Date of Birth"
              />
              {errors.date_of_birth && (
                <p style={{ color: "red" }}>{errors.date_of_birth.message}</p>
              )}
            </InputWrapper>
          )}

          <InputWrapper>
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email Address"
            />
          </InputWrapper>
          {errors.email && <p style={{ color: "red" }}>Email is required</p>}

          <InputWrapper>
            <Input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
            />
          </InputWrapper>
          {errors.password && (
            <p style={{ color: "red" }}>Password is required</p>
          )}

          <Button type="submit">
            {mode === "login" ? "Login to your Account" : "Create Account"}
          </Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

ModalAuth.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ModalAuth;
