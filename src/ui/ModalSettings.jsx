import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import ProgressBar from "./ProgressBar";

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 7.6rem;
  height: 3.1rem;
  margin-left: 2rem;
  margin-top: 0.7rem;
`;
const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #ffffff;
  }

  &:focus + span {
    box-shadow: 0 0 1px #e2e2e2;
  }

  &:checked + span:before {
    transform: translateX(41px);
  }
`;
const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 15.5px;
  border: 1px solid rgba(148, 158, 160, 0.38);

  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 6px;
    bottom: 0;
    top: 4px;
    background-color: rgba(223, 145, 134, 1);
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
const ModalContent = styled.div`
  font-family: "Ubuntu";
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  padding: 2rem 5rem;
  max-width: 90%;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #222;
  }
`;
const Header = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
const FormGroup = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
`;
const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;
const Button = styled.button`
  padding: 1.8rem 3rem;
  border: none;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
  background-color: rgba(234, 167, 158, 1);
  color: white;
  transition: background-color 0.3s ease;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);
  margin-bottom: 5rem;
  margin-top: 5rem;

  &:hover {
    background-color: rgba(236, 188, 179, 1);
  }
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2rem;
  color: #333;
  font-weight: 500;
`;
const SwitchText = styled.div`
  margin-left: 13.9rem;
  display: flex;
  justify-content: space-between;
  width: 60px;
  font-size: 1.2rem;
  margin-top: -0.5rem;

  span:last-child {
    color: ${(props) => (props.$isChecked ? "rgba(51, 65, 68, 1)" : "#aaa")};
    font-weight: ${(props) => (props.$isChecked ? "bold" : "normal")};
  }

  span {
    color: ${(props) => (props.$isChecked ? "#aaa" : "rgba(51, 65, 68, 1)")};
    font-weight: ${(props) => (props.$isChecked ? "normal" : "bold")};
  }
`;
const StyledNotification = styled.h3`
  font-size: 1.4rem;
  font-weight: 300;
  color: rgba(51, 65, 68, 1);
  margin-bottom: 1.8rem;
`;
const SettingsIcon = styled(IoMdSettings)`
  width: 2rem;
  height: 2rem;
  color: #9e9d9d;
  margin-left: 3rem;
  margin-bottom: 0.7rem;
`;
const Description = styled.p`
  border-top: 1px solid rgba(232, 233, 237, 1);
  padding-top: 4.4rem;
  color: rgba(51, 65, 68, 1);
  font-size: 1.4rem;
`;

function ModalSettings({ isOpen, onClose }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const settings = {
      notificationsEnabled: true,
      favoriteRadius: value,
    };

    console.log("Settings Saved:", settings);

    onClose();
  };

  if (!isOpen) return null;
  return (
    <ModalOverlay>
      <ModalContent ref={ref}>
        <CloseButton onClick={onClose}>
          <IoMdClose />
        </CloseButton>
        <Header>
          <Title>Settings</Title>
          <SettingsIcon />
        </Header>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <div style={{ display: "flex" }}>
              <StyledNotification>Turn notifications</StyledNotification>
              <div>
                <SwitchContainer className="switch">
                  <SwitchInput
                    type="checkbox"
                    name="turnNotifications"
                    checked={notificationsEnabled}
                    onChange={handleToggle}
                  />
                  <Slider className="slider round"></Slider>
                </SwitchContainer>
              </div>
            </div>
            <SwitchText $isChecked={notificationsEnabled}>
              <span>On</span>
              <span>Off</span>
            </SwitchText>
          </FormGroup>

          <FormGroup style={{ alignItems: "center" }}>
            <Description>
              Select favorite flower sighting radius for notifications
            </Description>
            <ProgressBar value={value} setValue={setValue} />{" "}
          </FormGroup>

          <FormActions style={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit">Save Settings</Button>
          </FormActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

ModalSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalSettings;
