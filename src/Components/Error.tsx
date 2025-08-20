import {Anchor, Blockquote, Center, Spoiler, Stack, Title} from "@mantine/core";
import "./Error.css";

function Error({error, errorDetails}: { error: string, errorDetails?: string | null }) {
    return (
        <Center h="100vh">
            <Stack w={500}>
                <div style={{textAlign: 'center'}}>
                    <Title order={1}>Something went wrong</Title>
                    <p>{error} 
                        <br/>
                        <Anchor href={""}>Reload</Anchor>
                    </p>

                    {errorDetails ? <Spoiler showLabel={<span className={"spoilerLabel"}>Show details</span>}
                                             hideLabel={<span className={"spoilerLabel"}>Hide details</span>}
                                             maxHeight={0}>
                        <Blockquote color={"red"}>
                            {errorDetails}
                        </Blockquote>
                    </Spoiler> : null}
                </div>
            </Stack>
        </Center>
    )
}

export default Error;