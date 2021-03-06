const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");

const APIError = require("../../utils/APIError");

/**
 * Food Schema
 * @private
 */
const foodSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    product_amount: {
      type: Number,
      required: true,
    },
    product_group: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["perishable", "not perishable"],
    },
    distribution_to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    distribution_from: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    expiration_date: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    pack_date: {
      type: Date,
      required: true,
      trim: true,
      lowercase: true,
    },
    sell_by_date: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    use_by_date: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
foodSchema.pre("save", async function save(next) {
  try {
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
foodSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "product_name",
      "product_amount",
      "product_group",
      "distribution_to",
      "distribution_from",
      "expiration_date",
      "pack_date",
      "sell_by_date",
      "use_by_date",
      "createdAt",
    ];

    fields.forEach((field) => {
      transformed[field] = field === "id" ? this["_id"] : this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
foodSchema.statics = {
  /**
   * Get food
   *
   * @param {ObjectId} id - The objectId of food.
   * @returns {Promise<Food, APIError>}
   */
  async get(id) {
    try {
      let food;

      if (mongoose.Types.ObjectId.isValid(id)) {
        food = await this.findById(id).exec();
      }

      if (food) {
        return food;
      }

      throw new APIError({
        message: "Food does not exist",
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List food in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of food to be skipped.
   * @param {number} limit - Limit number of food to be returned.
   * @returns {Promise<Food[]>}
   */
  list({
    page = 1,
    perPage = 1000,
    product_name,
    product_amount,
    product_group,
    distribution_to,
    distribution_from,
    expiration_date,
    pack_date,
    sell_by_date,
    use_by_date,
  }) {
    const options = omitBy(
      {
        product_name,
        product_amount,
        product_group,
        distribution_to,
        distribution_from,
        expiration_date,
        pack_date,
        sell_by_date,
        use_by_date,
      },
      isNil
    );

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Food
 */
module.exports = mongoose.model("Food", foodSchema);
