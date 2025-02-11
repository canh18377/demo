import { useState, memo } from "react";
import { Modal, Button, notification } from "antd";
import clsx from "clsx";
import Styles from "./buttonlogin.module.scss";
import Select from "./loginSelect/Select";
import ContinuteNumber from "./loginSelect/ContinuteNumber/ContinuteNumber";
import SignUp from "./formSignUp/SignUp";
import PagePersional from "../profileIcon/PagePersional";
function ButtonLogIn({
  profileInfo,
  setProfileInfo,
  isLoged,
  setIsLoged,
  isModelOpen,
  setIsModelOpen,
}) {
  const [isOpenLogIn, setIsOpenLogIn] = useState(false);
  const [account, setaccount] = useState({ name: "", password: "" });
  const [isLogIn, setIsLogIn] = useState(true);
  const handleCloseModal = () => {
    setIsOpenLogIn(false);
    setIsModelOpen(false);
    notification.success({
      description: "welcom to MyFilms",
      duration: 2.5,
      showProgress: true,
      placement: "topRight",
    });
  };
  return (
    <div>
      <div>
        <Modal
          centered
          width={"450px"}
          onCancel={() => setIsModelOpen(false)}
          open={isModelOpen}
          footer={null}
        >
          <div className={clsx(Styles.contentLogIn)}>
            <div>
              <h1>Log in to MyFilms</h1>
            </div>
            <div className={clsx(Styles.selects)}>
              <Select
                onclick={() => setIsOpenLogIn(true)}
                url="/avatarLogin.jpg"
                content="UsePhone/Email/Username"
              />
              <Select
                onclick={() => setIsOpenLogIn(true)}
                url="/avatarLogin.jpg"
                content="UsePhone/Email/Username"
              />{" "}
              <Select
                onclick={() => setIsOpenLogIn(true)}
                url="/avatarLogin.jpg"
                content="UsePhone/Email/Username"
              />{" "}
              <Select
                onclick={() => setIsOpenLogIn(true)}
                url="/avatarLogin.jpg"
                content="UsePhone/Email/Username"
              />{" "}
              <Select
                onclick={() => setIsOpenLogIn(true)}
                url="/avatarLogin.jpg"
                content="UsePhone/Email/Username"
              />{" "}
              <Select
                onclick={() => setIsOpenLogIn(true)}
                url="/avatarLogin.jpg"
                content="UsePhone/Email/Username"
              />
            </div>
            <footer>
              <p>
                By continuing with an account located in Vietnam, yoem agree to
                our Terms of Service and acknowledge that you have read our
                Privacy Policy.
              </p>
            </footer>
            <hr />
            Don’t have an account?
            <em
              onClick={() => {
                setIsOpenLogIn(true);
                setIsLogIn(false);
              }}
              style={{ cursor: "pointer", color: "red" }}
            >
              {" "}
              Sign up
            </em>
          </div>
        </Modal>
        <Modal
          centered
          width={"450px"}
          onCancel={() => setIsOpenLogIn(false)}
          open={isOpenLogIn}
          footer={null}
        >
          {isLogIn ? (
            <ContinuteNumber
              setprofileInfo={setProfileInfo}
              profileInfo={profileInfo}
              handleCloseModal={handleCloseModal}
              setIsLoged={setIsLoged}
              account={account}
              setaccount={setaccount}
              setIsLogIn={setIsLogIn}
            />
          ) : (
            <SignUp setIsLogIn={setIsLogIn} />
          )}
        </Modal>
      </div>
      {isLoged ? (
        <PagePersional
          isLoged={isLoged}
          setIsLoged={setIsLoged}
          profileInfo={profileInfo}
        />
      ) : (
        <Button
          onClick={() => setIsModelOpen(true)}
          className={clsx(Styles.logIn)}
        >
          Đăng Nhập
        </Button>
      )}
    </div>
  );
}
export default memo(ButtonLogIn);
