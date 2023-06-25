import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// function Test() {
//     const [rating, setRating] = useState(0);
//     return (
//         <div>
//             {/* this is in case we need access to the inner state */}
//             {/* onSetRating is very important prop as it links the outside state with the inside one */}
//             <StarRating color="blue" maxRating={10} onSetRating={setRating} defaultRating={0}/>
//             <p>This movie has rating of {rating}</p>
//         </div>
//     );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        {/*<Test/>*/}
        <App/>
    </React.StrictMode>
);