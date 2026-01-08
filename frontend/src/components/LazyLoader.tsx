import { Suspense, type ReactNode } from "react";
import ErrorPage from "./common/ErrorPage";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function LazyLoader({ children, fallback = null }: Props) {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
