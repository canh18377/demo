import clsx from "clsx";
import Styles from "./continuteNumber.module.scss";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

function ContinuteNumber({
  account,
  setaccount,
  setIsLogIn,
  setIsLoged,
  handleCloseModal,
  setprofileInfo,
}) {
  const Navigate = useNavigate();

  const HandleSubmit = async (event) => {
    event.preventDefault();
    if (account.name.trim() === "" || account.password.trim() === "") {
      message.error("Hãy nhập đầy đủ thông tin");
      return;
    }
    const APIUser = "http://localhost:8080/account";
    try {
      const response = await fetch(APIUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        message.error("Server bận, thử lại sau");
        return;
      }

      const data = await response.json();

      if (data.Token) {
        message.success(data.message);
        localStorage.setItem("jwtToken", JSON.stringify(data.Token));
        Navigate("/");
        setIsLoged(true);
        handleCloseModal(false);
        setprofileInfo(data.profileInfo);
        localStorage.setItem("profileInfo", JSON.stringify(data.profileInfo));
      } else {
        message.error("Sai thông tin đăng nhập");
      }
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  return (
    <form onSubmit={HandleSubmit}>
      <div className={clsx(Styles.containerLogin)}>
        <h1>LogIn</h1>
        <input
          id="name"
          value={account.name}
          className={clsx(Styles.account)}
          placeholder="Account"
          onChange={(e) => setaccount({ ...account, name: e.target.value })}
        />

        <input
          id="password"
          value={account.password}
          className={clsx(Styles.account)}
          placeholder="Password"
          type="password"
          onChange={(e) => setaccount({ ...account, password: e.target.value })}
        />
      </div>
      <div className={clsx(Styles.containerButton)}>
        <Button htmlType="submit" className={Styles.buttonLogIn}>
          <span>Log In</span>
        </Button>
      </div>
      <div className={clsx(Styles.footer)}>
        <hr />
        <p>
          Don’t have an account?
          <u
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => setIsLogIn(false)}
          >
            {" "}
            Sign up
          </u>
        </p>
      </div>
    </form>
  );
}

export default ContinuteNumber;
