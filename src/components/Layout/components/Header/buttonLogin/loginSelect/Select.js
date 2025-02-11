import clsx from "clsx"
import Styles from './select.module.scss'
const Select=(prop)=>{

    return(
        <div className={clsx(Styles.select)}
        onClick={()=>prop.onclick()}>
          <div>
          <img
            className={clsx(Styles.image)}
            src={prop.url}  />
          </div>
        <div className={clsx(Styles.content)}>
        <p>{prop.content}</p>
        </div>
        </div>
    )
}
export default Select