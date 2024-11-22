import React from "react"

export default function PopUp(props) {

    // const title = props.currTime < props.bestTime ? "You WOn!" : "You Lose!"; 

    let title;

        if(props.currSeconds  > 40 ){
    title ="Cubie Newbie";
        }
        else if (30 < props.currSeconds < 40){
          title = "Tumbler in  Training";
        }
        else if( 20 < props.currSeconds < 30) {
           title = "Rockin Roller";
        }
         else if(10 < props.currSeconds < 20){
             title = "Dice Dragon";
         }
         else if( props.currSeconds < 10){
           title = "TENZI Master";
         }

    return (
        <div>
        <h1 style={{ fontSize: "5rem"}}>{title}</h1>
        </div>
    )


}