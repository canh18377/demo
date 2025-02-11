import Header from "../components/Header";
import SideBar from "./SideBar";
import Styles from "./defaultLayout.module.scss";
import clsx from "clsx";
import { useState, createContext, useEffect } from "react";
const SharedData = createContext();
function DefaultLayout({ children }) {
  const [contentSearch, setContentSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLoged, setIsLoged] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    return !!token;
  });
  const [profileInfo, setProfileInfo] = useState(() => {
    const savedDataProfile = localStorage.getItem("profileInfo");
    return savedDataProfile
      ? JSON.parse(savedDataProfile)
      : { profilePhoto: "", videos: "", name: "", caption: "", author: "" };
  });
  const [likedVideo, setLikedVideo] = useState([]);

  useEffect(() => {
    if (!isLoged) {
      setLikedVideo([]);
    }
  }, [isLoged]);
  useEffect(() => {
    const profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
    if (profileInfoLocal) {
      let author = profileInfoLocal.author;
      if (profileInfo.author === author) {
        localStorage.setItem("profileInfo", JSON.stringify(profileInfo));
      }
    }
  }, [profileInfo]);

  return (
    <SharedData.Provider
      value={{
        contentSearch,
        setContentSearch,
        history,
        setHistory,
        likedVideo,
        setLikedVideo,
        setIsModelOpen,
        isModelOpen,
        isLoged,
        setIsLoged,
        profileInfo,
        setProfileInfo,
      }}
    >
      <div className={clsx(Styles.DefaultLayout)}>
        <div className={clsx(Styles.header)}>
          <Header />
        </div>
        <div className={clsx(Styles.container)}>
          <SideBar />
          <div className={clsx(Styles.content)}>{children}</div>
        </div>
      </div>
    </SharedData.Provider>
  );
}

export default DefaultLayout;
export { SharedData };
