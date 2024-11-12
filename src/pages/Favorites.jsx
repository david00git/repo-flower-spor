import { useEffect, useState } from "react";
import {
  addFavoriteFlower,
  removeFavoriteFlower,
  favoriteFlowersFavorite,
} from "../services/flowers";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

const breakpoints = {
  tablet: "798px",
  desktop: "1024px",
};

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;

  border: 2px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${breakpoints.desktop}) {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: ${breakpoints.tablet}) {
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
`;

const FlowerItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  animation: ${(props) =>
    props.$isFadingOut ? "fadeOut 0.5s forwards" : "none"};

  // Border adjustments for FlowerItem based on screen size
  border: 2px solid rgba(255, 255, 255, 0.1); // Default border

  @media (max-width: ${breakpoints.desktop}) {
    border: 2px solid rgba(255, 255, 255, 0.2); // For screens smaller than 1024px
  }

  @media (max-width: ${breakpoints.tablet}) {
    border: 2px solid rgba(255, 255, 255, 0.3); // For screens smaller than 798px
  }
`;

const BtnSightings = styled.button`
  justify-content: center;
  display: flex;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.5); // Default border
  width: 10rem;
  font-size: 1.2rem;
  padding: 9px 15px;
  border-radius: 20px;
  color: rgba(255, 255, 255, 1);
  margin: 2rem auto;
  background: ${(props) =>
    props.$favorite
      ? "linear-gradient(270deg, #ECBCB3 0%, #EAA79E 100%)"
      : "rgba(0, 0, 0, 0.5)"};
  transition: background 0.3s ease;

  @media (max-width: ${breakpoints.desktop}) {
    border: 2px solid rgba(255, 255, 255, 0.4); // For screens smaller than 1024px
  }

  @media (max-width: ${breakpoints.tablet}) {
    border: 2px solid rgba(255, 255, 255, 0.6); // For screens smaller than 798px
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 12rem;
  }
`;

const StarIcon = styled(FaStar)`
  z-index: 3;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: ${(props) =>
    props.$favorite ? "rgba(255, 255, 255, 1)" : "rgba(212, 216, 217, 1)"};
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.7rem;
  background: ${(props) =>
    props.$favorite
      ? "linear-gradient(270deg, #ECBCB3 0%, #EAA79E 100%)"
      : "rgba(255, 255, 255, 1)"};
  transition: background 0.3s ease, color 0.3s ease;

  @media (max-width: ${breakpoints.desktop}) {
    border: 2px solid rgba(255, 255, 255, 0.4);
  }

  @media (max-width: ${breakpoints.tablet}) {
    border: 2px solid rgba(255, 255, 255, 0.6);
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

  // Border adjustments for FlowerCard based on screen size
  border: 2px solid rgba(255, 255, 255, 0.1); // Default border

  @media (max-width: ${breakpoints.desktop}) {
    border: 2px solid rgba(255, 255, 255, 0.2); // For screens smaller than 1024px
  }

  @media (max-width: ${breakpoints.tablet}) {
    border: 2px solid rgba(255, 255, 255, 0.3); // For screens smaller than 798px
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const FlowerName = styled.p`
  font-size: 1.4rem;
`;

const FlowerLatinName = styled.p`
  font-size: 1rem;
`;

const ErrorMess = styled.h2`
  text-align: center;
  margin-top: 5rem;
  color: rgba(148, 158, 160, 1);
  font-family: "Ubuntu";
  font-weight: 300;
  font-size: 30px;
`;

const Favorites = () => {
  const [fadingOutId, setFadingOutId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await favoriteFlowersFavorite(token);
        const userFavorites = data.filter(
          (fav) => fav.user_id === parseInt(userId)
        );
        setFavorites(userFavorites);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const removeFavorite = async (flower_id, fav_flower_id) => {
    setFadingOutId(flower_id);
    setTimeout(async () => {
      await removeFavoriteFlower(flower_id, fav_flower_id);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((f) => f.flower.id !== flower_id)
      );
      setFadingOutId(null);
      toast.info("Removed from favorites!");
    }, 500);
  };

  const addFavorite = async (flower_id) => {
    await addFavoriteFlower(flower_id);
    setFavorites((prevFavorites) => [
      { flower: { id: flower_id, favorite: true } },
      ...prevFavorites,
    ]);
    toast.success("Added to favorites!");
  };

  const handleFavoriteToggle = async (flower_id, fav_flower_id) => {
    const isFavorite = favorites.some(
      (f) => f.flower.id === flower_id && f.flower.favorite
    );

    if (isFavorite) {
      await removeFavorite(flower_id, fav_flower_id);
    } else {
      await addFavorite(flower_id);
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <ErrorMess>
        You need to be logged in! <br></br>
        {error}
      </ErrorMess>
    );

  return (
    <div>
      {favorites.length > 0 ? (
        <FavoritesGrid>
          {favorites.map(({ id: fav_flower_id, flower }) => {
            const {
              id: flower_id,
              name,
              profile_picture,
              latin_name,
              sightings,
              favorite,
            } = flower;

            return (
              <FlowerItem
                key={flower_id}
                $isFadingOut={fadingOutId === flower_id}
              >
                <FlowerCard
                  background={profile_picture}
                  onClick={() => navigate(`/flowers/${flower_id}`)}
                >
                  <StarIcon
                    $favorite={favorite}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(flower_id, fav_flower_id);
                    }}
                  />
                  <FlowerName>{name}</FlowerName>
                  <FlowerLatinName>Latin Name: {latin_name}</FlowerLatinName>
                  <BtnSightings
                    $favorite={favorite}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/sightings/${flower_id}`);
                    }}
                  >
                    Sightings: {sightings}
                  </BtnSightings>
                </FlowerCard>
              </FlowerItem>
            );
          })}
        </FavoritesGrid>
      ) : (
        <ErrorMess>No favorite flowers found.</ErrorMess>
      )}
    </div>
  );
};

export default Favorites;
