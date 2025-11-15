import { fadeInModal } from "animations";
import { motion } from "framer-motion";
import { useState } from "react";
import { checkMarkSvg, deleteSvg } from "svg";

function PinEntry({setEmployee, text}){
    const [pin, setPin] = useState("");
    const [isError, setError] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

    const pinMap = {
        "22" : "Quinn",
        "16" : "Teague",
        "00" : "Denise",
        "17" : "Miguel",
        "3" : "Juan"
    }
    
    const onSubmit = () => {
        if(pin in pinMap) setEmployee(pinMap[pin])
        else {
            setPin("")
            setError(true);
        } 
    }
      
    const pinButton = (num) =>{
        const handleClick = () => {
            if(isError) setError(false)
            setPin(`${pin}${num}`);
            setActiveButton(num);
            setTimeout(() => setActiveButton(null), 150); 
        };

        return(
            <div 
            className={`pin-button ${activeButton === num ? 'active' : ''}`} 
            onClick={() => handleClick()}>
                {num}
            </div>
        )
    }

    const deleteButton = () => {
    return(
        <div 
            className="pin-button" 
            onClick={() => setPin(pin.slice(0, -1))}
        >
            {deleteSvg()}
        </div>
        )
    }

    const submitButton = () => {
    return(
        <div 
            className="pin-button" 
            onClick={onSubmit}
            style={{ background: "var(--gold)", color: "var(--black)" }}
        >
            {checkMarkSvg()}
        </div>
    )
    }

    const pinDisplay = () => {
        if(isError) return(
            <div style={{height: "50px", display: "flex", justifyContent: "center", alignItems: 'center', gap: "10px", color: 'var(--red)', fontSize: '24px'}}> 
                Incorrect Pin
            </div>
        ) 
        if(pin.length === 0) return(
            <div style={{height: "50px", fontWeight: '600', display: "flex", justifyContent: "center", alignItems: 'center', gap: "10px", fontSize: '24px'}}> 
                Enter your pin
            </div>
        ) 
        return(
            <div style={{height: "50px", display: "flex", justifyContent: "center", alignItems: 'center', gap: "10px"}}> 
                {pin.split('').map((_, i) => <div key={i} className="pin-dot" />)}
            </div>
        )
    }


    return(
        <motion.div className="res-modal-container pin-entry" style={{gap: '2rem', paddingBottom: '4rem'}} {...fadeInModal} onClick={(e) => e.stopPropagation()}>
            <div style={{display: "flex", flexDirection: 'column'}}> 
                <div style={{marginInline: 'auto', fontSize: '20px'}}> {text} </div>
                {pinDisplay()}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: "center", gap: "20px"}}> 
                <div style={{display: 'grid', width: "340px", gridTemplate: "1fr 1fr 1fr / 1fr 1fr 1fr", gap: "20px"}}>
                {[...Array(9)].map((_, i) => pinButton(i + 1))}
                {deleteButton()}
                {pinButton(0)}
                {submitButton()}
                </div>
            </div>

        </motion.div>
    )
}

export default PinEntry;