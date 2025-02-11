import clsx from "clsx";
import Styles from "./formSignUp.module.scss";
import { Button, message } from "antd";
import { useState } from "react";

function SignUp({ setIsLogIn }) {
  const [account, setAccount] = useState({ name: "", password: "" });
  const handleSignUp = async (event) => {
    event.preventDefault();

    if ((account.name === "") | (account.password === "")) {
      message.warning("Vui lòng nhập đủ thông tin");
      return;
    }
    if (account.password.length < 8) {
      message.warning("Mật khẩu phải tối thiểu 8 ký tự ");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/account/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      if (!response.ok) {
        return message.error("server bận");
      }
      const data = await response.json();
      if (data.success) {
        message.success(data.success);
        setIsLogIn(true);
      } else message.error(data.fail);
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };
  return (
    <div className={clsx(Styles.formSignUp)}>
      <h1>SignUp</h1>
      <form onSubmit={handleSignUp}>
        <div className={clsx(Styles.input)}>
          <input
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
            className={clsx(Styles.inputName)}
            placeholder="Account"
            type="email"
          />
          <input
            value={account.password}
            type="password"
            onChange={(e) =>
              setAccount({ ...account, password: e.target.value })
            }
            className={clsx(Styles.inputPassword)}
            placeholder="Password"
          />
        </div>
        <div className={clsx(Styles.buttonForm)}>
          <Button
            className={clsx(Styles.buttonSignUP)}
            htmlType="submit"
            type="primary"
          >
            Sign UP
          </Button>
        </div>
        <div>
          <hr />
          <p>
            Do have an account?
            <u
              onClick={() => setIsLogIn(true)}
              style={{ color: "red", cursor: "pointer" }}
            >
              {" "}
              Log In
            </u>
          </p>
        </div>
      </form>
    </div>
  );
}
export default SignUp;
