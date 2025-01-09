import { User } from "../../state/api";
import styles from "./UserCard.module.scss";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className={styles.userContainer}>
      {user.image && (
        <img
          src={`/${user.image}`}
          alt="profile picture"
          width={100}
          height={100}
          className={styles.img}
        />
      )}
      <div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
