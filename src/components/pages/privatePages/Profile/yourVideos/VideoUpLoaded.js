import { useEffect, memo, useState } from "react";
import { message } from "antd";
import clsx from "clsx";
import Styles from "./videoProfile.module.scss";
import ReactPlayer from "react-player";
import UpdateVideo from "./deleteAndUpdate/UpdateVideo";
import DeleteVideo from "./deleteAndUpdate/DeleteVideo";
import { EllipsisOutlined } from "@ant-design/icons";
var profileInfoLocal;
function VideoUpLoaded({ author }) {
  console.log(author);
  console.log("trong useefect", profileInfoLocal);
  const [deleted_updated, setDeleted_Updated] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isOpenTool, setIsOpenTool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playVideo, setPlayVideo] = useState(null);
  useEffect(() => {
    profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
    fetch(`http://localhost:8080/profile/videos/${author}`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          message.error("server bận");
        } else return res.json();
      })
      .then((data) => {
        setVideos(data);
        console.log("video:", data);

        setIsLoading(false);
      })
      .catch((err) => {
        message.error("có lỗi xảy ra ");
        console.log(err);
      });
  }, [author, deleted_updated]);
  const toggleTool = (id) => {
    setIsOpenTool((prev) => {
      if (prev !== id) {
        return id;
      } else {
        return null;
      }
    });
  };
  if (isLoading) {
    return;
  }

  return (
    <div className={clsx(Styles.containerVideos)}>
      {videos.map((video, index) => {
        return (
          <div
            key={index}
            onMouseMove={() => setPlayVideo(video._id)}
            onMouseLeave={() => setPlayVideo(null)}
            className={clsx(Styles.containerVideo_Info)}
          >
            <ReactPlayer
              className={clsx(Styles.containerVideo)}
              width={"100%"}
              playing={video._id === playVideo}
              height={"100%"}
              url={video.path}
            />
            <div className={clsx(Styles.videoInfo)}>
              <p className={Styles.nameVideo}>@{video.name}</p>
              <u>Match: {video.limitedAge}</u>

              {
                <div className={clsx(Styles.genre)}>
                  {video.genres.map((genre, index) => {
                    return (
                      <i key={index} style={{ fontSize: "10px" }}>
                        #{genre}
                      </i>
                    );
                  })}
                </div>
              }
            </div>{" "}
            <div className={clsx(Styles.update_deleteVideo)}>
              {profileInfoLocal && profileInfoLocal.author === author && (
                <EllipsisOutlined
                  onClick={() => toggleTool(video._id)}
                  style={{ color: "white", fontSize: 20 }}
                />
              )}
              {isOpenTool === video._id && (
                <UpdateVideo
                  idVideo={video._id}
                  name={video.name}
                  genres={video.genres}
                  limitedAge={video.limitedAge}
                  setDeleted_Updated={setDeleted_Updated}
                  path={video.path}
                />
              )}
              {isOpenTool === video._id && (
                <DeleteVideo
                  idVideo={video._id}
                  setDeleted_Updated={setDeleted_Updated}
                  name={video.name}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(VideoUpLoaded);
