import { Modal } from "antd";
import { SharedData } from "../../../../Layout/DefaultLayout";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Avatar } from "antd";
import { FrownOutlined, CloseOutlined } from "@ant-design/icons";
import clsx from "clsx";
import Styles from "./list_follower_following.module.scss";
function List_Follower_Following() {
  const Navigate = useNavigate();
  const { profileInfo } = useContext(SharedData);
  const [followList, setFollowList] = useState([]);
  const [openModalFollowList, setOpenModalFollowList] = useState(false);
  const [isFollow, setIsFollow] = useState();
  var profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
  console.log(profileInfo);
  const getFollowList = async (isFollow) => {
    try {
      const response = await fetch(
        `http://localhost:8080/profile/getFollowList/${profileInfo.author}/${isFollow}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error`);
      }
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setFollowList(data);
        setOpenModalFollowList(true);
        setIsFollow(isFollow);
      }
    } catch (error) {
      message.error("server bận");
      console.log(error);
    }
  };
  const deleteFollowing = async (followingPerson) => {
    try {
      const response = await fetch(
        `http://localhost:8080/profile/deleteFollowing`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            followingPerson,
            user: profileInfoLocal.author,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error`);
      }
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setFollowList(
          followList.filter((user) => user.author !== followingPerson)
        );
        message.success(data);
      }
    } catch (error) {
      message.error("server bận");
      console.log(error);
    }
  };
  const handleClickUser = (author) => {
    Navigate(`/profile/${author}`);
    window.location.reload();
  };
  return (
    <div style={{ display: "flex" }}>
      <Modal
        open={openModalFollowList}
        onCancel={() => setOpenModalFollowList(false)}
        footer={false}
      >
        {
          <div>
            {followList.length === 0 ? (
              <div className={clsx(Styles.note)}>
                <FrownOutlined className={clsx(Styles.iconNote)} />
                <h3 className={Styles.noteText}>Chưa có ai trong danh sách</h3>
              </div>
            ) : (
              followList.map((user, index) => {
                return (
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    key={index}
                  >
                    <div
                      onClick={() => handleClickUser(user.author)}
                      className={clsx(Styles.user)}
                    >
                      <Avatar src={user.profilePhoto.path} size={30} />
                      <p>{user.name}</p>
                    </div>
                    {profileInfoLocal &&
                      isFollow === "isFollowing" &&
                      profileInfoLocal.author === profileInfo.author && (
                        <CloseOutlined
                          onClick={() => deleteFollowing(user.author)}
                          className={clsx(Styles.deleteFollow)}
                        />
                      )}
                  </div>
                );
              })
            )}
          </div>
        }
      </Modal>
      <p
        onClick={() => getFollowList("isFollower")}
        style={{ marginRight: 10, cursor: "pointer" }}
      >
        Follower
      </p>
      <p
        onClick={() => getFollowList("isFollowing")}
        style={{ cursor: "pointer" }}
      >
        Following
      </p>
    </div>
  );
}

export default List_Follower_Following;
