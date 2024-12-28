import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./commentModel.module.scss";
import { useGetTasksQuery, usePostCommentMutation } from "../../state/api";

type CommentModalProps = {
  taskName: string;
  taskId: number;
  projectId: number;
  userId?: number;
  userName?: string;
  image?: string;
  onClose: () => void;
  onCommentPosted: (newText: string) => void;
};

const CommentModal = ({
  taskName,
  taskId,
  projectId,
  userId,
  userName,
  image,
  onClose,
  onCommentPosted,
}: CommentModalProps) => {
  const [text, setText] = useState<string>("");
  const [postComment] = usePostCommentMutation();
  const commentsListRef = useRef<HTMLDivElement>(null); // Ref for comments list

  // Fetching tasks associated with the project
  const { data: tasks, isLoading } = useGetTasksQuery({ projectId });

  // Finding the current task based on taskId
  const currentTask = tasks?.find((task) => task.id === taskId);

  const handlePostComment = async () => {
    if (!text.trim()) {
      return;
    }

    try {
      // Posting the comment
      await postComment({
        text,
        taskId,
        userId,
      }).unwrap();

      setText("");
      onCommentPosted(text);

      // Scroll to the last comment
      scrollToLastComment();
    } catch (error) {
      // Show error toast
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePostComment();
    }
  };

  const scrollToLastComment = () => {
    if (commentsListRef.current) {
      commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
    }
  };

  // To automatically scroll to the last comment
  useEffect(() => {
    scrollToLastComment();
  }, [currentTask?.comments]);

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} commentModalColor`}>
        <div className={styles.taskHeader}>
          <h3>{taskName}</h3>
          <button
            onClick={onClose}
            className={`${styles.closeButton} closeButton`}
          >
            X
          </button>
        </div>
        <div className={`${styles.taskHeaderBorder} borderColor`}></div>

        {/* Comments List */}
        <div className={styles.commentsList} ref={commentsListRef}>
          {isLoading ? (
            <p>Loading comments...</p>
          ) : currentTask?.comments && currentTask?.comments?.length > 0 ? (
            currentTask?.comments?.map((comment) => (
              <div
                key={comment.id}
                className={`${
                  comment.userId !== userId ? styles.comment : styles.myComment
                } comment`}
              >
                <div className={styles.commentContainer}>
                  {comment.userId !== userId && (
                    <img
                      src={"/p1.jpeg"}
                      alt={"user"}
                      className={styles.userImage}
                    />
                  )}
                  <div className={styles.commentText}>
                    <span className={styles.userName}>{"user"}</span>
                    <p>{comment.text}</p>
                  </div>
                  {comment.userId === userId && (
                    <img
                      src={`/p1.jpeg`}
                      alt={"user"}
                      className={styles.userImage}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        {/* Comment Input */}
        <div className={styles.commentInput}>
          <input
            type="text"
            className="input"
            value={text}
            onKeyDown={handleKeyPress}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handlePostComment}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
