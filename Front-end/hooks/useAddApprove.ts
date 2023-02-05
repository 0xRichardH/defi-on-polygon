import useGoflowContract from "./contracts/useGoflowContract";
import { useMutation } from "react-query";
import { makeBig } from "../lib/number-utils";

interface UseAddApprovePayload {
  address: string;
  amount: string;
}

const useAddApprove = () => {
  const contract = useGoflowContract();
  return useMutation(async ({ address, amount }: UseAddApprovePayload) => {
    await contract.approve(address, makeBig(amount));
  });
};

export default useAddApprove;
