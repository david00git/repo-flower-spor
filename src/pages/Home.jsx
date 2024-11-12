import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import SearchBar from "../ui/SearchBar";
import {
  addFavoriteFlower,
  removeFavoriteFlower,
  favoriteFlowers,
} from "../services/flowers";
import { toast } from "react-toastify";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../ui/Spinner";

// Styled Components
const breakpoints = {
  tablet: "798px",
  desktop: "1024px",
};

const FlowerItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "Montserrat", sans-serif;
`;

const FlowersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 1.5rem;
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

const FlowerCard = styled.div`
  position: relative;
  width: 100%;
  height: 35rem;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 2rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  background-image: ${(props) => `url(${props.background})`};
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: 28rem;
    font-size: 1.6rem;
  }

  @media (max-width: 600px) {
    height: 22rem;
    font-size: 1.2rem;
  }
`;

const FlowerName = styled.p`
  font-size: 1.4rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const FlowerLatinName = styled.p`
  font-size: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const BtnSightings = styled.button`
  z-index: 9;
  justify-content: center;
  display: flex;
  align-items: center;
  border: none;
  width: 10rem;
  font-size: 1.2rem;
  padding: 9px 15px;
  border-radius: 20px;
  color: rgba(255, 255, 255, 1);
  margin: 2rem auto;
  background: ${(props) =>
    props.$isFavorite
      ? "linear-gradient(270deg, #ECBCB3 0%, #EAA79E 100%)"
      : "rgba(0, 0, 0, 0.5)"};
  transition: background 0.3s ease;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    width: 12rem;
  }
`;

const StarIcon = styled(FaStar)`
  z-index: 4;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: ${(props) =>
    props.$isFavorite ? "rgba(255, 255, 255, 1)" : "rgba(212, 216, 217, 1)"};
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.7rem;
  background: ${(props) =>
    props.$isFavorite
      ? "linear-gradient(270deg, #ECBCB3 0%, #EAA79E 100%)"
      : "rgba(255, 255, 255, 1)"};

  @media (max-width: ${breakpoints.tablet}) {
    width: 1.8rem;
    height: 1.8rem;
  }

  @media (max-width: 600px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StyledHome = styled.div``;

const Hero = styled.div`
  grid-column: 1 / -1;
  margin-top: 2rem;
  width: 100%;
  height: 50rem;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: 35rem;
  }

  @media (max-width: 600px) {
    height: 28rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  font-weight: 600;
  height: 100%;
  font-family: "Montserrat", sans-serif;
  z-index: 1;
`;

const Tittle = styled.h1`
  font-size: 4rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const H2 = styled.h2`
  font-size: 1.7rem;
  font-family: "Playfair Display";
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
  }

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

function Home({ totalSightings }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedFlowers, setDisplayedFlowers] = useState([]);
  const [randomFlowers, setRandomFlowers] = useState([]);
  const [favoriteEntries, setFavoriteEntries] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const loadUserFavoritesAndFlowers = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        // Fetch user favorites if logged in
        if (isLoggedIn && token) {
          const { favoriteEntries } = await favoriteFlowers();
          setFavoriteEntries(favoriteEntries);
        }

        // Fetch random flowers
        const response = await fetch(
          "https://flowrspot-api.herokuapp.com/api/v1/flowers/random"
        );
        if (!response.ok) throw new Error("Error fetching random flowers");

        const data = await response.json();
        setRandomFlowers(data.flowers);
        setDisplayedFlowers(data.flowers);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadUserFavoritesAndFlowers();
  }, [isLoggedIn]);

  const handleSearchResults = (results) => {
    setDisplayedFlowers(results.length > 0 ? results : randomFlowers);
  };

  const handleFavoriteToggle = async (flower) => {
    const favoriteEntry = favoriteEntries.find(
      (entry) => entry.flower_id === flower.id
    );

    try {
      if (favoriteEntry) {
        console.log(favoriteEntry);
        // Remove from favorites
        setFavoriteEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.flower_id !== flower.id)
        );
        removeFavoriteFlower(flower.id, favoriteEntry.fav_flower_id);
        toast.info(`${flower.name} has been removed from your favorites.`);
      } else {
        // Add to favorites
        const newFavorite = await addFavoriteFlower(flower.id, userId);
        setFavoriteEntries([
          ...favoriteEntries,
          { flower_id: flower.id, fav_flower_id: newFavorite.fav_flower.id },
        ]);
        toast.success(`${flower.name} has been added to your favorites!`);
        favoriteFlowers();
      }
    } catch (error) {
      console.error("Failed to toggle favorite flower:", error);
      toast.error("Failed to update favorite status");
    }
  };

  return (
    <StyledHome>
      <Hero>
        <img src="/pl-hero.png" alt="Hero background" />
        <SearchContainer>
          <Tittle>Discover flowers around you</Tittle>
          <H2>Explore between more than {totalSightings} sightings</H2>
          <SearchBar onSearchResults={handleSearchResults} />
        </SearchContainer>
      </Hero>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <FlowersGrid>
          {displayedFlowers.map((flower) => {
            const isFavorite = favoriteEntries.some(
              (entry) => entry.flower_id === flower.id
            );

            return (
              <FlowerItem key={flower.id}>
                <FlowerCard
                  background={
                    flower.profile_picture
                      ? flower.profile_picture
                      : "default-image.jpg"
                  }
                  $isFavorite={isFavorite}
                  onClick={() => navigate(`/flowers/${flower.id}`)}
                >
                  {isLoggedIn && (
                    <StarIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(flower);
                      }}
                      $isFavorite={isFavorite}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    />
                  )}
                  <FlowerName>{flower.name}</FlowerName>
                  <FlowerLatinName>{flower.latin_name}</FlowerLatinName>
                  <BtnSightings
                    $isFavorite={isFavorite}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/sightings/${flower.id}`);
                    }}
                  >
                    {flower.sightings} sightings
                  </BtnSightings>
                </FlowerCard>
              </FlowerItem>
            );
          })}
        </FlowersGrid>
      )}
    </StyledHome>
  );
}

Home.propTypes = {
  totalSightings: PropTypes.number.isRequired,
};

export default Home;
