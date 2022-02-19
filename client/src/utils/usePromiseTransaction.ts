import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useState } from "react";
import { useTransactionsContext } from "@usedapp/core/dist/esm/src";
import {
  TransactionStatus,
  TransactionOptions,
} from "@usedapp/core/dist/esm/src";

export function usePromiseTransaction(
  chainId: number | undefined,
  options?: TransactionOptions
) {
  const [state, setState] = useState<TransactionStatus>({ status: "None" });
  const { addTransaction } = useTransactionsContext();

  const promiseTransaction = async (
    transactionPromise: Promise<TransactionResponse>
  ) => {
    if (!chainId) return;
    let transaction: any = undefined;
    try {
      transaction = await transactionPromise;

      setState({ transaction, status: "Mining", chainId });
      addTransaction({
        transaction,
        submittedAt: Date.now(),
        transactionName: options?.transactionName,
      });
      const receipt = await transaction.wait();

      setState({ receipt, transaction, status: "Success", chainId });
    } catch (e: any) {
      const errorMessage = e.reason ?? e.message;
      console.log(e);

      if (transaction) {
        setState({
          status: "Fail",
          transaction,
          receipt: e.receipt,
          errorMessage,
          chainId,
        });
      } else {
        setState({ status: "Exception", errorMessage, chainId });
      }
    }
  };
  return { promiseTransaction, state };
}
