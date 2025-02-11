import Styles from "../../sideBar.module.scss";
import clsx from "clsx";
function SideBarChildren(prop) {
  return (
    <div className={clsx(Styles.page)} onClick={() => prop.handle()}>
      <div className={clsx(Styles.icon)}> {prop.icon}</div>
      <span className={clsx(Styles.content)}>{prop.content}</span>
    </div>
  );
}
export default SideBarChildren;
