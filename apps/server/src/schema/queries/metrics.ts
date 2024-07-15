import { TransactionModel } from "../../modules/transaction";

type Metric = {
  _id: number;
  sent: number;
  received: number;
  total: number;
};

export const getMonthlyMetrics = async (userAccountId: string) => {
  return await TransactionModel.aggregate([
    {
      $match: {
        $or: [
          { senderAccountId: userAccountId },
          { receiverAccountId: userAccountId },
        ],
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        sent: {
          $sum: {
            $cond: [{ $eq: ["$senderAccountId", userAccountId] }, 1, 0],
          },
        },
        received: {
          $sum: {
            $cond: [{ $eq: ["$receiverAccountId", userAccountId] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        sent: 1,
        received: 1,
        total: { $add: ["$sent", "$received"] },
      },
    },
  ]);
};

export const generateMonthlyMetrics = (metrics: Metric[]) => {
  const currentMonth = new Date().getMonth() + 1;
  const months = Array.from({ length: currentMonth }, (_, i) => i + 1);

  return months.map(
    (month) =>
      metrics.find((m) => m._id === month) || {
        _id: month,
        sent: 0,
        received: 0,
        total: 0,
      }
  );
};
