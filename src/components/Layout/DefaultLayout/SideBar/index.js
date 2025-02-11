import Styles from "./sideBar.module.scss";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { SharedData } from "..";
import SideBarChildren from "./components/sideBar/SideBarChildren";
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
function SideBar() {
  const profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
  const { isLoged, setIsModelOpen } = useContext(SharedData);
  const navigate = useNavigate();
  const handleNavProfile = () => {
    if (isLoged) {
      navigate(`/profile/${profileInfoLocal && profileInfoLocal.author}`);
    } else setIsModelOpen(true);
  };

  return (
    <div className={clsx(Styles.sideBar)}>
      <SideBarChildren
        icon={
          <HomeOutlined style={{ color: "rgb(43, 39, 39)", fontSize: 24 }} />
        }
        content="For You"
        handle={() => navigate("/")}
      />
      <SideBarChildren
        icon={
          <TeamOutlined style={{ color: "rgb(43, 39, 39)", fontSize: 24 }} />
        }
        content="Following"
        handle={() => navigate("/following")}
      />
      <SideBarChildren
        icon={
          <UserOutlined style={{ color: "rgb(43, 39, 39)", fontSize: 24 }} />
        }
        content="Profile"
        handle={handleNavProfile}
      />
      <SideBarChildren
        icon={
          <CloudUploadOutlined
            style={{ color: "rgb(43, 39, 39)", fontSize: 24 }}
          />
        }
        content="Upload"
        handle={() => {
          if (isLoged) {
            navigate("/upload");
          } else setIsModelOpen(true);
        }}
      />
    </div>
  );
}

export default SideBar;
