import { useMemo } from 'react';

import { RolePermission } from '@/constants/rolePermission';
import { useAppSelector } from '@/stores';
import type { CurrentUser } from '@/types/authTypes';

const useAccess = () => {
  // State quyền truy cập từ accessList
  const { user, accessToken } = useAppSelector((state) => state.authen);
  // fix me ===> sửa thành object lấy từ store

  return useMemo(() => {
    const currentUser: CurrentUser = {
      roles: [user.roles]
    };

    const isAuthen = !!accessToken;
    const isAdmin = !!currentUser && currentUser.roles?.includes(RolePermission.ADMIN);
    const isUser = !!currentUser && currentUser.roles?.includes(RolePermission.USER);

    return {
      isAuthen,
      isUser,
      isAdmin
    };
  }, [accessToken, user.roles]);
};

export default useAccess;
