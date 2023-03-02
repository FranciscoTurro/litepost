import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SubmitButton } from '../components/SubmitButton';
import { useLoginMutation } from '../generated/generated-types';
import { User } from '../types/types';

const Login = () => {
  const router = useRouter();

  const [mutateFunction, { loading, client }] = useLoginMutation();

  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await mutateFunction({
      variables: { username: user.username, password: user.password },
    });
    if (response.data?.loginUser.error) {
      if (response.data.loginUser.error.field === 'username')
        setUsernameError(response.data.loginUser.error.message);
      if (response.data.loginUser.error.field === 'password')
        setPasswordError(response.data.loginUser.error.message);
    } else if (response.data?.loginUser.user) {
      client.resetStore();
      router.push('/');
    }
  };

  return (
    <div className="max-w-3xl w-full mt-8 mx-auto flex flex-col items-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight mdl:text-5xl lg:text-6xl">
        Login
      </h1>
      <form onSubmit={handleSubmit} autoComplete="off" className="w-3/4">
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <div>
            <input
              onChange={(e) => {
                setUsernameError('');
                setUser({ ...user, username: e.target.value });
              }}
              value={user.username}
              id="username"
              className={`bg-gray-50 border-2 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-atomic_teal-1 block w-full p-2.5
 ${usernameError ? 'bg-red-100 text-red-600' : null}`}
            />
            {usernameError ? (
              <p className="pl-2 text-red-600">{usernameError}</p>
            ) : null}
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <div>
            <input
              onChange={(e) => {
                setPasswordError('');
                setUser({ ...user, password: e.target.value });
              }}
              value={user.password}
              type="password"
              id="password"
              className={`bg-gray-50 border-2 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-atomic_teal-1 block w-full p-2.5
 ${passwordError ? 'bg-red-100 text-red-600' : null}`}
            />
            {passwordError ? (
              <p className="pl-2 text-red-600">{passwordError}</p>
            ) : null}
          </div>
        </div>
        <SubmitButton name="Login" loading={loading} />
      </form>
    </div>
  );
};

export default Login;
