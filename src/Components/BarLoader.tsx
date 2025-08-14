import classes from "./BarLoader.module.css"; 

function BarLoader({w = "100%", h = "5px", borderRadius = "0px"}) {
    return (
        <div className={classes["loader-wrapper"]} style={{width: w, height: h, borderRadius: borderRadius}}>
            <div className={classes.loader}>

            </div>
        </div>
    )
}

export default BarLoader;