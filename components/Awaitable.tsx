interface AwaitableProps {
    isLoading: boolean;
    isError: boolean;
    errorNode: JSX.Element;
    loadingNode: JSX.Element;
    loadedNode: JSX.Element;
}

export default function Awaitable(props: AwaitableProps){
    if(props.isLoading){
        return props.loadingNode;
    }

    if(props.isError){
        return props.errorNode;
    }

    return props.loadedNode;
}