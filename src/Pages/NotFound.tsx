import {Link} from "react-router-dom";
import {Center, Title} from "@mantine/core";

function NotFound() {
    return (
        <>
            <title>Not Found | Games at schlafhase.uk</title>
            <Center h="100vh">
                <div style={{textAlign: 'center'}}>
                    <Title order={1}>404 - Not Found</Title>
                    <p>The page you are looking for does not exist.</p>
                    <Link to="/">Go to Home</Link>
                </div>
            </Center>
        </>
    )
}

export default NotFound;