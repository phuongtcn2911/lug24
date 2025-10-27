import PropTypes from "prop-types";
import "./AnimatedButton.css"


function AnimatedButton({imgLink,color,children,clickEvent}) {

    return (
        <>
            <button className={`buttonWithTextAndImg ${color}`} 
            onClick={clickEvent}>
                <img src={imgLink}></img>
                <span>{children}</span>
            </button>
        </>
    );
}

AnimatedButton.propTypes = {
    imgLink: PropTypes.string.isRequired,
    color: PropTypes.string
}

export default AnimatedButton;