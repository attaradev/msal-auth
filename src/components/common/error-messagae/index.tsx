import { Alert } from 'reactstrap';

interface ErrorMessageProps {
  debug: string;
  message: string;
}

export default function ErrorMessage(props: ErrorMessageProps) {
  return (
    <Alert color="danger">
      <p className="mb-3">{props.message}</p>
      {
        props.debug && <pre className="alert-pre border bg-light p-2"><code>{props.debug}</code></pre>
      }
    </Alert>
  );
}