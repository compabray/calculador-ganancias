import { useLocation } from "react-router-dom";

function Dashboard () {

    const location = useLocation();

    console.log(location.state?.data.id);

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard;