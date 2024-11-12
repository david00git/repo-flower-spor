import { useEffect, useState, useContext } from "react";
import {
  fetchFlowers,
  favoriteFlowers,
  addFavoriteFlower,
  removeFavoriteFlower,
  getFavFlowerId,
} from "../services/flowers";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { toast } from "react-toastify";

const breakpoints = {
  tablet: "768px",
  mobile: "480px",
};

const FlowersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }
`;

const FlowerItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "Montserrat", sans-serif;
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

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 89.5%
    );
    z-index: 1;
  }

  p {
    position: relative;
    z-index: 2;
    margin: 0;
  }

  button {
    z-index: 2;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: 28rem;
    font-size: 1.6rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: 22rem;
    font-size: 1.4rem;
  }
`;

const FlowerName = styled.p`
  font-size: 1.4rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const FlowerLatinName = styled.p`
  font-size: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

const BtnSightings = styled.button`
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

  @media (max-width: ${breakpoints.tablet}) {
    width: 12rem;
    font-size: 1.1rem;
  }
`;

const StarIcon = styled(FaStar)`
  z-index: 8;
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

  @media (max-width: ${breakpoints.mobile}) {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

function Flowers() {
  const { isLoggedIn } = useContext(AuthContext);
  const [flowers, setFlowers] = useState([]);
  const [favoriteFlowerIds, setFavoriteFlowerIds] = useState([]);
  const [favoriteFlower, setFavoriteFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFlowers = async () => {
      setLoading(true);
      try {
        const flowerData = await fetchFlowers();
        setFlowers(flowerData.flowers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFlowers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    const loadFavorites = async () => {
      if (isLoggedIn && token) {
        try {
          const { favoriteEntries, originalFavorites } = await favoriteFlowers(
            token
          );
          setFavoriteFlowers(originalFavorites);
          setFavoriteFlowerIds(favoriteEntries.map((fav) => fav.flower_id));
        } catch (err) {
          console.error("Error fetching favorite flowers:", err);
        }
      }
    };

    loadFavorites();
  }, [isLoggedIn]);

  const handleFavoriteToggle = async (flower) => {
    const favoriteEntry = favoriteFlower.find((f) => f.flower.id === flower.id);

    try {
      if (favoriteEntry) {
        // Step 1: Remove the flower from favorites
        const fav_flower_id = await getFavFlowerId(flower.id); // Get the fav_flower_id
        console.log(fav_flower_id);
        if (!fav_flower_id) {
          console.error("Flower not found in favorites.");
          return;
        }

        await removeFavoriteFlower(flower.id, fav_flower_id); // Remove the flower using the id

        // Step 2: Update local state after removal
        setFavoriteFlowers((prevFavorites) =>
          prevFavorites.filter((f) => f.flower.id !== flower.id)
        );
        setFavoriteFlowerIds((prevIds) =>
          prevIds.filter((id) => id !== flower.id)
        );

        toast.info("Flower removed from favorites!");
      } else {
        // Step 3: Add the flower to favorites
        const userId = localStorage.getItem("user_id");
        const newFavorite = await addFavoriteFlower(flower.id, userId);

        // Step 4: Update local state after adding to favorites
        setFavoriteFlowers((prevFavorites) => [
          ...prevFavorites,
          { id: newFavorite.id, flower },
        ]);
        setFavoriteFlowerIds((prevIds) => [...prevIds, flower.id]);

        toast.success("Flower added to favorites!");
      }
    } catch (error) {
      console.error("Failed to toggle favorite flower:", error);
      toast.error("An error occurred while toggling favorite.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <FlowersGrid>
      {flowers.map((flower) => {
        const isFavorite = favoriteFlowerIds.includes(flower.id);

        return (
          <FlowerItem key={flower.id}>
            <FlowerCard
              background={`${flower.profile_picture}`}
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
                    isFavorite ? "Remove from favorites" : "Add to favorites"
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
  );
}

export default Flowers;
