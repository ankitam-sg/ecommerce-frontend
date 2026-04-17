type Props = {
    msg: string;
};

const ErrorState = ({ msg }: Props) => {
    return <p className="text-center text-red-500">{msg}</p>;
};

export default ErrorState;
