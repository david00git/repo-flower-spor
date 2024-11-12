import { useEffect, useState } from "react";
import {
  NavLink as RouterNavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled, { keyframes } from "styled-components";
import ModalAuth from "./ModalAuth";
import ModalUserInfo from "../ui/ModalUserInfo";
import ModalSettings from "./ModalSettings";
import { getAuthToken } from "../utils/auth";
import { getUserInfo } from "../services/auth";
// import { IoMdSettings } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../public/logo/old.png";

import userPhoto from "../../public/profile-holder.png";

// Styled components
const breakpoints = {
  tablet: "798px",
  desktop: "1024px",
};

// Animation for the menu slide-in
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

// Styled components
const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);
  padding: 2rem 2.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  color: rgba(148, 158, 160, 1);
  align-items: center;

  ul {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;

    @media (max-width: ${breakpoints.tablet}) {
      display: block;
      text-align: center;
    }
  }
  li {
    margin: 0 2rem;

    @media (max-width: ${breakpoints.tablet}) {
      margin: 3.5rem 0;
      text-align: center;
      width: 100%;
      font-size: 2rem;
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.9);
    flex-direction: column;
    padding: 2rem;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 10;
    display: block;

    // Apply animation based on isOpen prop
    animation: ${({ $isOpen }) => ($isOpen ? slideIn : slideOut)} 0.3s forwards;
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateX(0)" : "translateX(100%)"};
  }
`;

const NavLink = styled(RouterNavLink)`
  color: rgba(148, 158, 160, 1);
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: rgba(100, 110, 112, 1);
  }

  &.active {
    color: #3f3f3f;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.3rem;
  }
`;

const NavLinkLogin = styled.button`
  border: none;
  background: none;
  color: rgba(223, 145, 134, 1);
  cursor: pointer;
  font-size: 1.4rem;

  &:hover {
    color: rgba(223, 90, 80, 1);
  }

  &:active {
    color: rgba(148, 58, 60, 1);
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.3rem;
  }

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const HamburgerMenu = styled.div`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
    align-items: center;
    font-size: 2.5rem;
    color: rgba(223, 145, 134, 1);
    cursor: pointer;
  }
`;

const NewAccount = styled.button`
  padding: 1.2rem 2.2rem;
  border-radius: 24px;
  border: none;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(270deg, #ecbcb3 0%, #eaa79e 100%);
  cursor: pointer;
  font-size: 1.4rem;

  &:hover {
    background: linear-gradient(270deg, #eaa79e 0%, #ecbcb3 100%);
  }

  &:active {
    background: linear-gradient(270deg, #d59789 0%, #db8b85 100%);
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
    padding: 1rem 1.8rem;
  }

  @media (max-width: 600px) {
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
    margin: 0 auto;
  }
`;

const ImgHeaderUser = styled.img`
  width: 4rem;
  height: 4rem;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    width: 6rem;
    height: 6rem;
  }

  @media (max-width: 600px) {
    width: 7rem;
    height: 7rem;
  }
`;

const Logo = styled.img`
  cursor: pointer;
  width: 18rem;

  @media (max-width: ${breakpoints.tablet}) {
    width: 14rem;
  }

  @media (max-width: 600px) {
    width: 12rem;
  }
`;

const Fa = styled(FaTimes)`
  display: none;
`;

const Overlay = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
`;

function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUserInfoOpen, setIsModalUserInfoOpen] = useState(false);
  const [isModalSettingsOpen, setIsModalSettingsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = getAuthToken();

  // Show modal based on query params
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "login" || action === "signup") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUser(userInfo);
          localStorage.setItem("first_name", userInfo.first_name);
          localStorage.setItem("last_name", userInfo.last_name);
          localStorage.setItem("user_id", userInfo.id);
        }
      }
    }
    fetchUser();
  }, [token]);

  const handleLoginClick = () => {
    setSearchParams({ action: "login" });
  };

  const handleSignupClick = () => {
    setSearchParams({ action: "signup" });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleConfirm = (formData) => {
    console.log("Form submitted:", formData);
    handleModalClose();
  };

  const openUserInfo = () => {
    setIsModalUserInfoOpen(true);
  };

  const closeUserInfo = () => {
    setIsModalUserInfoOpen(false);
  };

  // const openSettings = () => {
  //   setIsModalSettingsOpen(true);
  // };

  const closeSettings = () => {
    setIsModalSettingsOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <StyledHeader>
        <NavLink to="/">
          <Logo src={logo} alt="Logo" />
        </NavLink>

        <HamburgerMenu onClick={toggleMenu}>
          {menuOpen ? <Fa /> : <FaBars />}
        </HamburgerMenu>

        <StyledNav $isOpen={menuOpen} onClick={closeMenu}>
          <ul style={{ alignItems: "center" }}>
            {!token && (
              <>
                <li>
                  <NavLink to="/flowers">Flowers</NavLink>
                </li>
                <li>
                  <NavLink to="/latest-sightings">Latest Sightings</NavLink>
                </li>
                <li>
                  <NavLink to="/favorites">Favorites</NavLink>
                </li>
                <li>
                  <NavLinkLogin onClick={handleLoginClick}>Login</NavLinkLogin>
                </li>
                <NewAccount onClick={handleSignupClick}>New Account</NewAccount>
              </>
            )}

            {token && user && (
              <>
                <li>
                  <NavLink to="/flowers">Flowers</NavLink>
                </li>
                <li>
                  <NavLink to="/latest-sightings">Latest Sightings</NavLink>
                </li>
                <li>
                  <NavLink to="/favorites">Favorites</NavLink>
                </li>
                <li>
                  <span>
                    {user.first_name} {user.last_name}!
                  </span>
                </li>
                <ImgHeaderUser src={userPhoto} onClick={openUserInfo} />

                {/* <SettingsIcon onClick={openSettings} /> */}
              </>
            )}
          </ul>
        </StyledNav>
        <Overlay $isOpen={menuOpen} onClick={closeMenu} />
      </StyledHeader>

      {isModalOpen && (
        <ModalAuth onConfirm={handleConfirm} onCancel={handleModalClose} />
      )}

      {isModalUserInfoOpen && (
        <ModalUserInfo
          isOpen={isModalUserInfoOpen}
          onCancel={closeUserInfo}
          onConfirm={handleConfirm}
        />
      )}

      {/* Settings modal */}
      {isModalSettingsOpen && (
        <ModalSettings $isOpen={isModalSettingsOpen} onClose={closeSettings} />
      )}
    </>
  );
}

export default Header;
