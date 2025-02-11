import clsx from "clsx";
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
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
import HandleFollow from "./handleFollwing/HandleFollow";
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
function Home() {
  const { isLoged, setIsModelOpen, setLikedVideo, likedVideo } =
    useContext(SharedData);
  const Navigate = useNavigate();
  const videoContainerRef = useRef();
  const [isMutedVolume, setIsMutedVolume] = useState(true);
  const [volume, setVolume] = useState(1);
  const [visibleVolumeBar, setVisibleVolumeBar] = useState(null);
  const [videoUrl, setVideoUrl] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [videoHome, setVideoHome] = useState({
    ArrayVideos: [],
    infoOwner: [],
  });
  const [likeTotal, setLikeTotal] = useState([]);
  const [listFollow, setListFollow] = useState([]);
  const profileInfoLocal = useMemo(() => {
    var profileInfoLocal = JSON.parse(localStorage.getItem("profileInfo"));
    return profileInfoLocal;
  }, [isLoged]);
  useEffect(() => {
    getVideo();
  }, []);
  useEffect(() => {
    if (videoHome.ArrayVideos.length !== 0) {
      const idVideo = videoHome.ArrayVideos.map((video) => video._id).join(",");
      console.log(idVideo);
      try {
        fetch(
          `http://localhost:8080/likedVideoHome/${
            profileInfoLocal && profileInfoLocal.author
          }/${idVideo}`,
          {
            headers: { "Content-type": "application/json" },
          }
        )
          .then((res) => {
            if (!res.ok) {
              message.error("server bận!");
            } else return res.json();
          })
          .then((data) => {
            console.log("data", data);
            setLikeTotal(
              data.map((video) => ({
                idVideo: video._id,
                likes: video.likes,
                mySelf:
                  profileInfoLocal &&
                  video.likeBy.includes(profileInfoLocal.author),
              }))
            );
          })
          .catch((err) => {
            console.log(err);
            message.error("server bận");
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [profileInfoLocal, videoHome.ArrayVideos]);

  const getVideo = useCallback(() => {
    try {
      fetch(`http://localhost:8080`, {
        headers: { "Content-type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            message.error("server bận!");
          } else return res.json();
        })
        .then((data) => {
          console.log("data", data);
          setVideoHome((prev) => ({
            ...prev,
            infoOwner: [...prev.infoOwner, ...data.infoOwner],
            ArrayVideos: [...prev.ArrayVideos, ...data.ArrayVideos],
          }));
        })
        .catch((err) => {
          console.log(err);
          message.error("server bận");
        });
    } catch (error) {
      console.log(error);
    }
  }, [videoHome, likeTotal, isLoged]);
  useEffect(() => {
    videoHome.ArrayVideos.forEach((video, index) => {
      videoUrl[index] = video.path;
    });
    console.log(likeTotal);
    if (isLoged) {
      setLikedVideo(
        likeTotal
          .map((likedVideo) => {
            if (likedVideo.mySelf) return likedVideo.idVideo;
            return null; // Trả về null nếu điều kiện không thỏa mãn.
          })
          .filter(Boolean) // Loại bỏ các giá trị null hoặc undefined.
      );
    }
  }, [videoHome, likeTotal, isLoged]);

  const sendList_likeVideo = useCallback(
    async (idVideo) => {
      const likePerson = isLoged && profileInfoLocal && profileInfoLocal.author;
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
          setLikeTotal((pre) =>
            pre.map((obj) => {
              if (obj.idVideo === data._id) {
                return {
                  ...obj,
                  likes: data.likes,
                  mySelf:
                    profileInfoLocal &&
                    data.likeBy.includes(profileInfoLocal.author),
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
    [isLoged, likedVideo, likeTotal]
  );
  // Lay list follow
  useEffect(() => {
    if (!isLoged) {
      return;
    }
    try {
      fetch(
        `http://localhost:8080/listFollow/${
          profileInfoLocal && profileInfoLocal.author
        }`,
        {
          headers: { "Content-type": "application/json" },
        }
      )
        .then((res) => {
          if (!res.ok) {
            message.error("server bận");
          } else
            return res.json().then((data) => {
              console.log(data);
              setListFollow(data ? data : []);
            });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [isLoged]);
  // hiển thị,lưu trữ follow tạm thời
  const changeFollower = useCallback(
    (author) => {
      setListFollow((pre) => {
        if (pre.includes(author)) {
          return pre.filter((id) => id !== author);
        } else return [...pre, author];
      });
    },
    [listFollow]
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
            videoHome.ArrayVideos.length - 1
          ) {
            if (videoHome.ArrayVideos.length < 5) {
              if (videoHome.ArrayVideos.length === 1) {
                return;
              }
              message.info("Đã hết video , Hãy tải thêm video của bạn !");
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
    checkPosition();
    if (videoContainerRef.current) {
      const container = videoContainerRef.current;
      container.addEventListener("scroll", debounceHandleScroll);
      return () => {
        container.removeEventListener("scroll", debounceHandleScroll);
      };
    }
  }, [videoHome]);
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
  const handleVisibleVolume = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMutedVolume((pre) => !pre);
    },
    [isMutedVolume]
  );
  useEffect(() => {
    if (timeoutVolume) {
      clearTimeout(timeoutVolume);
    }
    timeoutVolume = setTimeout(() => {
      setVisibleVolumeBar(false);
    }, 4000);
    return () => clearTimeout(timeoutVolume);
  }, [volume, visibleVolumeBar]);

  if (videoHome.ArrayVideos.length === 0) {
    return;
  }
  return (
    <div className={clsx(Styles.container)} ref={videoContainerRef}>
      {videoHome.ArrayVideos.map((video, index) => {
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
                muted={isMutedVolume}
                volume={volume}
                playing={currentVideo === index}
                loop={true}
                width={"100%"}
                height={"100%"}
                url={videoUrl[index]}
                className={clsx(Styles.video)}
              />
              {currentVideo !== index && (
                <div className={clsx(Styles.postponeVideo)}>
                  <PlayCircleOutlined
                    style={{ height: "100%", width: "100%" }}
                  />
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
                    videoHome.infoOwner.find((profile) => {
                      return profile.author === video.author;
                    }).path
                  }
                />
                <div className={clsx(Styles.follow_followed)}>
                  {profileInfoLocal &&
                    profileInfoLocal.author !== video.author && (
                      <HandleFollow
                        isLoged={isLoged}
                        profileInfoLocal={profileInfoLocal}
                        author={video.author}
                        changeFollower={changeFollower}
                        listFollow={listFollow}
                        setIsModelOpen={setIsModelOpen}
                      />
                    )}
                </div>
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
export default Home;
