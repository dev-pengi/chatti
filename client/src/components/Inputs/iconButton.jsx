const iconButton = ({ click, icon }) => {
    return (
        <button onClick={click} className="iconButton">
            {icon}
        </button>
    )
}

export default iconButton