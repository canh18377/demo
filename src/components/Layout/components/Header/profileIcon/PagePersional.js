import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import Styles from "./pagePersional.module.scss";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "antd";
function PagePersional({ setIsLoged, profileInfo }) {
  const [isLoading, setIsLoading] = useState(true);
  const profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));

  useEffect(() => {
    const profilePhoto =
      JSON.parse(localStorage.getItem("profileInfo")) &&
      JSON.parse(localStorage.getItem("profileInfo")).profilePhoto;
    profileInfo.profilePhoto = profilePhoto;
    setIsLoading(false);
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("profileInfo");
    setIsLoged(false);
    navigate("/");
  };
  if (isLoading) return;
  return (
    <div>
      <Tippy
        interactive={true}
        theme="light"
        placement="bottom"
        appendTo="parent"
        delay={[0, 200]}
        content={
          <div className={clsx(Styles.iconBackground)}>
            <div className={clsx(Styles.openProfile)}>
              <UserOutlined style={{ marginRight: 7 }} />
              <p
                onClick={() => {
                  navigate(
                    `/profile/${profileInfoLocal && profileInfoLocal.author}`
                  );
                  window.location.reload();
                }}
              >
                View Profile
              </p>
            </div>
            <div className={clsx(Styles.Logut)}>
              <div
                onClick={() => handleLogout()}
                style={{
                  display: "flex",
                  cursor: "pointer",
                  justifyContent: "space-between",
                }}
              >
                <LogoutOutlined style={{ marginRight: 7 }} />
                <p style={{ marginRight: 24 }}>Log Out</p>
              </div>
            </div>
          </div>
        }
      >
        <Avatar
          className={clsx(Styles.avatarHeader)}
          src={profileInfoLocal && profileInfoLocal.profilePhoto.path}
        />
      </Tippy>
    </div>
  );
}

export default memo(PagePersional);
