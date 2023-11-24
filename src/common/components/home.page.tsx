import * as React from "react";
import { Link } from "react-router-dom";

function HomePage(): React.JSX.Element {
    return (
        <div>
            Home Atencion Ciudadana !!!!
            <Link to="/atencion-ciudadana/calendario">calendario</Link>
        </div>
    );
}

export default HomePage;
