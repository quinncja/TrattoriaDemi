const Giftcard = require("./Giftcard");

async function getGiftcardDataForBarChart() {
  try {
    const countsPerAmount = await Giftcard.aggregate([
      {
        $match: {
          isPaid: true
        }
      },
      {
        $group: {
          _id: "$amount",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalAmountResult = await Giftcard.aggregate([
      {
        $match: {
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalAmount =
      totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;

    const data = countsPerAmount.map((item) => ({
      amount: item._id.toString(),
      count: item.count,
    }));
    
    const recentItems = await Giftcard.find({ isPaid: true })
      .sort({ datePurchased: -1 })
      .limit(5)
      .lean();

    return { data, totalAmount, recentItems };

  } catch (error) {
    console.error("Error fetching gift card data:", error);
    throw error;
  }
}

module.exports = { getGiftcardDataForBarChart };
