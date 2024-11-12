import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FlowerDetailsList from "../ui/FlowerDetailsList";
import { AuthContext } from "../hooks/AuthContext";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import {
  removeFavoriteFlower,
  addFavoriteFlower,
  favoriteFlowers,
} from "../services/flowers";

const FlowerDetails = styled.div`
  background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.0001) 0%,
      rgba(0, 0, 0, 0.4) 100%
    ),
    url(${(props) => props.$backgroundImage});
  height: 35rem;
  position: absolute;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  @media (min-resolution: 192dpi) {
    background-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.0001) 0%,
        rgba(0, 0, 0, 0.4) 100%
      ),
      url(${(props) => props.highResBackgroundImage});
  }

  @media (max-width: 500px) {
    height: 20rem;
  }

  img {
    object-fit: cover;
  }
`;

const Foto = styled.img`
  position: relative;
  top: 5rem;
  left: 2rem;
  width: 28rem;
  height: 35rem;
  border-radius: 3px;
  @media (max-width: 650px) {
    width: 20rem;
    height: 27rem;
  }

  @media (max-width: 500px) {
    width: 15rem;
    height: 20rem;
  }
  @media (max-width: 500px) {
    /* margin-top: 7rem; */
  }
`;

const CardLayout = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 1);
`;

const FotoInfo = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-left: 5rem;

  @media (max-width: 650px) {
    margin-top: 6rem;
  }
`;

const Name = styled.h1`
  font-family: "Ubuntu";
  font-size: 3.5rem;
  font-weight: 300;
  margin: 0;
  @media (max-width: 500px) {
    font-size: 3rem;
  }
`;

const NameLatin = styled.h2`
  font-size: 1.4rem;
  margin: 1rem 0 5rem 0;
`;

const FlowerContent = styled.div`
  height: 63rem;
  @media (max-width: 500px) {
    height: 52rem;
  }
`;

const Text = styled.div`
  display: flex;
  /* gap: 18.5rem; */
`;

const StyledFitures = styled.p`
  margin-top: 10rem;
  margin-left: 2rem;
  color: rgba(148, 158, 160, 1);
  width: 14.5rem;
  font-size: 1.6rem;

  @media (max-width: 650px) {
    margin-top: 9rem;
    font-size: 1.4rem;
  }
`;

const StyledDescription = styled.p`
  color: rgba(148, 158, 160, 1);
  padding: 5rem 12rem 5rem 5rem;
  font-size: 1.8rem;
  text-align: justify;
  overflow: hidden;
  max-height: 1rem;

  @media (max-width: 650px) {
    margin-top: 4rem;
    font-size: 1.4rem;
  }
`;

const ErrorMessage = styled.h2`
  color: red;
  text-align: center;
  margin-top: 2rem;
`;

const BtnAddNewSighting = styled.button`
  position: relative;
  padding: 1.8rem 3rem;
  background: linear-gradient(270deg, #ecbcb3 0%, #eaa79e 100%);
  border: 0;
  color: white;
  border-radius: 2px;
  height: 5rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  bottom: 5rem;
  right: 12rem;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background: linear-gradient(270deg, #eaa79e 0%, #ecbcb3 100%);
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 1000px) {
    right: 5rem;
  }

  @media (max-width: 850px) {
    bottom: -25rem;
    left: 37%;
    width: 28rem;
  }
  @media (max-width: 650px) {
    left: 2rem;
    width: 20rem;
    bottom: -20rem;
  }
  @media (max-width: 500px) {
    bottom: -30rem;
  }
`;

const FavoriteNumberSightings = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
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
  margin: 2rem;
  background: ${(props) =>
    props.$isFavorite
      ? "linear-gradient(270deg, #ECBCB3 0%, #EAA79E 100%)"
      : "rgba(0, 0, 0, 0.5)"};
  transition: background 0.3s ease, transform 0.1s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.$isFavorite
        ? "linear-gradient(270deg, #EAA79E 0%, #ECBCB3 100%)"
        : "rgba(0, 0, 0, 0.8)"};
    transform: scale(1.05);
  }

  @media (max-width: 500px) {
    margin: auto 0;
    margin-bottom: 2rem;
  }
`;

const StarIcon = styled(FaStar)`
  z-index: 4;
  position: relative;
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
  transition: background 0.3s ease, transform 0.1s ease-in-out;

  &:hover {
    background: ${(props) =>
      props.$isFavorite
        ? "linear-gradient(270deg, #EAA79E 0%, #ECBCB3 100%)"
        : "rgba(212, 216, 217, 0.8)"};
    transform: scale(1.1);
  }

  @media (max-width: 500px) {
    margin-bottom: 2rem;
  }
`;

function FlowerDetail() {
  const { id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [favoriteEntries, setFavoriteEntries] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchFlowerDetail = async () => {
      try {
        const response = await fetch(
          `https://flowrspot-api.herokuapp.com/api/v1/flowers/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch flower details.");
        }
        const data = await response.json();
        setFlower(data.flower);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFlowerDetail();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    const loadFavorites = async () => {
      if (isLoggedIn && token) {
        try {
          const { favoriteEntries } = await favoriteFlowers(token);
          setFavoriteEntries(favoriteEntries);
        } catch (err) {
          console.error("Error fetching favorite flowers:", err);
        }
      }
    };

    loadFavorites();
  }, [isLoggedIn]);

  const handleAddSightingClick = () => {
    if (!isLoggedIn) {
      toast.info("You have to be logged in to add a new sighting.");
    } else {
      navigate(`/sightings/flower/${id}`);
    }
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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  const isFavorite = favoriteEntries.some(
    (entry) => entry.flower_id === flower.id
  );

  return (
    <>
      <FlowerContent>
        {flower && (
          <FlowerDetails
            key={flower.id}
            $backgroundImage={flower.profile_picture}
          >
            <CardLayout>
              <Foto src={flower.profile_picture} alt={flower.name} />
              <FotoInfo>
                <NameLatin> {flower.latin_name}</NameLatin>
                <Name>{flower.name}</Name>

                <FavoriteNumberSightings>
                  <BtnSightings
                    $isFavorite={isFavorite}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/sightings/${flower.id}`);
                    }}
                  >
                    {flower.sightings} sightings
                  </BtnSightings>
                  {isLoggedIn && (
                    <StarIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(flower);
                      }}
                      $isFavorite={isFavorite}
                      aria-label={
                        flower.favorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    />
                  )}
                </FavoriteNumberSightings>
              </FotoInfo>
              <BtnAddNewSighting onClick={handleAddSightingClick}>
                + Add New Sighting
              </BtnAddNewSighting>
            </CardLayout>
            <Text>
              <StyledFitures>
                {flower.features.length > 0
                  ? flower.features.join(", ")
                  : "No features available."}
              </StyledFitures>
              <StyledDescription>
                Description: {flower.description}
              </StyledDescription>
            </Text>
          </FlowerDetails>
        )}
      </FlowerContent>
      <FlowerDetailsList flowerId={id} />
    </>
  );
}

export default FlowerDetail;
