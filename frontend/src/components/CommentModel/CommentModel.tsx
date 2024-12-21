import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./commentModel.module.scss";
import { useGetTasksQuery, usePostCommentMutation } from "../../state/api";

type CommentModalProps = {
  taskName: string;
  taskId: number;
  projectId: number;
  userId: number;
  onClose: () => void;
  onCommentPosted: (newText: string) => void;
};

const CommentModal = ({
  taskName,
  taskId,
  projectId,
  userId,
  onClose,
  onCommentPosted,
}: CommentModalProps) => {
  const [text, setText] = useState<string>("");
  const [postComment] = usePostCommentMutation();

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
    } catch (error) {
      // Show error toast
      toast.error("Failed to post comment. Please try again.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} commentModalColor`}>
        <button
          onClick={onClose}
          className={`${styles.closeButton} closeButton`}
        >
          X
        </button>
        <h3>{taskName}</h3>

        {/* Comments List */}
        <div className={styles.commentsList}>
          {isLoading ? (
            <p>Loading comments...</p>
          ) : currentTask?.comments && currentTask?.comments?.length > 0 ? (
            currentTask?.comments?.map((comment) => (
              <div key={comment.id} className={`${styles.comment} comment`}>
                {comment.text}
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
