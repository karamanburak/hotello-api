module.exports = (req, res, next) => {
  //! Filtering
  const filter = req.query?.filter || {};

  //* Searching
  const search = req.query?.search || {};
  for (let key in search) {
    search[key] = { $regex: search[key], $options: "i" };
  }

  //? Sorting
  const sort = req.query?.sort || "-createdAt";

  //! Price filtering
  const priceRange = req.query?.priceRange || {};

  if (priceRange.min && priceRange.max) {
    filter.pricePerNight = { $gte: priceRange.min, $lte: priceRange.max };
  } else if (priceRange.min) {
    filter.pricePerNight = { $gte: priceRange.min };
  } else if (priceRange.max) {
    filter.pricePerNight = { $lte: priceRange.max };
  }

  //* Room type filtering
  const roomType = req.query?.roomType || null;
  if (roomType) {
    filter.roomType = roomType;
  }

  //* Star rating filtering
  const starRating = req.query?.starRating || null;
  if (starRating) {
    filter.starRating = starRating;
  }

  //* Facilities filtering
  const facilities = req.query?.facilities || null;
  if (facilities) {
    filter.facilities = { $in: facilities };
  }

  //* Availability filtering
  const available = req.query?.available || null;
  if (available) {
    filter.isAvailable = available === "true";
  }

  //* Pagination
  //! Limit
  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : 6;

  //? Page
  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;

  //! Skip
  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  res.getModelList = async function (
    Model,
    customFilter = {},
    populate = null
  ) {
    return await Model.find({ ...filter, ...customFilter, ...search })
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(populate);
  };

  res.getModelListDetails = async (Model, customFilter = {}) => {
    const totalRecords = await Model.countDocuments({
      ...filter,
      ...customFilter,
      ...search,
    });
    const data = await Model.find({ ...filter, ...customFilter, ...search })
      .sort(sort)
      .limit(limit)
      .skip(skip);

    let details = {
      filter,
      customFilter,
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        activePage: page + 1,
        next: page + 2,
        totalPage: Math.ceil(totalRecords / limit),
      },
      totalRecords,
    };

    details.pages.next =
      details.pages.next > details.pages.totalPage ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};
