import styled from "styled-components";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { getLikes, likeSighting, unlikeSighting } from "../services/Sightings";
import { getLikeIconColor } from "../utils/auth";
import { getAuthToken } from "../utils/auth";
import { toast } from "react-toastify";

const ListOfFlowersWithSameIDFlower = styled.div`
  margin-bottom: 2rem;
`;

const FlowersGridCard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 2rem;
  margin-top: 3rem;
  padding: 0 2rem;
`;

const FlowerCard = styled.div`
  height: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 28rem;
`;

const ContentContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const NameOfFlowerAndCreator = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: left;
`;

const StyledImageCreator = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const CreatorName = styled.span`
  font-size: 1.2rem;
  color: rgba(148, 158, 160, 1);
  margin: 0;
  margin-top: 0.5rem;
`;

const NameFlower = styled.p`
  font-size: 1.5rem;
  color: rgba(51, 65, 68, 1);
  margin: 0;
  margin-bottom: 1rem;
`;

const FlowerDescription = styled.p`
  font-size: 1.2rem;
  text-align: justify;
  color: rgba(148, 158, 160, 1);
  font-family: "Montserrat";
  margin-top: 2rem;
  height: 20rem;
  word-wrap: break-word;
  overflow: hidden; /*Hides any overflow content*/
  text-overflow: ellipsis; /* Adds the ellipsis ("...") */
  max-height: 100px;
`;

const CommentAndFavorites = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-top: 1px solid rgba(232, 233, 237, 1);
`;

const Comment = styled.p`
  font-size: 1.2rem;
  color: rgba(148, 158, 160, 1);
  text-align: justify;
  gap: 1rem;
  align-items: center;
  display: flex;

  svg {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

const Favorites = styled.p`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  color: rgba(148, 158, 160, 1);
  gap: 0.5rem;
  cursor: pointer;

  svg {
    color: ${({ $isLiked }) => ($isLiked ? "red" : "rgba(148, 158, 160, 1)")};
    height: 1.5rem;
    width: 1.5rem;
  }

  :hover {
    color: #fa4a4a;
  }
`;

const ErrorMessage = styled.h2`
  color: red;
  text-align: center;
`;
const Location = styled.div`
  position: absolute;

  top: 2rem;
  left: 2rem;
  background-color: rgba(255, 255, 255, 1);
  padding: 0.5rem;
  border-radius: 20px;
  font-size: 1.2rem;
  color: rgba(223, 145, 134, 1);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ErrorMess = styled.h2`
  text-align: center;
  margin-top: 5rem;
  color: rgba(148, 158, 160, 1);
  font-family: "Ubuntu";
  font-weight: 300;
  font-size: 30px;
`;

function FlowerDetailsList({ flowerId }) {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationData, setLocationData] = useState({});
  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem("user_id"), 10);

  const token = getAuthToken();
  const flowerIdNumber = Number(flowerId);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch(
          `https://flowrspot-api.herokuapp.com/api/v1/flowers/${flowerIdNumber}/sightings`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sightings");
        }
        const data = await response.json();

        // Fetch like status for each sighting
        const sightingsWithLikeInfo = await Promise.all(
          data.sightings.map(async (sighting) => {
            const likesData = await getLikes(sighting.id);
            const userLiked = likesData.likes.some(
              (like) => like.user_id === currentUserId
            );

            return {
              ...sighting,
              isLikedByUser: userLiked,
              likesCount: sighting.likes_count,
            };
          })
        );

        setSightings(sightingsWithLikeInfo);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, [flowerIdNumber, currentUserId]);

  const handleToggleLike = async (sightingId) => {
    if (!token) {
      toast.info("You need to be logged in to like or unlike a sighting.");
      return;
    }

    try {
      const updatedSightings = await Promise.all(
        sightings.map(async (sighting) => {
          if (sighting.id === sightingId) {
            if (sighting.isLikedByUser) {
              const result = await unlikeSighting(
                sightingId,
                token,
                currentUserId
              );
              if (result.success) {
                toast.info("Removed from likes.");
                return {
                  ...sighting,
                  isLikedByUser: false,
                  likesCount: sighting.likesCount - 1,
                };
              }
            } else {
              const result = await likeSighting(
                sightingId,
                token,
                currentUserId
              );
              if (result.success) {
                toast.success("Added to likes.");
                return {
                  ...sighting,
                  isLikedByUser: true,
                  likesCount: sighting.likesCount + 1,
                };
              }
            }
          }
          return sighting;
        })
      );

      setSightings(updatedSightings);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("An error occurred while updating the like status.");
    }
  };

  const fetchLocation = async (lat, lon) => {
    if (typeof lat !== "number" || typeof lon !== "number")
      return "Location unavailable";
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: `${lat},${lon}`,
            key: "92999bd38a834770a883693c7bc48686",
          },
        }
      );

      const { city, country } = response.data.results[0].components;
      return `${city}, ${country}`;
    } catch (error) {
      return "Location unavailable";
    }
  };

  const getLocation = useCallback(async (latitude, longitude, sightingId) => {
    const location = await fetchLocation(latitude, longitude);
    setLocationData((prevData) => ({ ...prevData, [sightingId]: location }));
  }, []);

  useEffect(() => {
    sightings.forEach((sighting) => {
      if (sighting.latitude && sighting.longitude) {
        getLocation(sighting.latitude, sighting.longitude, sighting.id);
      }
    });
  }, [sightings, getLocation]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

  return (
    <ListOfFlowersWithSameIDFlower>
      {sightings.length > 0 ? (
        <FlowersGridCard>
          {sightings.map((sighting) => (
            <FlowerCard
              key={sighting.id}
              onClick={() => navigate(`/sightings/${sighting.id}`)}
            >
              <ImageContainer>
                <StyledImage
                  src={`https://${sighting.flower.profile_picture}`}
                  alt={`${sighting.flower.name} profile`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/missing-photo.jfif";
                  }}
                />
                <Location>
                  <FaMapMarkerAlt />
                  {locationData[sighting.id] ||
                    `${sighting.latitude}, ${sighting.longitude}`}
                </Location>
              </ImageContainer>
              <ContentContainer>
                <NameOfFlowerAndCreator>
                  <StyledImageCreator
                    src={sighting.picture}
                    alt={sighting.name}
                  />
                  <div>
                    <NameFlower>
                      {sighting.flower.name} {sighting.flower.latin_name}
                    </NameFlower>
                    <CreatorName>by {sighting.user.full_name}</CreatorName>
                  </div>
                </NameOfFlowerAndCreator>

                <FlowerDescription>{sighting.description}</FlowerDescription>

                <CommentAndFavorites>
                  <Comment>
                    <FaCommentDots /> {sighting.comments_count} Comments
                  </Comment>
                  <Favorites
                    $isLiked={sighting.isLikedByUser}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(sighting.id);
                    }}
                  >
                    <MdFavorite
                      style={{
                        color: getLikeIconColor(sighting.isLikedByUser),
                      }}
                    />
                    {sighting.likesCount} Likes
                  </Favorites>
                </CommentAndFavorites>
              </ContentContainer>
            </FlowerCard>
          ))}
        </FlowersGridCard>
      ) : (
        <ErrorMess>No sightings found for this flower.</ErrorMess>
      )}
    </ListOfFlowersWithSameIDFlower>
  );
}

FlowerDetailsList.propTypes = {
  flowerId: PropTypes.string.isRequired,
};

export default FlowerDetailsList;
