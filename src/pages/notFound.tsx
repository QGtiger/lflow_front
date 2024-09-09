import useRouter from "@/hooks/useRouter";
import { Button, Result } from "antd";

export default function NotFound() {
  const { nav } = useRouter();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              nav("/", {
                replace: true,
              });
            }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
}
