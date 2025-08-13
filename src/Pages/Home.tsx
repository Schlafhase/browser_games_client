import GameLink from "../Components/GameLink.tsx";
import {Blockquote, Container, Stack} from "@mantine/core";


function Home() {

    return (
        <Container strategy={"grid"} size={"500"}>
            <Stack>
                <Blockquote color={"blue"} mt={"xl"}>
                    This is a collection of games that can be played in the browser.
                    I stole all of the ideas from real card/board games :)
                </Blockquote>
                
                <GameLink title={"Pretender"} url={"/pretender"}
                          description={"Pretender is a game where a random word is chosen. Every player but the pretender " +
                              "knows the word. The goal is to find the pretender."}/>

                <GameLink title={"Six Second Scribbles"} url={"/six-second-scribbles"}
                          description={"Six Second Scribbles is a game where players have sixty seconds to draw ten pictures. " +
                              "Players will then guess what the other drawings are supposed to be."}/>
            </Stack>
        </Container>
    )
}

export default Home
