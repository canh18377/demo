import { DeleteOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import { useState } from "react";
function DeleteVideo({ idVideo, name, setDeleted_Updated }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:8080/profile/deleteVideo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idVideo: idVideo }),
      });
      if (!res.ok) {
        message.error("server bận");
        throw new Error("server die");
      }
      const data = await res.json();
      if (data.error) {
        message.error(data.error);
      } else {
        message.success(data.success);
        setIsOpenModal(false);
        setDeleted_Updated((prev) => !prev);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra , thử lại sau");
      console.log(error);
    }
  };

  return (
    <>
      <DeleteOutlined
        onClick={() => setIsOpenModal(true)}
        style={{ color: "white", cursor: "pointer" }}
      />
      <Modal
        onCancel={() => setIsOpenModal(false)}
        mask={true}
        onOk={() => handleDelete()}
        open={isOpenModal}
      >
        <h3 style={{ color: "red", fontFamily: "monospace" }}>
          Bạn có chắc muốn xóa video vĩnh viễn video này ?{" "}
          <span style={{ color: "blue" }}> (Video:{name})</span>{" "}
        </h3>
      </Modal>
    </>
  );
}

export default DeleteVideo;
