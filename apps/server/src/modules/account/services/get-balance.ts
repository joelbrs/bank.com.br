import { TransactionModel } from "../../transaction/transaction-model";

export const getBalance = async (_id: string) => {
  const result = await TransactionModel.aggregate([
    {
      $match: {
        $or: [{ senderAccountId: _id }, { receiverAccountId: _id }],
      },
    },
    {
      $group: {
        _id: null,
        balance: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$senderAccountId", _id] },
                  { $eq: ["$receiverAccountId", _id] },
                ],
              },
              "$value",
              {
                $cond: [
                  { $eq: ["$receiverAccountId", _id] },
                  "$value",
                  { $multiply: ["$value", -1] },
                ],
              },
            ],
          },
        },
      },
    },
  ]);

  return (result[0]?.balance as number) || 0;
};
