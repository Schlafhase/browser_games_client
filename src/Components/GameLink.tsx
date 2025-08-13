import "./GameLink.css"
import {Button, Card, Group, Text, Title} from "@mantine/core";
import {Link} from "react-router-dom";

type GameLinkProps = {
    title: string;
    url: string;
    description: string;
};

function GameLink({title, url, description}: GameLinkProps) {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mt="md" mb="xs">
                    <Title order={2} fw={500}>{title}</Title>
                </Group>

                <Text size="sm" c="dimmed">
                    {description}
                </Text>

                <Button color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                        component={Link}
                        to={url}>
                    Play
                </Button>
            </Card>
        </>)
}

export default GameLink