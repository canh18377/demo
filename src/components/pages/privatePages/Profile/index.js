import { message, Avatar, Progress } from "antd";
import { useEffect, useContext, useState } from "react";
import { SharedData } from "../../../Layout/DefaultLayout";
import clsx from "clsx";
import Styles from "./profile.module.scss";
import FormUpdate from "./formUpdate";
import VideoUpLoaded from "./yourVideos/VideoUpLoaded";
import LikedVideos from "./yourVideos/LikedVideos";
import { useParams } from "react-router-dom";
import List_Follower_Following from "./list_follower_following";

function Profile() {
  const { author } = useParams();
  const [videoCategory, setVideoCategory] = useState("Videos");
  const { profileInfo, setProfileInfo, setIsLoged } = useContext(SharedData);
  const [stateLoading, setStateLoading] = useState(true);
  console.log("author", author);
  useEffect(() => {
    fetch(`http://localhost:8080/profile/${author}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          message.error("server bận");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("data profile", data);
        setProfileInfo(data);
        setStateLoading(false);
      })
      .catch((err) => {
        message.error("server bận");
        console.log(err);
      });
    return () => {
      const profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
      setProfileInfo(profileInfoLocal);
    };
  }, []);
  if (stateLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20%",
        }}
      >
        <Progress type="dashboard" percent={50} showInfo={true} />
        <p style={{ color: "red" }}> loading...</p>
      </div>
    );
  } else
    return (
      <div className={clsx(Styles.yourProfile)}>
        <div className={clsx(Styles.infoProfile)}>
          <div className={clsx(Styles.avatarPhoto_Cap)}>
            <Avatar
              className={clsx(Styles.profileAvatar)}
              src={profileInfo.profilePhoto.path}
            />
            <p className={clsx(Styles.yourCaption)}>{profileInfo.caption}</p>
          </div>

          <div className={clsx(Styles.yourInfo)}>
            <h4>Tên:{profileInfo.name}</h4>
            {profileInfo.author && (
              <h4 className={clsx(Styles.idProfile)}>
                {" "}
                id:{profileInfo.author}
              </h4>
            )}
            <div className={clsx(Styles.modifyInfo)}>
              <List_Follower_Following />
            </div>
            <FormUpdate
              profileInfo={profileInfo}
              setProfileInfo={setProfileInfo}
              setIsLoged={setIsLoged}
            />
          </div>
        </div>

        <div style={{ borderBottom: "1 solid black" }}>
          <div>
            <div className={clsx(Styles.yourHistory)}>
              <div
                onClick={() => {
                  setVideoCategory("Videos");
                }}
                className={clsx(Styles.videoCategory, {
                  [Styles.underText]: videoCategory === "Videos",
                })}
              >
                <h3> Videos</h3>
              </div>
              <div
                onClick={() => {
                  setVideoCategory("Liked");
                }}
                className={clsx(Styles.videoCategory, {
                  [Styles.underText]: videoCategory === "Liked",
                })}
              >
                <h3> Liked</h3>
              </div>
            </div>
            <hr />
          </div>
          <div className={clsx(Styles.yourVideos)}>
            {videoCategory === "Videos" ? (
              <VideoUpLoaded author={profileInfo.author} />
            ) : (
              <LikedVideos author={profileInfo.author} />
            )}
          </div>
        </div>
      </div>
    );
}

export default Profile;
