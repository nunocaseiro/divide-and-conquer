import { useMutation } from 'react-query';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { AxiosError } from 'axios';

import { resetTokenEmail, resetUserPassword } from '@/api/authService';
import {
  EmailUser,
  NewPassword,
  ResetPasswordResponse,
  ResetTokenResponse,
  UseUserType,
} from '@/types/user/user';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { deleteUserRequest, updateUserIsAdminRequest } from '../api/userService';
import useUserUtils from './useUserUtils';

const useUser = (): UseUserType => {
  const { setToastState, queryClient } = useUserUtils();

  const resetToken = useMutation<ResetTokenResponse, AxiosError, EmailUser>(
    (emailUser: EmailUser) => resetTokenEmail(emailUser),
    {
      mutationKey: 'forgotPassword',
      onSuccess: async (response: ResetTokenResponse) => response.message,
    },
  );

  const resetPassword = useMutation<ResetPasswordResponse, AxiosError, NewPassword>(
    (data: NewPassword) => resetUserPassword(data),
    {
      mutationKey: 'resetPassword',
      onSuccess: async (response: ResetPasswordResponse) => response.message,
    },
  );

  const loginAzure = async () => {
    signIn<RedirectableProviderType>('azure-ad', {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: true,
    });
  };

  const updateUserIsAdmin = useMutation(updateUserIsAdminRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('usersWithTeams');

      // // updates the usersList recoil
      // const users = usersWithTeamsList.map((user) =>
      //   user.user._id === data._id ? { ...user, isAdmin: data.isSAdmin } : user,
      // );

      // setUsersWithTeamsList(users);

      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error while updating the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteUser = useMutation(deleteUserRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('usersWithTeams');

      // updates the usersList recoil
      // const users = usersWithTeamsList.filter(
      //   (userWithTeams) => userWithTeams.user._id !== variables.id,
      // );

      // setUsersWithTeamsList(users);

      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error while deleting the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return { loginAzure, resetToken, resetPassword, updateUserIsAdmin, deleteUser };
};

export default useUser;
