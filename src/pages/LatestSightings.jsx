import { useEffect, useState } from "react";
import styled from "styled-components";
import { getSightings } from "../services/Sightings";
import { FaCommentDots } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";

import { unlikeSighting, likeSighting, getLikes } from "../services/Sightings";
import { getAuthToken, getLikeIconColor } from "../utils/auth";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
// Styling Components
const breakpoints = {
  tablet: "768px",
  mobile: "480px",
};

// Styling Components
const StyledLatestSightings = styled.div`
  padding: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const LatestSightingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 2rem;
  margin-top: 3rem;
  padding: 0 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-gap: 2rem;
    padding: 0 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
    grid-gap: 2rem;
  }
`;

const Headers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 6rem;
  padding: 0 2rem;
  position: relative;
  margin-bottom: 5rem;

  @media (max-width: ${breakpoints.tablet}) {
    /* margin-top: 4rem; */
    /* margin-bottom: 3rem; */
    padding: 0 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    /* margin-top: 3rem; */
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
`;

const H1 = styled.h1`
  font-size: 4rem;
  color: rgba(148, 158, 160, 1);
  text-align: center;
  font-weight: 300;
  margin: 0;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const H2 = styled.h2`
  font-weight: 300;
  font-size: 1.7rem;
  text-align: center;
  color: rgba(148, 158, 160, 1);
  margin-bottom: 4rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.3rem;
    margin-bottom: 3rem;
  }
`;

const SightingCard = styled.div`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: white;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 28rem;

  @media (max-width: ${breakpoints.tablet}) {
    height: 22rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: 18rem;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledImageCreator = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  @media (max-width: ${breakpoints.mobile}) {
    width: 3rem;
    height: 3rem;
  }
`;

const ContentContainer = styled.div`
  padding: 2rem;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const NameOfFlowerAndCreator = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: left;
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const NameFlower = styled.p`
  font-size: 1.5rem;
  color: rgba(51, 65, 68, 1);
  margin: 0;
  margin-bottom: 0.5rem;
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.4rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.3rem;
  }
`;

const CreatorName = styled.span`
  font-size: 1.2rem;
  color: rgba(148, 158, 160, 1);

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const FlowerDescription = styled.p`
  font-size: 1.2rem;
  text-align: justify;
  color: rgba(148, 158, 160, 1);
  margin-top: 2rem;
  max-height: 5rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1rem;
    margin-top: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const CommentAndFavorites = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-top: 1px solid rgba(232, 233, 237, 1);
  padding-top: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 1.5rem;
  }
`;

const Comment = styled.p`
  font-size: 1.2rem;
  color: rgba(148, 158, 160, 1);
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
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

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1rem;

    svg {
      height: 1.4rem;
      width: 1.4rem;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;

    svg {
      height: 1.2rem;
      width: 1.2rem;
    }
  }
`;

function LatestSightings({ totalSightings }) {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem("user_id"), 10);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await getSightings();

        if (Array.isArray(response.sightings)) {
          const sightingsWithLikeInfo = await Promise.all(
            response.sightings.map(async (sighting) => {
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
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        setError("Failed to fetch sightings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, [currentUserId]);

  const handleToggleLike = async (sightingId) => {
    const token = getAuthToken();
    if (!token) {
      toast.info("You need to be logged in to like or unlike a sighting.");
      return;
    }

    const updatedSightings = sightings.map((sighting) => {
      if (sighting.id === sightingId) {
        return {
          ...sighting,
          isLikedByUser: !sighting.isLikedByUser,
          likesCount: sighting.isLikedByUser
            ? sighting.likesCount - 1
            : sighting.likesCount + 1,
        };
      }
      return sighting;
    });
    setSightings(updatedSightings);

    const sighting = updatedSightings.find((s) => s.id === sightingId);
    if (sighting.isLikedByUser) {
      await likeSighting(sightingId, token, currentUserId);
      toast.success("Added to likes.");
    } else {
      await unlikeSighting(sightingId, token, currentUserId);
      toast.info("Removed from likes.");
    }

    // Re-fetch likes to confirm accuracy
    const likesData = await getLikes(sightingId);
    setSightings((prevSightings) =>
      prevSightings.map((s) =>
        s.id === sightingId
          ? {
              ...s,
              likesCount: likesData.likes.length,
              isLikedByUser: likesData.likes.some(
                (like) => like.user_id === currentUserId
              ),
            }
          : s
      )
    );
  };

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <StyledLatestSightings>
      <Headers>
        <HeadingContainer>
          <H1>Sighting List</H1>
          <H2>Explore between more than {totalSightings} sightings</H2>
        </HeadingContainer>
      </Headers>

      <LatestSightingsGrid>
        {sightings.length > 0 ? (
          sightings.map((sighting) => (
            <SightingCard
              key={sighting.id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/sightings/${sighting.id}`);
              }}
            >
              <ImageContainer>
                <StyledImage
                  src={`https://${sighting.flower.profile_picture}`}
                  alt={`${sighting.flower.name} profile`}
                  onError={(e) => {
                    e.target.src = "/missing-photo.jfif";
                  }}
                />
              </ImageContainer>
              <ContentContainer>
                <NameOfFlowerAndCreator>
                  <StyledImageCreator
                    src={sighting.picture}
                    alt={sighting.name}
                    onError={(e) => {
                      e.target.src = "/missing-photo.jfif";
                    }}
                  />
                  <div>
                    <NameFlower>
                      {sighting.flower.name} ({sighting.flower.latin_name})
                    </NameFlower>
                    <CreatorName>by {sighting.user.full_name}</CreatorName>
                  </div>
                </NameOfFlowerAndCreator>

                <FlowerDescription>{sighting.description}</FlowerDescription>

                <p style={{ color: "rgba(148, 158, 160, 1)" }}>
                  Sighting name: {sighting.name}
                </p>

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
            </SightingCard>
          ))
        ) : (
          <p>No sightings available</p>
        )}
      </LatestSightingsGrid>
    </StyledLatestSightings>
  );
}

LatestSightings.propTypes = {
  totalSightings: PropTypes.number.isRequired,
};

export default LatestSightings;
