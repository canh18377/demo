import clsx from "clsx";
import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import ReactPlayer from "react-player";
import {
  HeartFilled,
  CommentOutlined,
  PlayCircleOutlined,
  MutedOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Avatar, message, Slider } from "antd";
import { useNavigate } from "react-router-dom";
import Styles from "../videos.module.scss";
import { SharedData } from "../../../Layout/DefaultLayout";
let timeout;
let timeoutCLick;
let timeoutVolume;

const debounce = (callback, delay) => {
  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      callback();
      timeout = null;
    }, delay);
  };
};
function Following() {
  const { isLoged, setIsModelOpen, setLikedVideo, likedVideo } =
    useContext(SharedData);
  const Navigate = useNavigate();
  const videoContainerRef = useRef();
  const [videoUrl, setVideoUrl] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [videoFollowing, setVideoFollowing] = useState({
    ArrayVideos: [],
    infoOwner: [],
  });
  const [isMutedVolume, setIsMutedVolume] = useState(true);
  const [volume, setVolume] = useState(1);
  const [visibleVolumeBar, setVisibleVolumeBar] = useState(null);
  const videoLengthRef = useRef(0);
  const [likeTotal, setLikeTotal] = useState([]);
  const profileInfoLocal = useMemo(() => {
    var profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
    return profileInfoLocal;
  }, [isLoged]);

  useEffect(() => {
    getVideo();
  }, [isLoged]);

  const getVideo = useCallback(() => {
    let APIUrl = "http://localhost:8080";
    const lastVideo = videoLengthRef.current;
    if (isLoged) {
      APIUrl = `http://localhost:8080/following/${profileInfoLocal.author}/${lastVideo}`;
    }
    fetch(APIUrl, {
      headers: { "Content-type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          message.error("server bận!");
        } else return res.json();
      })
      .then((data) => {
        if (data.Notification) {
          message.info(data.Notification);
          return;
        }
        console.log(data);
        if (data.Notification) {
          message.info(data.Notification);
          return;
        }
        if (isLoged) {
          if (data.ArrayVideos.length === 0) {
            message.info("Bạn chưa theo dõi ai!!");
            return;
          }
        }
        setVideoFollowing((prev) => ({
          ...prev,
          infoOwner: [...prev.infoOwner, ...data.infoOwner],
          ArrayVideos: [...prev.ArrayVideos, ...data.ArrayVideos],
        }));
        setLikeTotal((prev) => [
          ...prev,
          ...data.ArrayVideos.map((video) => ({
            idVideo: video._id,
            likes: video.likes,
          })),
        ]);
      })
      .catch((err) => {
        console.log(err);
        message.error("server bận");
      });
  }, [isLoged, videoFollowing.ArrayVideos]);
  useEffect(() => {
    console.log(videoFollowing.ArrayVideos);
    videoFollowing.ArrayVideos.forEach((video, index) => {
      videoUrl[index] = video.path;
    });
    console.log(likeTotal);
    videoLengthRef.current = videoFollowing.ArrayVideos.length;
  }, [videoFollowing.ArrayVideos]);

  const sendList_likeVideo = useCallback(
    async (idVideo) => {
      const likePerson = isLoged && profileInfoLocal.author;
      try {
        const response = await fetch(`http://localhost:8080/likeVideos`, {
          method: "POST",
          body: JSON.stringify({ idVideo, likePerson }),
          headers: { "Content-type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("network response is fail");
        }
        const data = await response.json();
        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          console.log(likeTotal);
          setLikeTotal((pre) =>
            pre.map((obj) => {
              if (obj.idVideo === data._id) {
                return {
                  ...obj,
                  likes: data.likes,
                };
              } else return obj;
            })
          );
        }
      } catch (error) {
        console.error("Failed to send like videos:", error);
      }
    },
    [isLoged, likeTotal]
  );

  const handleTym = useCallback(
    (idVideo) => {
      sendList_likeVideo(idVideo);
      if (!isLoged) {
        setIsModelOpen(true);
        return;
      } else {
        setLikedVideo((prev) => {
          if (prev.includes(idVideo)) {
            return likedVideo.filter((id) => {
              return id !== idVideo;
            });
          } else return [...prev, idVideo];
        });
      }
    },
    [isLoged, likedVideo]
  );

  //check position
  const checkPosition = () => {
    if (videoContainerRef.current) {
      const arrayVideo = Array.from(videoContainerRef.current.children);
      arrayVideo.forEach((child) => {
        const position = child.getBoundingClientRect();
        if (position.top >= 0 && position.bottom <= window.innerHeight) {
          setCurrentVideo(Number.parseInt(child.getAttribute("data-index")));
          if (
            Number.parseInt(child.getAttribute("data-index")) ===
            videoFollowing.ArrayVideos.length - 1
          ) {
            if (
              videoFollowing.ArrayVideos.length < 5 &&
              videoFollowing.ArrayVideos.length > 0
            ) {
              if (videoFollowing.ArrayVideos.length === 1) {
                return;
              }
              message.info("Đã hết video , Hãy theo dõi thêm!!");
            } else {
              message.loading("Đang tải thêm video,vui lòng đợi");
              getVideo();
            }
          }
        }
      });
    }
  };
  const debounceHandleScroll = debounce(checkPosition, 500);
  useEffect(() => {
    if (videoContainerRef.current) {
      const container = videoContainerRef.current;
      container.addEventListener("scroll", debounceHandleScroll);
      return () => {
        container.removeEventListener("scroll", debounceHandleScroll);
      };
    }
  }, [videoFollowing]);
  //click video
  function handleClickVideo(index, idVideo) {
    if (timeoutCLick) {
      clearTimeout(timeoutCLick);
      handleTym(idVideo);
      timeoutCLick = null;
      return;
    }
    timeoutCLick = setTimeout(() => {
      setCurrentVideo((prev) => {
        if (prev === index) {
          return null;
        } else return index;
      });
      timeoutCLick = null;
    }, 500);
  }
  //volume
  const handleVisibleVolume = (e) => {
    e.stopPropagation();
    setIsMutedVolume((pre) => !pre);
  };
  useEffect(() => {
    if (timeoutVolume) {
      clearTimeout(timeoutVolume);
    }
    timeoutVolume = setTimeout(() => {
      setVisibleVolumeBar(false);
    }, 4000);
    return () => clearTimeout(timeoutVolume);
  }, [volume, visibleVolumeBar]);

  if (videoFollowing.length === 0) {
    return;
  }
  return (
    <div className={clsx(Styles.container)} ref={videoContainerRef}>
      {videoFollowing.ArrayVideos.map((video, index) => {
        return (
          <div
            key={index}
            data-index={index}
            className={clsx(Styles.containerVideo)}
          >
            <div
              onClick={() => handleClickVideo(index, video._id)}
              className={clsx(Styles.content)}
            >
              <ReactPlayer
                loop={true}
                playing={currentVideo === index}
                width={"100%"}
                height={"100%"}
                url={videoUrl[index]}
                className={clsx(Styles.video)}
              />
              {currentVideo !== index && (
                <div className={clsx(Styles.postponeVideo)}>
                  <PlayCircleOutlined style={{ fontSize: 30 }} />
                </div>
              )}
              <div className={clsx(Styles.volume)}>
                {isMutedVolume ? (
                  <MutedOutlined onClick={(e) => handleVisibleVolume(e)} />
                ) : (
                  <div className={clsx(Styles.setVolume)}>
                    <SoundOutlined
                      onMouseOver={() => setVisibleVolumeBar(true)}
                      onClick={(e) => handleVisibleVolume(e)}
                    />
                    {visibleVolumeBar && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Slider
                          min={0}
                          max={1}
                          step={0.05}
                          className={clsx(Styles.volumeBar)}
                          value={volume}
                          range={false}
                          onChange={(e) => setVolume(e)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={clsx(Styles.actionItemContainer)}>
              <div style={{ position: "relative" }}>
                <Avatar
                  className={clsx(Styles.avatar)}
                  onClick={() => Navigate(`/profile/${video.author}`)}
                  src={
                    videoFollowing.infoOwner.find((profile) => {
                      return profile.author === video.author;
                    }).path
                  }
                />
              </div>
              <HeartFilled
                onClick={() => handleTym(video._id)}
                className={clsx(Styles.heartVideo, {
                  [Styles.likedVideo]: likedVideo.includes(video._id),
                })}
              />
              <p className={clsx(Styles.totalOfLike)}>
                {likeTotal.find((item) => item.idVideo === video._id)?.likes}
              </p>

              <CommentOutlined
                className={clsx(Styles.commentVideo)}
                onClick={() => Navigate(`/videoComments/${video._id}`)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Following;
