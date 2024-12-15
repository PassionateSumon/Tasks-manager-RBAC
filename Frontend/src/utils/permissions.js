export const mapPermissions = (permissions) => {
  const permsMap = {};
  permissions.forEach((perm) => {
    const [key] = Object.keys(perm);
    if (!permsMap[key]) permsMap[key] = [];
    permsMap[key].push(perm[key]);
  });
  return permsMap;
};
