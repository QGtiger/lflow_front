import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  );
}
