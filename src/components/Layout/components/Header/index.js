import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Optional để thêm kiểu dáng
import Styles from "./header.module.scss";
import "tippy.js/themes/light.css";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { TikTokOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useRef, useContext } from "react";
import { Button } from "antd";
import ButtonLogIn from "./buttonLogin/ButtonLogIn";
import { SharedData } from "../../DefaultLayout";
function Header() {
  const [backGroundColor, setBackGroundColor] = useState(false);
  const navigate = useNavigate();
  const inputSearchRef = useRef();

  const {
    isLoged,
    setIsLoged,
    isModelOpen,
    setIsModelOpen,
    contentSearch,
    setContentSearch,
    history,
    setHistory,
    setProfileInfo,
    profileInfo,
  } = useContext(SharedData);
  const handleNavigate = () => {
    navigate("/");
  };
  const handleUpload = () => {
    isLoged ? navigate("/upload") : setIsModelOpen(true);
  };

  const handelClick = () => {
    document.body.style.backgroundColor = backGroundColor ? "white" : "black";
    setBackGroundColor(backGroundColor === false ? true : false);
  };
  const storeContentSearch = (e) => {
    setContentSearch(e);
  };
  const handleSearch = (event) => {
    event.preventDefault();
    setHistory((prev) => [...prev, contentSearch]);
    navigate("/search");
  };

  return (
    <div className={clsx(Styles.header)}>
      <div onClick={() => handleNavigate()} className={clsx(Styles.logoHeader)}>
        <TikTokOutlined className={clsx(Styles.iconHeader)} />
        <strong className={clsx(Styles.logoText)}>MyFilms</strong>
      </div>
      <Tippy
        interactive={true}
        theme="light"
        appendTo={document.body}
        content={history.map((item, index) => {
          return <p key={index}>{item}</p>;
        })}
      >
        <div
          onClick={() => {
            inputSearchRef.current.focus();
          }}
          className={clsx(Styles.searchHeader)}
          tabIndex={0}
        >
          <form onSubmit={handleSearch}>
            <input
              value={contentSearch}
              onChange={(e) => storeContentSearch(e.target.value)}
              tabIndex={0}
              ref={inputSearchRef}
              className={clsx(Styles.inputHeader)}
              placeholder="Tìm kiếm"
            />
            <input type="submit" style={{ display: "none" }} />
          </form>
        </div>
      </Tippy>
      {isLoged && (
        <div className={clsx(Styles.buttonUpload)}>
          <Button onClick={() => handleUpload()} danger type="primary">
            <span style={{ marginTop: 15 }}>
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L6 8h4v6h4V8h4L12 2z" />
              </svg>
            </span>
            <span>Upload</span>
          </Button>
        </div>
      )}

      <div className={clsx(Styles.sideAction)}>
        <ButtonLogIn
          isLoged={isLoged}
          setIsLoged={setIsLoged}
          isModelOpen={isModelOpen}
          setIsModelOpen={setIsModelOpen}
          profileInfo={profileInfo}
          setProfileInfo={setProfileInfo}
        />
      </div>
      <Tippy
        interactive={true}
        theme="light"
        appendTo={document.body}
        content={
          <div>
            <h2
              onClick={() => handelClick()}
              tabIndex={0}
              className={clsx(Styles.backGroundColor)}
            >
              Chế độ tối{" "}
              {backGroundColor && <span className={clsx(Styles.icon)}>✓</span>}{" "}
            </h2>
          </div>
        }
      >
        <MoreOutlined className={clsx(Styles.explore)} />
      </Tippy>
    </div>
  );
}
export default Header;
