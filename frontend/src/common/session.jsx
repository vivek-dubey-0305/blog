// const storeInSession = (key, value) => {
//   return sessionStorage.setItem(key, value);

// };

// const lookInSession = (key) => {
//   return sessionStorage.getItem(key);
// };

// const removeFromSession = (key) => {
//   return sessionStorage.removeItem(key);
// };

// const logOutUser = () => {
//   sessionStorage.clear();
// };

// export { storeInSession, lookInSession, removeFromSession, logOutUser };

import Cookies from "js-cookie";

// Save a value in cookies
const storeInCookies = (key, value) => {
  // const maxAgeInSeconds = 30; // 30 seconds

  Cookies.set(key, value, { secure: true, sameSite: "Strict" });
};

// const storeInCookies = (key, value) => {
//   const maxAgeInSeconds = 60; // 30 seconds
//   const maxAgeInDays = maxAgeInSeconds / (24 * 60 * 60); // Convert seconds to days
//   Cookies.set(key, value, {
//     secure: true,
//     sameSite: "Strict",
//     expires: maxAgeInDays,
//   });
// };

// Retrieve a value from cookies
const lookInCookies = (key) => {
  return Cookies.get(key);
};

// Remove a value from cookies
const removeFromCookies = (key) => {
  Cookies.remove(key, { secure: true, sameSite: "Strict" });
};

// Clear all cookies (used for logout)
const logOutUser = () => {
  Object.keys(Cookies.get()).forEach((cookieKey) => Cookies.remove(cookieKey));
};

export { storeInCookies, lookInCookies, removeFromCookies, logOutUser };
