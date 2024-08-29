import { Button, Result } from "antd";

export default function CommonErrorBoundaryPanel(props: any) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Result
        status="500"
        title="something went wrong!"
        subTitle={props.error.stack}
        className="mt-[-200px]"
        extra={
          <Button
            type="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
}
