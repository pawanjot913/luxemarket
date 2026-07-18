const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const AppError = require("../../utils/AppError");

const getUserOrThrow = async (userId, selectPassword = false) => {
  let query = User.findById(userId);

  if (selectPassword) {
    query = query.select("+password");
  }

  const user = await query;

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const getMyProfile = async (userId) => {
  const user = await getUserOrThrow(userId);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    addresses: user.addresses,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateProfile = async (userId, data) => {
  const user = await getUserOrThrow(userId);

  user.name = data.name;

  if (data.avatar !== undefined) {
    user.avatar = data.avatar;
  }

  await user.save();

  return user;
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await getUserOrThrow(userId, true);

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (isSamePassword) {
    throw new AppError(
      "New password cannot be same as current password",
      400
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
};

const getAddresses = async (userId) => {
  const user = await getUserOrThrow(userId);

  return user.addresses;
};

const addAddress = async (userId, addressData) => {
  const user = await getUserOrThrow(userId);

  if (addressData.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  if (user.addresses.length === 0) {
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);

  await user.save();

  return user.addresses;
};

const updateAddress = async (
  userId,
  addressId,
  data
) => {
  const user = await getUserOrThrow(userId);

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  Object.keys(data).forEach((key) => {
    if (key !== "_id") {
      address[key] = data[key];
    }
  });

  await user.save();

  return address;
};

const deleteAddress = async (
  userId,
  addressId
) => {
  const user = await getUserOrThrow(userId);

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  const wasDefault = address.isDefault;

  address.deleteOne();

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
};

const setDefaultAddress = async (
  userId,
  addressId
) => {
  const user = await getUserOrThrow(userId);

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.equals(addressId);
  });

  await user.save();

  return user.addresses;
};

module.exports = {
  getMyProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};