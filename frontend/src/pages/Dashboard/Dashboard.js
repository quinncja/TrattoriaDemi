import React, {useEffect, useState} from "react";
import { getReservations } from "../../api";

function Dashboard(){
    const [reservations, setReservations] = useState([]);

    async function loadReservations(){
        try{
            const response = await getReservations();
            console.log(response)
            setReservations(response.data)
        } catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
        loadReservations();
    }, [])


    if(reservations)
        return(
            <div>
                {reservations.map((reservation) => (
                    <div>
                        {reservation.name}
                    </div>
                ))}
            </div>
        )
    else
        return;
}

export default Dashboard;