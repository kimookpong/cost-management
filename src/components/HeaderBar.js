import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { navigation, userNavigation } from "@/lib/params";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown } from "react-icons/fi";

export default function Example() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState("light");
  const [avatar, setAvatar] = useState("/avatar.png");

  useEffect(() => {
    setMounted(theme);
  }, [theme]);

  return (
    <>
      <Disclosure as="nav" className="bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <a href="/">
                  <img
                    alt="Logo"
                    src="/logo.png"
                    width={80}
                    className="transition-transform transform hover:scale-105 transition-transform"
                  />
                </a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center">
                  {navigation.map((item) => {
                    if (
                      session &&
                      session.user.userAccess.includes(String(item.id))
                    ) {
                      return item.child ? (
                        <Menu as="div" key={item.name} className="relative">
                          <MenuButton className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-700 hover:dark:text-white rounded-lg p-2 text-sm font-medium transition duration-300">
                            <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span>{item.name}</span>
                            <FiChevronDown className="w-4 h-4" />
                          </MenuButton>
                          <MenuItems className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black/5 z-50 p-2">
                            {item.child.map((sub) => (
                              <MenuItem key={sub.name}>
                                <a
                                  href={sub.href}
                                  className="flex items-center p-4 text-sm  text-gray-800 hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-700 hover:dark:text-white space-x-2 rounded-md"
                                >
                                  {sub.icon && (
                                    <sub.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  )}
                                  <span>{sub.name}</span>
                                </a>
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-700 hover:dark:text-white rounded-lg p-2 text-sm font-medium transition duration-300"
                        >
                          <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span>{item.name}</span>
                        </a>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-hidden"
                  onClick={() =>
                    setTheme(mounted === "dark" ? "light" : "dark")
                  }
                >
                  {mounted === "light" ? (
                    <FiSun
                      aria-hidden="true"
                      className="text-yellow-500 size-6"
                    />
                  ) : (
                    <FiMoon aria-hidden="true" className="size-6" />
                  )}
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-hidden hover:scale-105 transition-transform">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={avatar}
                        className="size-8 rounded-full"
                        loading="lazy"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-64 p-2 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem key="profile">
                      <div className="flex items-center space-x-3 p-3 rounded-md  ">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-white">
                          {session
                            ? session.user.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>

                        <div className="flex flex-col py-4">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {session ? session.user.name : "Username"}
                          </span>

                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {session ? session.user.userRole : "User Role"}
                          </span>
                        </div>
                      </div>
                    </MenuItem>

                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block p-4 text-sm text-gray-700 dark:text-gray-100 data-focus:bg-gray-100 data-focus:outline-hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}

                    <MenuItem key="logout">
                      <button
                        onClick={() => signOut()}
                        className="w-full text-center p-4 text-sm font-medium text-red-500 border border-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                      >
                        ออกจากระบบ
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-800 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white focus:outline-hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <FiMenu className="block size-6 group-data-open:hidden" />
                <FiX className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) =>
              item.child ? (
                <div key={item.name} className="space-y-1">
                  <DisclosureButton className="flex w-full items-center justify-between text-gray-800 dark:text-gray-300 rounded-md px-3 py-2 text-base font-medium">
                    <span className="flex items-center space-x-2">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span>{item.name}</span>
                    </span>
                    <FiChevronDown className="w-4 h-4" />
                  </DisclosureButton>
                  <div className="ml-6 space-y-1">
                    {item.child.map((sub) => (
                      <DisclosureButton
                        key={sub.name}
                        as="a"
                        href={sub.href}
                        className="flex items-center space-x-2 block rounded-md px-3 py-2 text-base font-medium text-gray-800 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white"
                      >
                        {sub.icon && (
                          <sub.icon className="w-4 h-4 text-gray-800 dark:text-gray-300" />
                        )}
                        <span>{sub.name}</span>
                      </DisclosureButton>
                    ))}
                  </div>
                </div>
              ) : (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-800 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white rounded-md px-3 py-2 text-base font-medium"
                >
                  <item.icon className="w-5 h-5 text-gray-800 dark:text-gray-300" />
                  <span>{item.name}</span>
                </DisclosureButton>
              )
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700  pt-4 pb-3">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <img
                  alt=""
                  src={avatar}
                  className="size-10 rounded-full"
                  loading="lazy"
                />
              </div>
              <div className="ml-3">
                <div className="text-base/5 font-medium text-gray-800 dark:text-white">
                  {session ? session.user.name : "Username"}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {session ? session.user.userRole : ""}
                </div>
              </div>

              <button
                type="button"
                className="relative ml-auto shrink-0 rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-white  focus:outline-hidden"
                onClick={() => setTheme(mounted === "dark" ? "light" : "dark")}
              >
                {mounted === "light" ? (
                  <FiSun
                    aria-hidden="true"
                    className="text-yellow-500 size-6"
                  />
                ) : (
                  <FiMoon aria-hidden="true" className="size-6" />
                )}
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2 bg-white dark:bg-gray-800">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}

              <DisclosureButton
                key="logout"
                as="a"
                className="block w-100 rounded-md px-3 py-2 text-base font-medium  text-gray-800 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white"
                onClick={() => signOut()}
              >
                ออกจากระบบ
              </DisclosureButton>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}
