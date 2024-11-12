import { useEffect, useState, useCallback, useRef, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";
import {
  fetchComments,
  createComment,
  deleteComment,
} from "../services/comments";
import { getAuthToken, getUserId } from "../utils/auth";
import PropTypes from "prop-types";
import { AuthContext } from "../hooks/AuthContext";
import { toast } from "react-toastify";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
`;

// Styled components
const CommentsDiv = styled.div``;

const HeadersComments = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 1rem;

  /* @media (min-width: 768px) {
    flex-direction: row;
  } */
`;

const ButtonAddComments = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 12px 20px;
  color: rgba(223, 145, 134, 1);
  font-size: 1rem;
  width: 100%;
  max-width: 12rem;
  height: 3rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);
  text-align: center;

  &:hover {
    background-color: rgba(223, 145, 134, 0.1);
    color: rgba(223, 145, 134, 0.8);
  }
`;

const ButtonShowMore = styled.button`
  background-color: transparent;
  border: none;
  width: 100%;
  max-width: 15rem;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 4px;
  color: #333;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  display: block;
  margin: 2rem auto;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);
  margin-bottom: 5rem;

  &:hover {
    background-color: #fafafa;
  }
`;

const H2 = styled.h2`
  font-size: 1.8rem;
  font-weight: 300;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CommentCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease-in-out;

  &.fade-out {
    animation: ${fadeOut} 0.3s ease-in-out;
  }
`;

const Name = styled.p`
  font-weight: bold;
  font-size: 1.4rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CommentText = styled.div`
  font-size: 1.2rem;
  color: rgba(148, 158, 160, 1);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limits text to 3 lines */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;

  /* Optional for adjusting line height or spacing */
  line-height: 1.5rem;
  max-height: calc(1.5rem * 3); /* Ensures container height matches 3 lines */

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const HR = styled.p`
  border-top: 1px solid rgba(232, 233, 237, 1);
  margin-top: 2.5rem;
`;

// New comment form with smooth transition
const NewCommentForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-direction: column;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: opacity 2s ease;

  &.visible {
    max-height: 300px;
    opacity: 1;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-top: 1rem;
  width: 100%;
`;

const Input = styled.input`
  height: 3rem;
  border: 1px solid rgba(245, 246, 247, 1);
  border-radius: 3px;
  background-color: rgba(245, 246, 247, 1);
  width: 100%;
  padding: 2.4rem 1.5rem 1rem;
  font-size: 1.6rem;
  transition: border-color 0.4s;
  font-family: "Ubuntu";
  text-transform: capitalize;
  width: calc(100% - 3.2rem);

  &:focus {
    outline: none;
    border-color: rgba(223, 145, 134, 1);
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0.6rem;
    font-size: 1.2rem;
    color: rgba(223, 145, 134, 1);
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 2.4rem;
  left: 1.5rem;
  font-size: 1.6rem;
  color: rgba(150, 150, 150, 1);
  transition: 0.2s ease all;
  pointer-events: none;
`;

const SubmitCommentButton = styled.button`
  background-color: rgba(223, 145, 134, 1);
  color: white;
  border: none;
  padding: 1.5rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  margin-left: auto;

  &:hover {
    background-color: rgba(223, 145, 134, 0.8);
  }
`;

const ButtonDelete = styled.button`
  background-color: #ffabab;
  color: #fff;
  width: 12rem;
  height: 3rem;
  border-radius: 3px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ff5a5a;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #ff3838;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 90, 90, 0.5);
  }

  @media (max-width: 450px) {
    width: 5rem;
    height: 2rem;
    font-size: 0.8rem;
  }
`;

const CommentContent = styled.div`
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(232, 233, 237, 1);
`;

function Comments({ commentsCount, updateCommentsCount }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { id } = useParams();
  const inputRef = useRef(null);

  const loadComments = useCallback(
    async (id) => {
      try {
        const { comments, hasMore, allComments } = await fetchComments(
          id,
          commentsPerPage
        );
        // console.log("Fetched comments:", allComments);

        setComments(allComments || []);
        setVisibleComments(comments || []);
        setHasMoreComments(hasMore);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [commentsPerPage]
  );

  useEffect(() => {
    if (id) {
      loadComments(id);
    }
  }, [id, loadComments]);

  // Load more comments (pagination)
  const loadMoreComments = () => {
    const nextPage = page + 1;
    const newVisibleComments = comments.slice(0, nextPage * commentsPerPage);
    setVisibleComments(newVisibleComments);
    setPage(nextPage);

    if (newVisibleComments.length >= comments.length) {
      setHasMoreComments(false);
    }
  };

  const handleShowForm = () => {
    if (!isLoggedIn) {
      toast.info("You need to be logged in to add a comment.");
      return;
    }
    setIsFormVisible(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        requestAnimationFrame(() => inputRef.current.focus());
      }
    }, 50);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const token = getAuthToken();
      const userId = getUserId();
      const newCommentObj = await createComment(id, newComment, token, userId);

      if (!newCommentObj.comment) {
        throw new Error("Failed to create comment");
      }

      loadComments(id);

      setComments((prevComments) => {
        const updatedComments = [newCommentObj.comment, ...prevComments];
        setVisibleComments(
          updatedComments.slice(0, visibleComments.length + 1)
        );
        return updatedComments;
      });

      updateCommentsCount(1);
      setNewComment("");
    } catch (error) {
      toast.error("Error adding comment. Please try again.");
    }
  };

  // Function to remove a comment (only if it belongs to the current user)
  const handleRemove = async (commentId) => {
    const commentToDelete = comments.find((comment) => comment.id == commentId);

    if (
      commentToDelete &&
      commentToDelete.user_id == localStorage.getItem("user_id")
    ) {
      try {
        const token = getAuthToken();
        const response = await deleteComment(
          commentToDelete.sighting_id,
          commentId,
          token
        );

        if (response.success !== true) {
          console.error("Failed to delete the comment:", response.message);
          return;
        }

        // Trigger fade-out animation before removing the comment
        document
          .getElementById(`comment-${commentId}`)
          .classList.add("fade-out");

        // Delay removal for animation
        setTimeout(() => {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
          setVisibleComments((prevVisible) =>
            prevVisible.filter((comment) => comment.id !== commentId)
          );
          updateCommentsCount(-1);
        }, 300);
      } catch (error) {
        console.error("Error removing comment:", error);
        toast.error("Failed to remove the comment. Please try again.");
      }
    } else {
      toast.error("You can only delete your own comments.");
    }
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CommentsDiv>
      <HR />
      <HeadersComments>
        <H2>{commentsCount} Comments</H2>

        <ButtonAddComments onClick={handleShowForm}>
          Add Comment
        </ButtonAddComments>
      </HeadersComments>

      {visibleComments.length > 0 ? (
        visibleComments.map((comment) => {
          if (!comment.id) {
            console.error("Comment has no unique id:", comment);
            return null;
          }

          return (
            <CommentContent key={comment.id} id={`comment-${comment.id}`}>
              <CommentCard>
                <Name>{comment.user_full_name}</Name>
                <CommentText>{comment.content}</CommentText>
              </CommentCard>
              {comment.user_id == getUserId() && (
                <ButtonDelete onClick={() => handleRemove(comment.id)}>
                  DELETE
                </ButtonDelete>
              )}
            </CommentContent>
          );
        })
      ) : (
        <h2>No comments yet.</h2>
      )}

      {/* New Comment Input Form - Only show if isFormVisible is true */}
      <NewCommentForm ref={inputRef} className={isFormVisible ? "visible" : ""}>
        <InputWrapper>
          <Input
            type="text"
            placeholder=" "
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            name="newComment"
          />
          <FloatingLabel>Write a comment...</FloatingLabel>
        </InputWrapper>

        <SubmitCommentButton onClick={handleAddComment}>
          Submit Comment
        </SubmitCommentButton>
      </NewCommentForm>

      {hasMoreComments && (
        <ButtonShowMore onClick={loadMoreComments}>Show More</ButtonShowMore>
      )}
    </CommentsDiv>
  );
}

Comments.propTypes = {
  commentsCount: PropTypes.number.isRequired,
  updateCommentsCount: PropTypes.func.isRequired,
};

export default Comments;
