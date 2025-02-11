import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Avatar, Progress, message } from "antd";
import Styles from "./commentVideo.module.scss";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import CommentSection from "./comment/CommentSection";
var profileLocalstorage;
function VideoComments() {
  const Navigate = useNavigate();
  const { idVideo } = useParams();
  const [video_Owner_CommentsInfo, setvideo_Owner_CommentsInfo] = useState();
  const [isLoading, setISLoading] = useState(true);
  const [reload, setIsReload] = useState(null);

  useEffect(() => {
    profileLocalstorage = JSON.parse(localStorage.getItem("profileInfo"));
    try {
      fetch(`http://localhost:8080/videoComments/${idVideo}`, {
        headers: { "Content-type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            message.error("server bận");
          } else return res.json();
        })
        .then((data) => {
          console.log("comment + video+ownerInfo:", data);
          setvideo_Owner_CommentsInfo(data);
          setISLoading(false);
        })
        .catch((err) => {
          message.error("Có lỗi xảy ra ");
          console.log(err);
        });
    } catch (error) {
      message.error("Có lỗi xảy ra ");
      console.log(error);
    }
    console.log(profileLocalstorage);
  }, [isLoading, reload]);

  if (isLoading) {
    return <Progress size={{ height: 2 }} percent={75} status={"normal"} />;
  }
  return (
    <div className={clsx(Styles.pagesComment)}>
      <div className={Styles.videoContainer}>
        <ReactPlayer
          controls
          className={Styles.reactPlayVideo}
          playing={true}
          width={"100%"}
          height={"100%"}
          url={video_Owner_CommentsInfo.video.path}
        />
      </div>

      <div className={clsx(Styles.video_Owner_Comments)}>
        <div className={clsx(Styles.video_Owner_CommentsInfo)}>
          <div
            onClick={() =>
              Navigate(`/profile/${video_Owner_CommentsInfo.ownerInfo.author}`)
            }
            className={clsx(Styles.ownerInfo)}
          >
            <Avatar
              size={50}
              src={video_Owner_CommentsInfo.ownerInfo.profilePhoto.path}
            />
            <h3> {video_Owner_CommentsInfo.ownerInfo.name}</h3>
          </div>
          <div className={clsx(Styles.videoInfo)}>
            <h3 style={{ color: "gray" }}>
              Tên video:{video_Owner_CommentsInfo.video.nameVideo}
            </h3>
            <div style={{ display: "flex", color: "gray" }}>
              Thể loại:
              {video_Owner_CommentsInfo.video.genres.map((genre, index) => (
                <u style={{ color: "blue" }} key={index}>
                  {genre}
                </u>
              ))}
            </div>
            <p style={{ color: "gray" }}>
              Lứa tuổi phù hợp: {video_Owner_CommentsInfo.video.limitedAge}
            </p>
          </div>
        </div>
        <CommentSection
          currentUser={
            profileLocalstorage && {
              currentUserId: profileLocalstorage.author,
              currentUserImg: profileLocalstorage.profilePhoto.path,
              currentUserProfile: `/profile/${profileLocalstorage.author}`,
              currentUserFullName: profileLocalstorage.name,
            }
          }
          setIsReload={setIsReload}
          commentData={video_Owner_CommentsInfo.videoComments}
          idVideo={video_Owner_CommentsInfo.video._id}
          avaiable={video_Owner_CommentsInfo.videoComments}
          profileLocalstorage={profileLocalstorage}
          setvideo_Owner_CommentsInfo={setvideo_Owner_CommentsInfo}
        />
      </div>
    </div>
  );
}

export default VideoComments;
