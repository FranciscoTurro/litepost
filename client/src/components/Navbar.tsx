import { useApolloClient } from '@apollo/client';
import Link from 'next/link';
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from '../generated/generated-types';

export const Navbar = () => {
  const ApolloClient = useApolloClient();
  const { data } = useCurrentUserQuery();
  const [mutationFunction] = useLogoutMutation();

  return (
    <nav className="bg-linen px-2 sm:px-4 py-2.5">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link
          className="self-center text-4xl font-bold whitespace-nowrap"
          href={'/'}
        >
          Litepost
        </Link>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          {data?.currentUser ? (
            <ul className="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li className="block py-2 pl-3 pr-4 rounded md:hover:bg-transparent md:border-0 md:p-0">
                {data.currentUser.username}
              </li>
              <button
                onClick={async () => {
                  mutationFunction();
                  await ApolloClient.resetStore();
                }}
                className="block py-2 pl-3 pr-4 rounded md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0"
              >
                Logout
              </button>
            </ul>
          ) : (
            <ul className="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li>
                <Link
                  className="block py-2 pl-3 pr-4 rounded md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0"
                  href={'/login'}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 pl-3 pr-4 rounded md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0"
                  href={'/register'}
                >
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};
