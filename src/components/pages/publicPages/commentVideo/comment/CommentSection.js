import clsx from "clsx";
import Styles from "./comment.module.scss";
import { Avatar, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ActionComment from "./actionComment/ActionComment";
function CommentSection({
  currentUser,
  commentData,
  idVideo,
  avaiable,
  profileLocalstorage,
  setIsReload,
}) {
  const like_disLike_List_Ref = useRef();
  const Navigate = useNavigate();
  const [contentComment, setContentComment] = useState(
    profileLocalstorage && {
      userId: currentUser.currentUserId,
      idVideo: idVideo,
      fullName: currentUser.currentUserFullName,
      userProfile: currentUser.currentUserProfile,
      text: "",
      avatarUrl: currentUser.currentUserImg,
      replies: [],
    }
  );
  const [like_disLike_List, setLike_disLike_List] = useState(() => {
    try {
      const like_disLike_ListLocal = localStorage.getItem(
        "like_disLike_ListLocal"
      );
      if (like_disLike_ListLocal) {
        return JSON.parse(like_disLike_ListLocal);
      } else return { like: [], disLike: [] };
    } catch (error) {
      return { like: [], disLike: [] };
    }
  });

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };

  const handleStoreComments = async (event) => {
    event.preventDefault();
    if (contentComment.text.trim() === "") {
      message.warning("Bạn chưa nhập gì!");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/videoComments/storeComment",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(contentComment),
        }
      );

      if (!response.ok) {
        message.error("server bận");
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setContentComment({ ...contentComment, text: "" });
      setIsReload((prev) => !prev);
      console.log("new comment", data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(like_disLike_List);
    like_disLike_List_Ref.current = like_disLike_List;
    localStorage.setItem(
      "like_disLike_ListLocal",
      JSON.stringify(like_disLike_List)
    );
  }, [like_disLike_List]);

  const sendList_Dis_Like = (like_disLike_List) => {
    const url = "http://localhost:8080/videoComments/dis_likeComment";
    const formData = new FormData();
    formData.append("like_disLike_List", JSON.stringify(like_disLike_List));
    navigator.sendBeacon(url, formData);
  };
  useEffect(() => {
    return () => {
      console.log("đã mount");
      console.log(like_disLike_List_Ref.current);
      sendList_Dis_Like(like_disLike_List_Ref.current);
      localStorage.removeItem("like_disLike_ListLocal");
    };
  }, []);
  return (
    <div className={clsx(Styles.commentPage)}>
      {profileLocalstorage === null ? (
        <p style={{ color: "red" }}>Hãy đăng nhập để viết bình luận........</p>
      ) : (
        <div className={clsx(Styles.currentUser)}>
          <div className={clsx(Styles.currentUser_Img)}>
            <Avatar size={30} src={currentUser && currentUser.currentUserImg} />
            <em style={{ color: "gray", fontSize: "small" }}>
              #{currentUser && currentUser.currentUserFullName}
            </em>
          </div>
          <form
            onSubmit={handleStoreComments}
            className={clsx(Styles.formComment)}
          >
            <input
              placeholder="Add Comment..."
              className={clsx(Styles.input)}
              value={contentComment.text}
              onChange={(e) =>
                setContentComment({ ...contentComment, text: e.target.value })
              }
            />

            <Button htmlType="submit" className={clsx(Styles.post)}>
              Add
            </Button>
          </form>
        </div>
      )}
      {avaiable.length === 0 ? (
        <h3 style={{ color: "gray" }}>Hãy là người đầu tiên đưa ra ý kiến!</h3>
      ) : (
        <div className={clsx(Styles.commentDatas)}>
          {commentData.map((comment, index) => {
            return (
              <div key={index} className={clsx(Styles.commentData)}>
                <div className={clsx(Styles.commenter)}>
                  <Avatar
                    onClick={() => Navigate(comment.userProfile)}
                    src={comment.avatarUrl}
                  />
                  <p>{comment.fullName}</p>
                  <p style={{ color: "gray" }}>
                    #{convertDate(comment.updatedAt)}
                  </p>
                </div>
                <div className={clsx(Styles.contentComment)}>
                  <p className={clsx(Styles.commentText)}>{comment.text}</p>
                  <div className={clsx(Styles.actionComment)}>
                    <ActionComment
                      setLike_disLike_List={setLike_disLike_List}
                      like_disLike_List={like_disLike_List}
                      idCommenter={comment.userId}
                      currentUser={currentUser}
                      contentComment={comment.text}
                      idComment={comment._id}
                      setIsReload={setIsReload}
                      replies={comment.replies}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={clsx(Styles.comments)}> </div>
    </div>
  );
}

export default CommentSection;
