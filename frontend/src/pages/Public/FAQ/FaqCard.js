import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, fadeInDown } from "animations";
import { plusSvg } from "svg";

export default function FaqCard({faq}){
    const [open, setOpen] = useState(false)

    return(
        <motion.div layout {...fadeIn}        
         className="faq-container"onClick={() => setOpen(!open)}>
            <motion.div layout className="faq-topper"> 
           <motion.div  className="hero-text faq-a"> {faq.q} </motion.div> 
            <div className={`faq-plus ${open && "faq-plus-open"}`}> 
                <div className="line vl"/>
                <div className="line lhl"/>
            </div>
            </motion.div>
           {open &&
           <motion.p {...fadeInDown} layout="position" > {faq.a} </motion.p>
           }
        </motion.div>
    )

}