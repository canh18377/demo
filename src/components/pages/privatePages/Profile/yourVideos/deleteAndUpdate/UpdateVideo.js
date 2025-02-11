import { ToolOutlined } from "@ant-design/icons";
import { message, Modal, Checkbox, Radio } from "antd";
import clsx from "clsx";
import Styles from "./update_delete.module.scss";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
function UpdateVideo(prop) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genres, setGenre] = useState(prop.genres);
  const [videoInfo, setvideoInfo] = useState({
    idVideo: prop.idVideo,
    nameVideo: prop.name,
    limitedAge: prop.limitedAge,
    genres: [],
  });
  useEffect(() => {
    setvideoInfo({ ...videoInfo, genres: genres });
  }, [genres]);
  console.log(prop);
  const handleUpdate = async () => {
    if (videoInfo.nameVideo.length > 21) {
      message.warning("Tên video chỉ tối đa 20 kí tự");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/profile/updateVideo",
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoInfo }),
          method: "PUT",
        }
      );
      if (!response.ok) {
        message.error("Server bận");
        throw new Error("server not res");
      }
      const data = await response.json();
      if (data.error) {
        message.error(data.error);
      } else {
        setIsModalOpen(false);
        prop.setDeleted_Updated((prev) => !prev);
        message.success(data.success);
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra, thử lại sau");
    }
  };
  const handleChecked = (e) => {
    setGenre((pre) => {
      if (genres.includes(e.target.value)) {
        return pre.filter((category) => category !== e.target.value);
      } else return [...pre, e.target.value];
    });
  };
  const Category = [
    "Video",
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
  const ages = ["0-9", "10-16", "trên 18", "tất cả các độ tuổi"];
  return (
    <div className="form update">
      <ToolOutlined
        onClick={() => setIsModalOpen(true)}
        style={{ color: "white", cursor: "pointer" }}
      />
      <Modal
        onOk={() => handleUpdate()}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className={clsx(Styles.formUpdate)}>
          <h1>Sửa thông tin video của bạn</h1>
          <div className={clsx(Styles.videoContainer)}>
            <ReactPlayer
              url={prop.path}
              height={"100%"}
              width={"100%"}
              controls
            />
          </div>
          <input
            className={clsx(Styles.inputNameVideo)}
            value={videoInfo.nameVideo}
            onChange={(e) =>
              setvideoInfo({ ...videoInfo, nameVideo: e.target.value })
            }
          />
          <div className="radio">
            {ages.map((age, index) => {
              return (
                <Radio
                  checked={age === videoInfo.limitedAge}
                  value={age}
                  onChange={(e) => {
                    setvideoInfo({ ...videoInfo, limitedAge: e.target.value });
                  }}
                  key={index}
                >
                  {age}
                </Radio>
              );
            })}
          </div>
        </div>
        <div className={clsx(Styles.categorys)}>
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
      </Modal>
    </div>
  );
}

export default UpdateVideo;
