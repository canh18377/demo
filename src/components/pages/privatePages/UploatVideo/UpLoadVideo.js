import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import Styles from "./upload.module.scss";
import { Checkbox, message, Radio } from "antd";
import { SharedData } from "../../../Layout/DefaultLayout";
const UploadVideo = () => {
  const [infoVideoUpload, setInforVideoUpload] = useState({
    fileVideo: "",
    nameVideo: "",
    limitedAge: "tất cả các độ tuổi",
  });
  const [genres, setGenre] = useState(["Video"]);
  const [previewVideo, setPreviewVideo] = useState("");
  const { profileInfo } = useContext(SharedData);
  const handleUpload = (event) => {
    event.preventDefault();

    if (infoVideoUpload.nameVideo.trim() === "") {
      message.warning("Hãy nhập tên Video");
      return;
    }
    if (!infoVideoUpload.fileVideo) {
      message.warning(" Bạn chưa chọn Video nào");
      return;
    }
    console.log(genres);
    const form = new FormData();
    form.append("fileVideo", infoVideoUpload.fileVideo);
    form.append("nameVideo", infoVideoUpload.nameVideo);
    form.append("genres", JSON.stringify(genres));
    form.append("limitedAge", infoVideoUpload.limitedAge);
    try {
      fetch(`http://localhost:8080/uploadVideo/${profileInfo.author}`, {
        method: "POST",
        body: form,
      })
        .then((res) => {
          if (!res.ok) {
            message.error("server bận");
            console.log("erre");
          } else return res.json();
        })
        .then((data) => {
          if (data.err) {
            message.error(data.err);
          } else message.success(data.success);
        })
        .catch((err) => {
          message.error("Có lỗi xảy ra");
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra");
    }
  };

  const handleChecked = (e) => {
    setGenre((pre) => {
      if (genres.includes(e.target.value)) {
        return pre.filter((category) => category !== e.target.value);
      } else return [...pre, e.target.value];
    });
  };

  function convertVideo(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const link = URL.createObjectURL(file);
      setInforVideoUpload({ ...infoVideoUpload, fileVideo: file });
      setPreviewVideo(link);
      e.target.value = "";
    } else {
      console.log("no file");
    }
  }
  const Category = [
    "Video âm nhạc",
    "Phim ngắn",
    "Phim tài liệu",
    "Vlog",
    "Video hướng dẫn",
    "Phim hài",
    "Video thử thách",
    "Video mở hộp",
    "Video nấu ăn",
    "Video chơi game",
    "Video đánh giá sản phẩm",
    "Video chia sẻ kỹ năng",
    "Video phỏng vấn",
    "Video kể chuyện",
    "Hoạt hình",
    "Bản tin",
    "Video du lịch",
    "Video tự làm",
    "Video thể hình",
    "Video truyền cảm hứng",
  ];
  useEffect(() => {
    return () => URL.revokeObjectURL(previewVideo);
  });
  const age = ["0-9", "10-16", "trên 18", "tất cả các độ tuổi"];
  return (
    <div className={clsx(Styles.formUpload)}>
      <h1>Upload Video</h1>
      <form onSubmit={handleUpload}>
        <div className={clsx(Styles.content)}>
          <div className={clsx(Styles.input)}>
            <div className={clsx(Styles.inputUpload)}>
              <div className={clsx(Styles.custom_file_upload)}>
                <input
                  id="file-upload"
                  type="file"
                  accept="video/*"
                  onChange={convertVideo}
                />
                <label htmlFor="file-upload">
                  {infoVideoUpload.fileVideo === ""
                    ? "Chọn video"
                    : infoVideoUpload.fileVideo.name}
                </label>
              </div>
              {infoVideoUpload.fileVideo && (
                <video
                  className={clsx(Styles.previewVideo)}
                  controls
                  muted
                  autoPlay={true}
                  src={previewVideo}
                />
              )}
            </div>
            <input
              className={clsx(Styles.inputName)}
              placeholder="Video name"
              onChange={(e) =>
                setInforVideoUpload({
                  ...infoVideoUpload,
                  nameVideo: e.target.value,
                })
              }
            />
            <div className="radio">
              {age.map((age, index) => {
                return (
                  <Radio
                    checked={age === infoVideoUpload.limitedAge}
                    value={age}
                    onChange={(e) =>
                      setInforVideoUpload({
                        ...infoVideoUpload,
                        limitedAge: e.target.value,
                      })
                    }
                    key={index}
                  >
                    {age}
                  </Radio>
                );
              })}
            </div>
          </div>
          <div className={clsx(Styles.categories)}>
            {Category.map((genre, index) => {
              return (
                <Checkbox
                  className={clsx(Styles.inputCheckbox)}
                  value={genre}
                  onChange={handleChecked}
                  checked={genres.includes(genre)}
                  key={index}
                >
                  {genre}
                </Checkbox>
              );
            })}
          </div>
          <div
            style={{ display: "flex", flex: 1, flexDirection: "row-reverse" }}
          >
            <input
              style={{
                cursor: "pointer",
                width: 150,
                height: 40,
                borderRadius: 10,
                backgroundColor: "green",
              }}
              type="submit"
              value={"Tải lên"}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;
