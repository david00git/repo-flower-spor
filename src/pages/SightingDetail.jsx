import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaCommentDots } from "react-icons/fa";
import { MdFavorite, MdDeleteForever } from "react-icons/md";
import Comments from "../ui/Comments";
import Map from "../ui/Map";
import {
  deleteSighting,
  getLikes,
  likeSighting,
  unlikeSighting,
} from "../services/Sightings";
import { getAuthToken } from "../utils/auth";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

// Styled components
const SightingContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);
  margin: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 3rem;
    margin: 0 2rem;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 29rem;
  max-height: 29rem;
  object-fit: cover;
`;

const NameOfFlowerAndCreator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  width: 100%;
  flex-direction: column;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    width: max-content;
  }
`;

const NameFlower = styled.p`
  font-size: 2rem;
  color: rgba(51, 65, 68, 1);
  margin: 0;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StyledImageCreator = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  @media (min-width: 768px) {
    width: 5rem;
    height: 5rem;
  }
`;

const ContentContainer = styled.div`
  padding: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 4.2rem 10rem 7.2rem 5rem;
  }
`;
const CreatorName = styled.p`
  font-size: 1.4rem;
  color: rgba(148, 158, 160, 1);
  margin: 0;
  margin-top: 0.5rem;
`;

const FlowerDescription = styled.p`
  font-size: 1.4rem;
  text-align: justify;
  color: rgba(148, 158, 160, 1);
  font-family: "Montserrat";
  word-wrap: break-word;
  margin: 1rem 0;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CommentAndFavorites = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(232, 233, 237, 1);
  padding: 1.5rem;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
    padding: 2rem;
  }
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

  &:hover {
    color: #fa4a4a;
  }

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: auto;
  max-height: 28rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    width: 50%;
    margin-bottom: 0;
  }
`;
const SightingCard = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StyledSightingDetails = styled.div`
  margin-top: 1rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    margin-top: -2rem;
  }
`;

const Delete = styled(MdDeleteForever)`
  width: 4rem;
  height: 4rem;
  color: #ffabab;
  margin-left: 10rem;

  &:hover {
    color: #ff5a5a;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;

function SightingDetail() {
  const { id } = useParams();
  const [sighting, setSighting] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const token = getAuthToken();
  const currentUserId = parseInt(localStorage.getItem("user_id"), 10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSightingDetail = async () => {
      try {
        const response = await fetch(
          `https://flowrspot-api.herokuapp.com/api/v1/sightings/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sighting details.");
        }
        const data = await response.json();
        setSighting(data.sighting);
        setLikesCount(data.sighting.likes_count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikes = async () => {
      try {
        const result = await getLikes(id, token, currentUserId);
        if (result.success) {
          setIsLikedByUser(
            result.likes.some((like) => like.user_id === currentUserId)
          );
          setLikesCount(result.likes.length);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };

    fetchSightingDetail();
    fetchLikes();
  }, [id, token, currentUserId]);

  const handleToggleLike = async () => {
    try {
      if (isLikedByUser) {
        const result = await unlikeSighting(id, token, currentUserId);
        if (result.success) {
          setLikesCount((prevCount) => Math.max(prevCount - 1, 0));
          setIsLikedByUser(false);
          toast.info("Removed from likes.");
        }
      } else {
        const result = await likeSighting(id, token, currentUserId);
        if (result.success) {
          setLikesCount((prevCount) => prevCount + 1);
          setIsLikedByUser(true);
          toast.success("Added to likes.");
        }
      }
      // Fetch updated likes after each toggle to synchronize with server
      const updatedLikes = await getLikes(id, token, currentUserId);
      setLikesCount(updatedLikes.likes.length);
      setIsLikedByUser(
        updatedLikes.likes.some((like) => like.user_id === currentUserId)
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Could not update like status. Please try again.");
    }
  };

  useEffect(() => {
    if (sighting) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `https://flowrspot-api.herokuapp.com/api/v1/sightings/${id}/comments`
          );
          if (!response.ok) throw new Error("Failed to fetch comments.");

          const data = await response.json();
          setComments(data.comments);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchComments();
    }
  }, [id, sighting]);

  useEffect(() => {
    if (sighting) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `https://flowrspot-api.herokuapp.com/api/v1/sightings/${id}/comments`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch comments.");
          }
          const data = await response.json();
          setComments(data.comments);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchComments();
    }
  }, [id, sighting]);

  const updateCommentsCount = (delta) => {
    setSighting((prev) => ({
      ...prev,
      comments_count: prev.comments_count + delta,
    }));
  };

  const handleDelete = async () => {
    const result = await deleteSighting(id, token);
    if (result.success) {
      navigate("/latest-sightings");
      toast.success("Sighting deleted successfully.");
    } else {
      toast.error(`Failed to delete sighting: ${result.message}`);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  if (!sighting) return <h2>No sighting found.</h2>;

  return (
    <StyledSightingDetails>
      <Map
        initialCoords={[sighting.latitude, sighting.longitude]}
        markerCoords={[sighting.latitude, sighting.longitude]}
      />
      <SightingContent>
        <SightingCard key={sighting.id}>
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
              {sighting.user.id === currentUserId && (
                <Delete onClick={handleDelete} />
              )}
            </NameOfFlowerAndCreator>

            <FlowerDescription>{sighting.description}</FlowerDescription>
            <CommentAndFavorites>
              <Comment>
                <FaCommentDots /> {sighting.comments_count} Comments
              </Comment>

              <Favorites $isLiked={isLikedByUser} onClick={handleToggleLike}>
                <MdFavorite style={{ color: isLikedByUser ? "red" : "grey" }} />
                {likesCount} Likes
              </Favorites>
            </CommentAndFavorites>
          </ContentContainer>
        </SightingCard>
      </SightingContent>
      <Comments
        comments={comments}
        flowerId={id}
        commentsCount={sighting.comments_count}
        updateCommentsCount={updateCommentsCount}
      />
    </StyledSightingDetails>
  );
}

export default SightingDetail;
