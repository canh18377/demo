import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { memo } from "react";
import Styles from "../../videos.module.scss";
import { message } from "antd";

function HandleFollow({
  author,
  profileInfoLocal,
  listFollow,
  changeFollower,
  isLoged,
  setIsModelOpen,
}) {
  console.log(!isLoged);
  const handleFollow = async (isFollow) => {
    if (!isLoged) {
      message.warning("Hãy đăng nhập để tiếp tục");
      setIsModelOpen(true);
      return;
    }
    try {
      console.log(author);
      console.log(profileInfoLocal && profileInfoLocal.author);

      const response = await fetch("http://localhost:8080/handleFollow", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          author: author,
          user: profileInfoLocal && profileInfoLocal.author,
          isFollow: isFollow,
        }),
      });
      if (!response.ok) {
        message.error("server bận ,thử lại sau");
        throw new Error("network response is fail");
      }
      const data = await response.json();
      if (data.error) {
        message.error("Có lỗi xảy ra , thử lại sau");
      } else {
        console.log(data);
        changeFollower(author);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <PlusOutlined
        onClick={() => handleFollow("isFollow")}
        className={clsx(Styles.follwing, {
          [Styles.isFollow]: listFollow.includes(author),
        })}
      />
      <CheckOutlined
        onClick={() => handleFollow("isUnFollow")}
        className={clsx(Styles.followed, {
          [Styles.isFollow]: !listFollow.includes(author),
        })}
      />
    </div>
  );
}

export default memo(HandleFollow);
