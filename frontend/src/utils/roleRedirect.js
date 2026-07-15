export const getRedirectPathByRole = (role) => {
  switch (role) {
    case 'USER': return '/user';
    case 'STAFF': return '/staff';
    case 'VET': return '/vet';
    case 'ADMIN': return '/admin';
    default: return '/login';
  }
};
