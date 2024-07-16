import { TransactionModel } from "../../transaction";

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
              { $eq: ["$receiverAccountId", _id] },
              "$value",
              { $multiply: ["$value", -1] },
            ],
          },
        },
      },
    },
  ]);
  return result[0].balance;
};
