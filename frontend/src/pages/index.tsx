import type { CustomNextPage } from "next";
import { AppLayout } from "src/component/layout";

const Index: CustomNextPage = () => {
  return <div>index</div>;
};

Index.getLayout = AppLayout;

export default Index;
